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

  const firstName = gymName.split(" ")[0] || "TITAN";
  const secondName = gymName.split(" ").slice(1).join(" ") || "FORGE";

  return (
    <aside className="admin-sidebar">
      {/* Sidebar Header */}
      <div className="admin-sidebar-header">
        <Link href="/admin" className="logo-text" style={{ fontSize: "1.25rem" }}>
          <Dumbbell size={20} style={{ color: "var(--accent-red)" }} />
          <span>{firstName}</span> {secondName}
        </Link>
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginTop: "3px",
          }}
        >
          MANAGEMENT PORTAL
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
              <Icon size={16} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="admin-sidebar-footer">
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            color: "var(--text-secondary)",
            fontSize: "0.8rem",
            padding: "6px 8px",
            borderRadius: "var(--radius-sm)",
            marginBottom: "6px",
            transition: "color 0.15s ease",
          }}
        >
          <ExternalLink size={14} /> Public Website
        </Link>

        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          style={{
            width: "100%",
            justifyContent: "flex-start",
            color: "var(--status-danger-text)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            fontSize: "0.8rem",
          }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
