import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    let settings = await prisma.gymSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.gymSettings.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const updated = await prisma.gymSettings.upsert({
      where: { id: "default" },
      update: {
        gymName: body.gymName,
        tagline: body.tagline,
        logoUrl: body.logoUrl,
        heroHeadline: body.heroHeadline,
        heroDescription: body.heroDescription,
        address: body.address,
        phone: body.phone,
        whatsappNumber: body.whatsappNumber,
        email: body.email,
        openingHours: body.openingHours,
        googleMapsUrl: body.googleMapsUrl,
        instagramUrl: body.instagramUrl,
        facebookUrl: body.facebookUrl,
        youtubeUrl: body.youtubeUrl,
        currencySymbol: body.currencySymbol || "₹",
        memberIdPrefix: body.memberIdPrefix || "GYM",
      },
      create: {
        id: "default",
        ...body,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
