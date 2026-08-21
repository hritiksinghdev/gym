import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PUT(
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

    const updated = await prisma.membership.update({
      where: { id },
      data: {
        planId: body.planId !== undefined ? body.planId : undefined,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        amount: body.amount !== undefined ? parseFloat(body.amount) : undefined,
        discount: body.discount !== undefined ? parseFloat(body.discount) : undefined,
        finalAmount: body.finalAmount !== undefined ? parseFloat(body.finalAmount) : undefined,
        paymentStatus: body.paymentStatus !== undefined ? body.paymentStatus : undefined,
        status: body.status !== undefined ? body.status : undefined,
        notes: body.notes !== undefined ? body.notes : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update membership:", error);
    return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.membership.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Membership deleted successfully" });
  } catch (error) {
    console.error("Failed to delete membership:", error);
    return NextResponse.json({ error: "Failed to delete membership" }, { status: 500 });
  }
}
