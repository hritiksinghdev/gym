import AdminSidebar from "@/components/admin/Sidebar";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.gymSettings.findUnique({
    where: { id: "default" },
  });

  const gymName = settings?.gymName || "TITAN FORGE GYM";

  return (
    <div className="admin-layout">
      <AdminSidebar gymName={gymName} />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
