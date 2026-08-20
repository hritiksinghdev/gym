import { prisma } from "@/lib/prisma";

export async function generateNextMemberId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  
  // Fetch settings for prefix
  const settings = await prisma.gymSettings.findUnique({
    where: { id: "default" },
  });
  const prefix = settings?.memberIdPrefix || "GYM";

  // Search for the highest member ID for the current year
  const prefixWithYear = `${prefix}-${currentYear}-`;
  
  const latestClient = await prisma.client.findFirst({
    where: {
      memberId: {
        startsWith: prefixWithYear,
      },
    },
    orderBy: {
      memberId: "desc",
    },
  });

  if (!latestClient) {
    return `${prefixWithYear}0001`;
  }

  // Extract the sequence number part
  const parts = latestClient.memberId.split("-");
  const lastSeqStr = parts[parts.length - 1];
  const lastSeq = parseInt(lastSeqStr, 10);

  if (isNaN(lastSeq)) {
    const totalCount = await prisma.client.count();
    const nextSeq = String(totalCount + 1).padStart(4, "0");
    return `${prefixWithYear}${nextSeq}`;
  }

  const nextSeq = String(lastSeq + 1).padStart(4, "0");
  return `${prefixWithYear}${nextSeq}`;
}
