import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

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

    const updated = await prisma.membershipPlan.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name.trim() : undefined,
        durationDays: body.durationDays !== undefined ? parseInt(body.durationDays, 10) : undefined,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        description: body.description !== undefined ? body.description : undefined,
        benefits:
          body.benefits !== undefined
            ? typeof body.benefits === "string"
              ? body.benefits
              : JSON.stringify(body.benefits)
            : undefined,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
        sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder, 10) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
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

    // Check if plan has active memberships
    const usageCount = await prisma.membership.count({
      where: { planId: id },
    });

    if (usageCount > 0) {
      // Instead of hard deleting, deactivate it to preserve membership history
      await prisma.membershipPlan.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Plan has existing memberships and has been deactivated instead of deleted.",
      });
    }

    await prisma.membershipPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Failed to delete plan:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
