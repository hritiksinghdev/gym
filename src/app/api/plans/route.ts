import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const plans = await prisma.membershipPlan.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, durationDays, price, description, benefits, isActive, sortOrder } = body;

    if (!name || !durationDays || price === undefined) {
      return NextResponse.json(
        { error: "Plan name, duration (days), and price are required" },
        { status: 400 }
      );
    }

    const newPlan = await prisma.membershipPlan.create({
      data: {
        name: name.trim(),
        durationDays: parseInt(durationDays, 10),
        price: parseFloat(price),
        description: description || null,
        benefits: typeof benefits === "string" ? benefits : JSON.stringify(benefits || []),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error("Failed to create plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
