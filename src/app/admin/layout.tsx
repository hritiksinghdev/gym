import AdminSidebar from "@/components/admin/Sidebar";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.gymSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error(
      "AdminLayout database query error:",
      error instanceof Error ? error.message : "Unable to load admin settings"
    );
  }

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
