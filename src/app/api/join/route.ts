import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateNextMemberId } from "@/lib/member-id";
import { formatDate } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      planId,
      startDate,
      photoUrl,
    } = body;

    // Validation
    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!planId) {
      return NextResponse.json({ error: "Please select a membership plan" }, { status: 400 });
    }

    // Verify Plan exists
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: "Invalid or inactive membership plan selected" }, { status: 400 });
    }

    // Generate unique member ID
    const memberId = await generateNextMemberId();

    // Create client
    const client = await prisma.client.create({
      data: {
        memberId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim().toLowerCase() : null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        address: address ? address.trim() : null,
        emergencyContactName: emergencyContactName ? emergencyContactName.trim() : null,
        emergencyContactPhone: emergencyContactPhone ? emergencyContactPhone.trim() : null,
        photoUrl: photoUrl || null,
        status: "ACTIVE",
      },
    });

    // Calculate dates
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays);

    // Create Membership
    const membership = await prisma.membership.create({
      data: {
        clientId: client.id,
        planId: plan.id,
        startDate: start,
        endDate: end,
        amount: plan.price,
        discount: 0,
        finalAmount: plan.price,
        paymentStatus: "PENDING",
        status: "ACTIVE",
        notes: "Registered online via Join Now form",
      },
    });

    // Create initial pending payment record
    await prisma.payment.create({
      data: {
        clientId: client.id,
        membershipId: membership.id,
        amount: plan.price,
        paymentMethod: "OTHER",
        paymentDate: new Date(),
        transactionId: `JOIN-${Date.now().toString().slice(-6)}`,
        status: "PENDING",
        notes: "Pending front-desk / online payment verification",
      },
    });

    return NextResponse.json(
      {
        success: true,
        memberId: client.memberId,
        clientName: client.fullName,
        planName: plan.name,
        price: plan.price,
        startDate: formatDate(start),
        endDate: formatDate(end),
        message: "Registration completed successfully! Present your Member ID at the front desk.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
