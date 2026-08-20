import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { generateNextMemberId } from "@/lib/member-id";
import { getMembershipStatus } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "ALL";

    // Query clients with active / latest membership
    const clients = await prisma.client.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search } },
              { phone: { contains: search } },
              { memberId: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : undefined,
      include: {
        memberships: {
          include: {
            plan: true,
          },
          orderBy: { endDate: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute active status for each client
    const enrichedClients = clients.map((client) => {
      const latestMembership = client.memberships[0] || null;
      let computedStatus = "NO_MEMBERSHIP";
      let statusInfo = null;

      if (client.status === "SUSPENDED") {
        computedStatus = "SUSPENDED";
      } else if (latestMembership) {
        statusInfo = getMembershipStatus(
          latestMembership.startDate,
          latestMembership.endDate,
          latestMembership.status
        );
        computedStatus = statusInfo.status;
      }

      return {
        ...client,
        latestMembership,
        computedStatus,
        statusInfo,
      };
    });

    // Apply status filter if provided
    const filtered = enrichedClients.filter((client) => {
      if (statusFilter === "ALL") return true;
      if (statusFilter === "ACTIVE") return client.computedStatus === "ACTIVE";
      if (statusFilter === "EXPIRING_SOON") return client.computedStatus === "EXPIRING_SOON";
      if (statusFilter === "EXPIRED") return client.computedStatus === "EXPIRED";
      if (statusFilter === "SUSPENDED") return client.computedStatus === "SUSPENDED";
      return true;
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
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
      fullName,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      photoUrl,
      notes,
      planId,
      startDate,
      paymentMethod,
      discount = 0,
      paymentNotes,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Full Name and Phone Number are required" },
        { status: 400 }
      );
    }

    // Generate unique Member ID
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
        address: address || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        photoUrl: photoUrl || null,
        notes: notes || null,
        status: "ACTIVE",
      },
    });

    // If plan selected, create initial membership
    let membership = null;
    let payment = null;

    if (planId) {
      const plan = await prisma.membershipPlan.findUnique({
        where: { id: planId },
      });

      if (plan) {
        const start = startDate ? new Date(startDate) : new Date();
        const end = new Date(start);
        end.setDate(end.getDate() + plan.durationDays);

        const discountVal = parseFloat(discount) || 0;
        const finalAmount = Math.max(0, plan.price - discountVal);

        membership = await prisma.membership.create({
          data: {
            clientId: client.id,
            planId: plan.id,
            startDate: start,
            endDate: end,
            amount: plan.price,
            discount: discountVal,
            finalAmount,
            paymentStatus: paymentMethod ? "PAID" : "PENDING",
            status: "ACTIVE",
          },
        });

        // Record payment if payment method provided
        if (paymentMethod) {
          payment = await prisma.payment.create({
            data: {
              clientId: client.id,
              membershipId: membership.id,
              amount: finalAmount,
              paymentMethod: paymentMethod,
              paymentDate: new Date(),
              transactionId: `TXN-${Date.now().toString().slice(-6)}`,
              status: "COMPLETED",
              notes: paymentNotes || `Initial membership payment for ${plan.name}`,
            },
          });
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        client,
        membership,
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create client:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
