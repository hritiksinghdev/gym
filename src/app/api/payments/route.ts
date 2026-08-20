import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const method = searchParams.get("method");

    const payments = await prisma.payment.findMany({
      where: {
        clientId: clientId || undefined,
        paymentMethod: method || undefined,
      },
      include: {
        client: true,
        membership: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      clientId,
      membershipId,
      amount,
      paymentMethod,
      paymentDate,
      transactionId,
      status = "COMPLETED",
      notes,
    } = body;

    if (!clientId || amount === undefined || !paymentMethod) {
      return NextResponse.json(
        { error: "Client, amount, and payment method are required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        clientId,
        membershipId: membershipId || null,
        amount: parseFloat(amount),
        paymentMethod,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        transactionId: transactionId || `TXN-${Date.now().toString().slice(-6)}`,
        status,
        notes: notes || null,
      },
      include: {
        client: true,
        membership: {
          include: {
            plan: true,
          },
        },
      },
    });

    // If payment is linked to a membership and fully paid, update membership paymentStatus
    if (membershipId && status === "COMPLETED") {
      await prisma.membership.update({
        where: { id: membershipId },
        data: { paymentStatus: "PAID" },
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Failed to record payment:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
