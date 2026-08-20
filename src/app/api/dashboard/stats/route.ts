import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { getMembershipStatus, formatDate, getWhatsAppReminderMessage } from "@/lib/utils";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.gymSettings.findUnique({
      where: { id: "default" },
    });
    const gymName = settings?.gymName || "TITAN FORGE GYM";

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
    const monthEnd = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 0, 23, 59, 59, 999);

    // 1. Total clients
    const totalMembers = await prisma.client.count();

    // 2. Today's new members
    const todayNewMembers = await prisma.client.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // 3. Today's Revenue (completed payments)
    const todayPayments = await prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        paymentDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      _sum: { amount: true },
    });
    const todayRevenue = todayPayments._sum.amount || 0;

    // 4. Monthly Revenue (completed payments this month)
    const monthPayments = await prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        paymentDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { amount: true },
    });
    const monthlyRevenue = monthPayments._sum.amount || 0;

    // 5. Fetch all latest memberships to accurately compute Active, Expiring Soon, Expired
    const allClients = await prisma.client.findMany({
      include: {
        memberships: {
          include: { plan: true },
          orderBy: { endDate: "desc" },
          take: 1,
        },
      },
    });

    let activeMembers = 0;
    let expiredMembers = 0;
    let expiringSoonMembers = 0;

    allClients.forEach((client) => {
      if (client.status === "SUSPENDED") return;
      const latest = client.memberships[0];
      if (!latest) {
        expiredMembers++;
        return;
      }
      const statusInfo = getMembershipStatus(latest.startDate, latest.endDate, latest.status);
      if (statusInfo.status === "ACTIVE") activeMembers++;
      else if (statusInfo.status === "EXPIRING_SOON") {
        expiringSoonMembers++;
        activeMembers++; // Expiring soon members are still currently active
      } else if (statusInfo.status === "EXPIRED") {
        expiredMembers++;
      }
    });

    // 6. Recent Members (last 10 registered)
    const recentClients = await prisma.client.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        memberships: {
          include: { plan: true },
          orderBy: { endDate: "desc" },
          take: 1,
        },
      },
    });

    const recentMembers = recentClients.map((client) => {
      const latest = client.memberships[0] || null;
      let statusInfo = null;
      if (client.status === "SUSPENDED") {
        statusInfo = {
          status: "SUSPENDED",
          label: "Suspended",
          badgeClass: "badge-suspended",
          daysRemaining: 0,
        };
      } else if (latest) {
        statusInfo = getMembershipStatus(latest.startDate, latest.endDate, latest.status);
      } else {
        statusInfo = {
          status: "NO_MEMBERSHIP",
          label: "No Plan",
          badgeClass: "badge-expired",
          daysRemaining: 0,
        };
      }

      return {
        id: client.id,
        memberId: client.memberId,
        fullName: client.fullName,
        phone: client.phone,
        planName: latest?.plan?.name || "None",
        startDate: latest?.startDate || null,
        endDate: latest?.endDate || null,
        statusInfo,
      };
    });

    // 7. Expiring Memberships (within the next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    const expiringMembershipsRaw = await prisma.membership.findMany({
      where: {
        status: { notIn: ["SUSPENDED", "CANCELLED"] },
        endDate: {
          gte: todayStart,
          lte: sevenDaysFromNow,
        },
      },
      include: {
        client: true,
        plan: true,
      },
      orderBy: { endDate: "asc" },
    });

    const expiringMemberships = expiringMembershipsRaw.map((m) => {
      const statusInfo = getMembershipStatus(m.startDate, m.endDate, m.status);
      const expiryFormatted = formatDate(m.endDate);
      const reminderMessage = getWhatsAppReminderMessage(
        m.client.fullName,
        m.plan.name,
        expiryFormatted,
        gymName
      );

      return {
        id: m.id,
        clientId: m.client.id,
        clientName: m.client.fullName,
        phone: m.client.phone,
        memberId: m.client.memberId,
        planName: m.plan.name,
        planId: m.plan.id,
        expiryDate: m.endDate,
        expiryFormatted,
        daysRemaining: statusInfo.daysRemaining,
        reminderMessage,
      };
    });

    return NextResponse.json({
      stats: {
        totalMembers,
        activeMembers,
        expiredMembers,
        expiringSoonMembers,
        todayNewMembers,
        todayRevenue,
        monthlyRevenue,
      },
      recentMembers,
      expiringMemberships,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
