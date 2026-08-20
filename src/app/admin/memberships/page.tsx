"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  RefreshCw,
  X,
  AlertCircle,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, formatDate, generateWhatsAppUrl, getWhatsAppReminderMessage } from "@/lib/utils";

interface MembershipItem {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  amount: number;
  discount: number;
  finalAmount: number;
  paymentStatus: string;
  status: string;
  notes?: string;
  client: {
    id: string;
    memberId: string;
    fullName: string;
    phone: string;
  };
  plan: {
    id: string;
    name: string;
    durationDays: number;
    price: number;
  };
  statusInfo: {
    label: string;
    badgeClass: string;
    daysRemaining: number;
    isActive: boolean;
    status: string;
  };
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  durationDays: number;
}

interface ClientOption {
  id: string;
  memberId: string;
  fullName: string;
  phone: string;
}

function MembershipsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "ALL";

  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  // New Membership Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    planId: "",
    startDate: new Date().toISOString().split("T")[0],
    discount: 0,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    notes: "",
  });

  const loadMemberships = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/memberships", window.location.origin);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setMemberships(data);
      }
    } catch (err) {
      console.error("Failed to load memberships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberships();
  }, [statusFilter]);

  // Load clients and plans for modal
  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [clientsRes, plansRes] = await Promise.all([
          fetch("/api/clients"),
          fetch("/api/plans"),
        ]);
        if (clientsRes.ok && plansRes.ok) {
          const clientsData = await clientsRes.json();
          const plansData = await plansRes.json();
          const activePlans = plansData.filter((p: { isActive: boolean }) => p.isActive);
          setClients(clientsData);
          setPlans(activePlans);

          if (clientsData.length > 0) setFormData((prev) => ({ ...prev, clientId: clientsData[0].id }));
          if (activePlans.length > 0) setFormData((prev) => ({ ...prev, planId: activePlans[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadDropdowns();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSubmitting(true);

    try {
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create membership");
      }

      setShowAddModal(false);
      loadMemberships();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setModalError(err.message);
      } else {
        setModalError("An unexpected error occurred");
      }
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>MEMBERSHIP SUBSCRIPTIONS</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Track active lifters, validity periods, renewals, and expiration dates
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
          <Plus size={16} /> ASSIGN MEMBERSHIP
        </button>
      </header>

      <div className="admin-content">
        {/* Status Filters */}
        <div
          className="card"
          style={{
            marginBottom: "24px",
            padding: "16px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: 600 }}>
            FILTER BY STATUS:
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["ALL", "ACTIVE", "EXPIRING_SOON", "EXPIRED", "UPCOMING", "SUSPENDED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.82rem", padding: "6px 12px" }}
              >
                {status === "ALL" ? "All Subscriptions" : status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Memberships Table */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>
              SUBSCRIPTIONS LIST ({memberships.length})
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading subscriptions...
            </div>
          ) : memberships.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              No memberships found for this filter.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Phone</th>
                    <th>Plan Name</th>
                    <th>Duration</th>
                    <th>Start Date</th>
                    <th>Expiry Date</th>
                    <th>Amount</th>
                    <th>Derived Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((m) => {
                    const reminderMsg = getWhatsAppReminderMessage(
                      m.client.fullName,
                      m.plan.name,
                      formatDate(m.endDate)
                    );
                    const waUrl = generateWhatsAppUrl(m.client.phone, reminderMsg);

                    return (
                      <tr key={m.id}>
                        <td>
                          <Link href={`/admin/clients/${m.client.id}`} style={{ fontWeight: 600, color: "#fff" }}>
                            {m.client.fullName}
                          </Link>
                          <div style={{ fontFamily: "var(--font-display)", color: "var(--accent-red)", fontSize: "0.85rem", fontWeight: 700 }}>
                            {m.client.memberId}
                          </div>
                        </td>
                        <td style={{ color: "var(--text-secondary)" }}>{m.client.phone}</td>
                        <td style={{ fontWeight: 600 }}>{m.plan.name}</td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{m.plan.durationDays}d</td>
                        <td>{formatDate(m.startDate)}</td>
                        <td style={{ fontWeight: 600 }}>{formatDate(m.endDate)}</td>
                        <td style={{ fontWeight: 700, color: "#fff" }}>{formatCurrency(m.finalAmount)}</td>
                        <td>
                          <span className={`badge ${m.statusInfo.badgeClass}`}>
                            {m.statusInfo.label}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-whatsapp btn-sm"
                              title="WhatsApp Reminder"
                            >
                              <MessageSquare size={14} />
                            </a>
                            <Link href={`/admin/clients/${m.client.id}`} className="btn btn-secondary btn-sm">
                              Manage <ArrowRight size={14} />
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
      </div>

      {/* CREATE MEMBERSHIP MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>ASSIGN NEW MEMBERSHIP</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div style={{ background: "var(--status-danger-bg)", color: "var(--status-danger-text)", padding: "10px", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "0.88rem" }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Select Client *</label>
                <select
                  required
                  className="form-select"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.memberId} - {c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Plan *</label>
                <select
                  required
                  className="form-select"
                  value={formData.planId}
                  onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.durationDays} Days) — {formatCurrency(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Status</label>
                  <select
                    className="form-select"
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  >
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Optional membership notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={modalSubmitting} className="btn btn-primary btn-sm">
                  {modalSubmitting ? "Creating..." : "Save Membership"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminMembershipsPage() {
  return (
    <Suspense fallback={<div className="admin-content">Loading subscriptions...</div>}>
      <MembershipsContent />
    </Suspense>
  );
}
