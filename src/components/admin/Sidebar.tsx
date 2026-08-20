"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Layers,
  DollarSign,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  Dumbbell,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  gymName?: string;
}

export default function AdminSidebar({ gymName = "TITAN FORGE" }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Memberships", href: "/admin/memberships", icon: CreditCard },
    { name: "Plans", href: "/admin/plans", icon: Layers },
    { name: "Payments", href: "/admin/payments", icon: DollarSign },
    { name: "Trainers", href: "/admin/trainers", icon: UserCheck },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/login");
    }
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="admin-sidebar">
      {/* Sidebar Header */}
      <div className="admin-sidebar-header">
        <Link href="/admin" className="logo-text" style={{ fontSize: "1.4rem" }}>
          <Dumbbell size={24} style={{ color: "var(--accent-red)" }} />
          <span>{gymName.split(" ")[0]}</span> {gymName.split(" ").slice(1).join(" ") || "GYM"}
        </Link>
        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px" }}>
          MANAGEMENT SYSTEM
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${active ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Quick Links & Logout */}
      <div className="admin-sidebar-footer">
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
            padding: "8px 10px",
            borderRadius: "var(--radius-sm)",
            marginBottom: "8px",
          }}
        >
          <ExternalLink size={15} /> View Public Website
        </Link>

        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          style={{
            width: "100%",
            justifyContent: "flex-start",
            color: "var(--status-danger-text)",
            borderColor: "#333",
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
