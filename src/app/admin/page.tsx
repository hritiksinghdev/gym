"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  AlertTriangle,
  UserX,
  TrendingUp,
  DollarSign,
  UserPlus,
  MessageSquare,
  RefreshCw,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, formatDate, generateWhatsAppUrl } from "@/lib/utils";

interface DashboardData {
  stats: {
    totalMembers: number;
    activeMembers: number;
    expiredMembers: number;
    expiringSoonMembers: number;
    todayNewMembers: number;
    todayRevenue: number;
    monthlyRevenue: number;
  };
  recentMembers: Array<{
    id: string;
    memberId: string;
    fullName: string;
    phone: string;
    planName: string;
    startDate: string | null;
    endDate: string | null;
    statusInfo: {
      status: string;
      label: string;
      badgeClass: string;
      daysRemaining: number;
    };
  }>;
  expiringMemberships: Array<{
    id: string;
    clientId: string;
    clientName: string;
    phone: string;
    memberId: string;
    planName: string;
    planId: string;
    expiryDate: string;
    expiryFormatted: string;
    daysRemaining: number;
    reminderMessage: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) {
        throw new Error("Failed to load dashboard data");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="admin-content">
        <div style={{ color: "var(--text-secondary)", padding: "40px 0" }}>
          Loading gym metrics and membership records...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="admin-content">
        <div className="card" style={{ border: "1px solid var(--accent-red)", padding: "24px" }}>
          <p style={{ color: "var(--accent-red)" }}>{error || "An error occurred"}</p>
          <button onClick={loadDashboard} className="btn btn-secondary btn-sm" style={{ marginTop: "12px" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, recentMembers, expiringMemberships } = data;

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>OPERATIONAL DASHBOARD</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Real-time membership activity, revenue overview, and expiration alerts
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/admin/clients" className="btn btn-primary btn-sm">
            <UserPlus size={16} /> ADD NEW CLIENT
          </Link>
          <button onClick={loadDashboard} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* STATS CARDS GRID */}
        <div className="stats-grid">
          {/* Total Members */}
          <div className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="stat-card-title">TOTAL MEMBERS</span>
              <Users size={18} style={{ color: "var(--text-secondary)" }} />
            </div>
            <div className="stat-card-value">{stats.totalMembers}</div>
            <div className="stat-card-sub">Registered in system</div>
          </div>

          {/* Active Members */}
          <div className="stat-card" style={{ borderColor: "rgba(46, 204, 113, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="stat-card-title" style={{ color: "#2ecc71" }}>ACTIVE MEMBERS</span>
              <UserCheck size={18} style={{ color: "#2ecc71" }} />
            </div>
            <div className="stat-card-value" style={{ color: "#2ecc71" }}>{stats.activeMembers}</div>
            <div className="stat-card-sub">Valid training access</div>
          </div>

          {/* Expiring Soon */}
          <div className="stat-card" style={{ borderColor: "rgba(243, 156, 18, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="stat-card-title" style={{ color: "#f39c12" }}>EXPIRING SOON</span>
              <AlertTriangle size={18} style={{ color: "#f39c12" }} />
            </div>
            <div className="stat-card-value" style={{ color: "#f39c12" }}>{stats.expiringSoonMembers}</div>
            <div className="stat-card-sub">Next 7 days</div>
          </div>

          {/* Expired Members */}
          <div className="stat-card" style={{ borderColor: "rgba(231, 76, 60, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="stat-card-title" style={{ color: "var(--accent-red)" }}>EXPIRED</span>
              <UserX size={18} style={{ color: "var(--accent-red)" }} />
            </div>
            <div className="stat-card-value" style={{ color: "var(--accent-red)" }}>{stats.expiredMembers}</div>
            <div className="stat-card-sub">Due for renewal</div>
          </div>

          {/* Today's New Members */}
          <div className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="stat-card-title">TODAY&apos;S ENROLLMENT</span>
              <TrendingUp size={18} style={{ color: "var(--text-secondary)" }} />
            </div>
            <div className="stat-card-value">{stats.todayNewMembers}</div>
            <div className="stat-card-sub">Joined today</div>
          </div>

          {/* Monthly Revenue */}
          <div className="stat-card" style={{ background: "linear-gradient(180deg, #1e1e1e 0%, #151515 100%)", border: "1px solid #333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="stat-card-title">MONTHLY REVENUE</span>
              <DollarSign size={18} style={{ color: "var(--accent-red)" }} />
            </div>
            <div className="stat-card-value" style={{ color: "#fff" }}>
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <div className="stat-card-sub">
              Today: {formatCurrency(stats.todayRevenue)}
            </div>
          </div>
        </div>

        {/* SECTION: EXPIRING MEMBERSHIPS (NEXT 7 DAYS) */}
        <div className="card" style={{ marginBottom: "32px", border: expiringMemberships.length > 0 ? "1px solid rgba(243, 156, 18, 0.4)" : "1px solid var(--border)" }}>
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: "1.4rem", color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertTriangle size={20} style={{ color: "#f39c12" }} />
                MEMBERSHIPS EXPIRING WITHIN 7 DAYS ({expiringMemberships.length})
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
                Send one-click WhatsApp reminders and process renewals before lifters lapse
              </p>
            </div>

            <Link href="/admin/memberships?status=EXPIRING_SOON" className="btn btn-secondary btn-sm">
              View All Expiring
            </Link>
          </div>

          {expiringMemberships.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-secondary)" }}>
              ✓ No memberships are expiring in the next 7 days.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Client Name</th>
                    <th>Phone</th>
                    <th>Plan</th>
                    <th>Expiry Date</th>
                    <th>Remaining</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringMemberships.map((item) => {
                    const waUrl = generateWhatsAppUrl(item.phone, item.reminderMessage);

                    return (
                      <tr key={item.id}>
                        <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent-red)" }}>
                          {item.memberId}
                        </td>
                        <td>
                          <Link href={`/admin/clients/${item.clientId}`} style={{ fontWeight: 600, color: "#fff" }}>
                            {item.clientName}
                          </Link>
                        </td>
                        <td style={{ color: "var(--text-secondary)" }}>{item.phone}</td>
                        <td>{item.planName}</td>
                        <td style={{ color: "#f39c12", fontWeight: 600 }}>{item.expiryFormatted}</td>
                        <td>
                          <span className="badge badge-warning">
                            {item.daysRemaining === 0 ? "Expires Today" : `${item.daysRemaining} days left`}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-whatsapp btn-sm"
                              title="Send WhatsApp Reminder"
                            >
                              <MessageSquare size={14} /> Remind
                            </a>
                            <Link
                              href={`/admin/clients/${item.clientId}`}
                              className="btn btn-secondary btn-sm"
                            >
                              Renew
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION: RECENT MEMBERS */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: "1.4rem", color: "#fff" }}>RECENT MEMBERS ENROLLED</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
                Latest lifters registered with assigned memberships
              </p>
            </div>

            <Link href="/admin/clients" className="btn btn-secondary btn-sm">
              All Clients ({stats.totalMembers}) →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Client</th>
                  <th>Phone</th>
                  <th>Membership Plan</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Profile</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.map((member) => (
                  <tr key={member.id}>
                    <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent-red)" }}>
                      {member.memberId}
                    </td>
                    <td>
                      <Link href={`/admin/clients/${member.id}`} style={{ fontWeight: 600, color: "#fff" }}>
                        {member.fullName}
                      </Link>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{member.phone}</td>
                    <td>{member.planName}</td>
                    <td>{formatDate(member.startDate)}</td>
                    <td>{formatDate(member.endDate)}</td>
                    <td>
                      <span className={`badge ${member.statusInfo.badgeClass}`}>
                        {member.statusInfo.label}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link href={`/admin/clients/${member.id}`} className="btn btn-secondary btn-sm">
                        View <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
