import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { getMembershipStatus } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            plan: true,
          },
          orderBy: { startDate: "desc" },
        },
        payments: {
          include: {
            membership: {
              include: {
                plan: true,
              },
            },
          },
          orderBy: { paymentDate: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Compute status for all memberships
    const enrichedMemberships = client.memberships.map((m) => ({
      ...m,
      statusInfo: getMembershipStatus(m.startDate, m.endDate, m.status),
    }));

    const latestMembership = enrichedMemberships[0] || null;

    let computedStatus = "NO_MEMBERSHIP";
    let statusInfo = null;

    if (client.status === "SUSPENDED") {
      computedStatus = "SUSPENDED";
    } else if (latestMembership) {
      computedStatus = latestMembership.statusInfo.status;
      statusInfo = latestMembership.statusInfo;
    }

    return NextResponse.json({
      ...client,
      memberships: enrichedMemberships,
      latestMembership,
      computedStatus,
      statusInfo,
    });
  } catch (error) {
    console.error("Failed to fetch client profile:", error);
    return NextResponse.json({ error: "Failed to fetch client profile" }, { status: 500 });
  }
}

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

    const updated = await prisma.client.update({
      where: { id },
      data: {
        fullName: body.fullName !== undefined ? body.fullName.trim() : undefined,
        phone: body.phone !== undefined ? body.phone.trim() : undefined,
        email: body.email !== undefined ? (body.email ? body.email.trim().toLowerCase() : null) : undefined,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        gender: body.gender !== undefined ? body.gender : undefined,
        address: body.address !== undefined ? body.address : undefined,
        emergencyContactName:
          body.emergencyContactName !== undefined ? body.emergencyContactName : undefined,
        emergencyContactPhone:
          body.emergencyContactPhone !== undefined ? body.emergencyContactPhone : undefined,
        photoUrl: body.photoUrl !== undefined ? body.photoUrl : undefined,
        status: body.status !== undefined ? body.status : undefined,
        notes: body.notes !== undefined ? body.notes : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update client:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
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

    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("Failed to delete client:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
