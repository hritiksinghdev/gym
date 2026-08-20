"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
  PieChart,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ReportsData {
  summary: {
    totalMembers: number;
    activeMembers: number;
    newMembersThisMonth: number;
    expiredMembers: number;
    totalRenewals: number;
    revenueThisMonth: number;
    revenueThisYear: number;
  };
  planDistribution: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  paymentMethods: Array<{
    method: string;
    totalAmount: number;
    transactionCount: number;
  }>;
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reports");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="admin-content">
        <div style={{ padding: "40px", color: "var(--text-secondary)" }}>
          Calculating gym business analytics...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-content">
        <div className="card" style={{ padding: "32px", textAlign: "center" }}>
          Failed to load reports data.
        </div>
      </div>
    );
  }

  const { summary, planDistribution, paymentMethods } = data;

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>BUSINESS & MEMBERSHIP REPORTS</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Operational performance, renewals, and revenue trends
          </p>
        </div>

        <button onClick={loadReports} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </header>

      <div className="admin-content">
        {/* SUMMARY CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="stat-card-title">TOTAL REGISTERED</span>
              <Users size={18} style={{ color: "var(--text-secondary)" }} />
            </div>
            <div className="stat-card-value">{summary.totalMembers}</div>
            <div className="stat-card-sub">Active: {summary.activeMembers}</div>
          </div>

          <div className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="stat-card-title">NEW THIS MONTH</span>
              <TrendingUp size={18} style={{ color: "#2ecc71" }} />
            </div>
            <div className="stat-card-value" style={{ color: "#2ecc71" }}>
              {summary.newMembersThisMonth}
            </div>
            <div className="stat-card-sub">Current calendar month</div>
          </div>

          <div className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="stat-card-title">MEMBERSHIP RENEWALS</span>
              <RefreshCw size={18} style={{ color: "#f39c12" }} />
            </div>
            <div className="stat-card-value" style={{ color: "#f39c12" }}>
              {summary.totalRenewals}
            </div>
            <div className="stat-card-sub">Repeated subscriptions</div>
          </div>

          <div className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="stat-card-title">REVENUE (MONTH)</span>
              <DollarSign size={18} style={{ color: "#fff" }} />
            </div>
            <div className="stat-card-value" style={{ color: "#fff" }}>
              {formatCurrency(summary.revenueThisMonth)}
            </div>
            <div className="stat-card-sub">This month</div>
          </div>

          <div className="stat-card" style={{ border: "1px solid var(--accent-red)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="stat-card-title" style={{ color: "var(--accent-red)" }}>YEAR-TO-DATE REVENUE</span>
              <DollarSign size={18} style={{ color: "var(--accent-red)" }} />
            </div>
            <div className="stat-card-value" style={{ color: "var(--accent-red)" }}>
              {formatCurrency(summary.revenueThisYear)}
            </div>
            <div className="stat-card-sub">{new Date().getFullYear()} fiscal year</div>
          </div>
        </div>

        {/* BREAKDOWN SECTIONS */}
        <div className="grid-2" style={{ gap: "24px" }}>
          {/* Active Plan Distribution */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: "1.2rem", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <PieChart size={18} style={{ color: "var(--accent-red)" }} /> ACTIVE PLAN POPULARITY
              </h3>
            </div>

            {planDistribution.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--text-secondary)" }}>
                No active plan subscriptions found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      <th>Active Members</th>
                      <th style={{ textAlign: "right" }}>Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planDistribution.map((p, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: "#fff" }}>{p.name}</td>
                        <td>
                          <span className="badge badge-active">{p.count} lifters</span>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#2ecc71" }}>
                          {formatCurrency(p.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Methods Distribution */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: "1.2rem", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={18} style={{ color: "var(--accent-red)" }} /> PAYMENT METHOD BREAKDOWN
              </h3>
            </div>

            {paymentMethods.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--text-secondary)" }}>
                No completed payment transactions recorded.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Txn Count</th>
                      <th style={{ textAlign: "right" }}>Total Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethods.map((pm, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: "#fff" }}>{pm.method}</td>
                        <td>{pm.transactionCount} payments</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#2ecc71" }}>
                          {formatCurrency(pm.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
