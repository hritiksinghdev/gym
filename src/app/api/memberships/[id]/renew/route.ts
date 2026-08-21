import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existingMembership = await prisma.membership.findUnique({
      where: { id },
      include: {
        client: true,
        plan: true,
      },
    });

    if (!existingMembership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    const planId = body.planId || existingMembership.planId;
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Selected plan not found" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevEnd = new Date(existingMembership.endDate);
    prevEnd.setHours(0, 0, 0, 0);

    // If existing membership is still active, new start date is previous end date + 1 day
    // If already expired, start from today
    let newStartDate: Date;
    if (prevEnd >= today) {
      newStartDate = new Date(prevEnd);
      newStartDate.setDate(newStartDate.getDate() + 1);
    } else {
      newStartDate = new Date(today);
    }

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + plan.durationDays);

    const discountVal = parseFloat(body.discount) || 0;
    const finalAmount = Math.max(0, plan.price - discountVal);
    const paymentMethod = body.paymentMethod || "UPI";

    const newMembership = await prisma.membership.create({
      data: {
        clientId: existingMembership.clientId,
        planId: plan.id,
        startDate: newStartDate,
        endDate: newEndDate,
        amount: plan.price,
        discount: discountVal,
        finalAmount,
        paymentStatus: "PAID",
        status: "ACTIVE",
        notes: body.notes || `Renewed from previous membership #${id.slice(0, 8)}`,
      },
      include: {
        client: true,
        plan: true,
      },
    });

    // Record payment
    const payment = await prisma.payment.create({
      data: {
        clientId: existingMembership.clientId,
        membershipId: newMembership.id,
        amount: finalAmount,
        paymentMethod: paymentMethod,
        paymentDate: new Date(),
        transactionId: `TXN-${Date.now().toString().slice(-6)}`,
        status: "COMPLETED",
        notes: `Renewal payment for ${plan.name} plan via ${paymentMethod}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Membership renewed successfully",
      membership: newMembership,
      payment,
    });
  } catch (error) {
    console.error("Failed to renew membership:", error);
    return NextResponse.json({ error: "Failed to renew membership" }, { status: 500 });
  }
}
