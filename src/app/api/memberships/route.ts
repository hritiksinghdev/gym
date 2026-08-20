import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { getMembershipStatus } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const statusFilter = searchParams.get("status") || "ALL";

    const memberships = await prisma.membership.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
        plan: true,
        payments: true,
      },
      orderBy: { endDate: "desc" },
    });

    const enriched = memberships.map((m) => ({
      ...m,
      statusInfo: getMembershipStatus(m.startDate, m.endDate, m.status),
    }));

    const filtered = enriched.filter((m) => {
      if (statusFilter === "ALL") return true;
      return m.statusInfo.status === statusFilter;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Failed to fetch memberships:", error);
    return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 });
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
      planId,
      startDate,
      endDate: customEndDate,
      discount = 0,
      paymentMethod,
      paymentStatus = "PAID",
      notes,
    } = body;

    if (!clientId || !planId) {
      return NextResponse.json(
        { error: "Client and Membership Plan are required" },
        { status: 400 }
      );
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Membership plan not found" }, { status: 404 });
    }

    const start = startDate ? new Date(startDate) : new Date();
    let end: Date;

    if (customEndDate) {
      end = new Date(customEndDate);
    } else {
      end = new Date(start);
      end.setDate(end.getDate() + plan.durationDays);
    }

    const discountVal = parseFloat(discount) || 0;
    const finalAmount = Math.max(0, plan.price - discountVal);

    const membership = await prisma.membership.create({
      data: {
        clientId,
        planId,
        startDate: start,
        endDate: end,
        amount: plan.price,
        discount: discountVal,
        finalAmount,
        paymentStatus: paymentMethod ? "PAID" : paymentStatus,
        status: "ACTIVE",
        notes: notes || null,
      },
      include: {
        client: true,
        plan: true,
      },
    });

    // Create payment if payment method provided
    let payment = null;
    if (paymentMethod && paymentStatus === "PAID") {
      payment = await prisma.payment.create({
        data: {
          clientId,
          membershipId: membership.id,
          amount: finalAmount,
          paymentMethod,
          paymentDate: new Date(),
          transactionId: `TXN-${Date.now().toString().slice(-6)}`,
          status: "COMPLETED",
          notes: `Payment for ${plan.name} plan via ${paymentMethod}`,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        membership,
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create membership:", error);
    return NextResponse.json({ error: "Failed to create membership" }, { status: 500 });
  }
}
