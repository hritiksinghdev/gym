import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { getMembershipStatus } from "@/lib/utils";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // 1. Total Members
    const totalMembers = await prisma.client.count();

    // 2. New members this month
    const newMembersThisMonth = await prisma.client.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // 3. Revenue this month & this year
    const monthlyRevAgg = await prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        paymentDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { amount: true },
    });
    const revenueThisMonth = monthlyRevAgg._sum.amount || 0;

    const yearlyRevAgg = await prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        paymentDate: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
      _sum: { amount: true },
    });
    const revenueThisYear = yearlyRevAgg._sum.amount || 0;

    // 4. Status counts
    const allClients = await prisma.client.findMany({
      include: {
        memberships: {
          include: { plan: true },
          orderBy: { endDate: "desc" },
        },
      },
    });

    let activeMembers = 0;
    let expiredMembers = 0;
    let totalRenewals = 0;

    const planCountMap: Record<string, { name: string; count: number; revenue: number }> = {};

    allClients.forEach((client) => {
      if (client.memberships.length > 1) {
        totalRenewals += client.memberships.length - 1;
      }

      if (client.status === "SUSPENDED") return;

      const latest = client.memberships[0];
      if (!latest) {
        expiredMembers++;
        return;
      }

      const statusInfo = getMembershipStatus(latest.startDate, latest.endDate, latest.status);
      if (statusInfo.isActive) {
        activeMembers++;
        const planName = latest.plan.name;
        if (!planCountMap[planName]) {
          planCountMap[planName] = { name: planName, count: 0, revenue: 0 };
        }
        planCountMap[planName].count += 1;
        planCountMap[planName].revenue += latest.finalAmount;
      } else {
        expiredMembers++;
      }
    });

    // 5. Payment methods breakdown
    const paymentMethodsAgg = await prisma.payment.groupBy({
      by: ["paymentMethod"],
      where: { status: "COMPLETED" },
      _sum: { amount: true },
      _count: { id: true },
    });

    return NextResponse.json({
      summary: {
        totalMembers,
        activeMembers,
        newMembersThisMonth,
        expiredMembers,
        totalRenewals,
        revenueThisMonth,
        revenueThisYear,
      },
      planDistribution: Object.values(planCountMap),
      paymentMethods: paymentMethodsAgg.map((pm) => ({
        method: pm.paymentMethod,
        totalAmount: pm._sum.amount || 0,
        transactionCount: pm._count.id || 0,
      })),
    });
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: "Failed to generate reports" }, { status: 500 });
  }
}
