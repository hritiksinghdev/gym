import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(trainers);
  } catch (error) {
    console.error("Failed to fetch trainers:", error);
    return NextResponse.json({ error: "Failed to fetch trainers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, specialization, experience, photoUrl, bio, phone, email, isActive, sortOrder } = body;

    if (!name || !specialization || !experience) {
      return NextResponse.json(
        { error: "Trainer name, specialization, and experience are required" },
        { status: 400 }
      );
    }

    const newTrainer = await prisma.trainer.create({
      data: {
        name: name.trim(),
        specialization: specialization.trim(),
        experience: experience.trim(),
        photoUrl: photoUrl || null,
        bio: bio || null,
        phone: phone || null,
        email: email || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
    });

    return NextResponse.json(newTrainer, { status: 201 });
  } catch (error) {
    console.error("Failed to create trainer:", error);
    return NextResponse.json({ error: "Failed to create trainer" }, { status: 500 });
  }
}
