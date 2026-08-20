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

    const updated = await prisma.trainer.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name.trim() : undefined,
        specialization: body.specialization !== undefined ? body.specialization.trim() : undefined,
        experience: body.experience !== undefined ? body.experience.trim() : undefined,
        photoUrl: body.photoUrl !== undefined ? body.photoUrl : undefined,
        bio: body.bio !== undefined ? body.bio : undefined,
        phone: body.phone !== undefined ? body.phone : undefined,
        email: body.email !== undefined ? body.email : undefined,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
        sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder, 10) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update trainer:", error);
    return NextResponse.json({ error: "Failed to update trainer" }, { status: 500 });
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

    await prisma.trainer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete trainer:", error);
    return NextResponse.json({ error: "Failed to delete trainer" }, { status: 500 });
  }
}
