"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Heart,
  CreditCard,
  DollarSign,
  MessageSquare,
  RefreshCw,
  Edit2,
  Trash2,
  ArrowLeft,
  X,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateInput, generateWhatsAppUrl, getWhatsAppReminderMessage } from "@/lib/utils";

interface MembershipItem {
  id: string;
  startDate: string;
  endDate: string;
  amount: number;
  discount: number;
  finalAmount: number;
  paymentStatus: string;
  status: string;
  notes?: string;
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
  };
}

interface PaymentItem {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string;
  status: string;
  notes?: string;
  membership?: {
    plan?: {
      name: string;
    };
  };
}

interface ClientDetail {
  id: string;
  memberId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  photoUrl?: string | null;
  status: string;
  notes?: string | null;
  computedStatus: string;
  statusInfo?: {
    label: string;
    badgeClass: string;
    daysRemaining: number;
  } | null;
  latestMembership?: MembershipItem | null;
  memberships: MembershipItem[];
  payments: PaymentItem[];
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  durationDays: number;
}

export default function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState<PlanOption[]>([]);

  // Modals
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form states
  const [renewForm, setRenewForm] = useState({
    planId: "",
    discount: 0,
    paymentMethod: "UPI",
    notes: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: "UPI",
    transactionId: "",
    notes: "",
  });

  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    status: "ACTIVE",
    notes: "",
  });

  const loadClient = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clients/${id}`);
      if (!res.ok) throw new Error("Client not found");
      const data = await res.json();
      setClient(data);

      setEditForm({
        fullName: data.fullName || "",
        phone: data.phone || "",
        email: data.email || "",
        dateOfBirth: formatDateInput(data.dateOfBirth),
        gender: data.gender || "Male",
        address: data.address || "",
        emergencyContactName: data.emergencyContactName || "",
        emergencyContactPhone: data.emergencyContactPhone || "",
        status: data.status || "ACTIVE",
        notes: data.notes || "",
      });

      if (data.latestMembership?.plan?.id) {
        setRenewForm((prev) => ({
          ...prev,
          planId: data.latestMembership.plan.id,
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load client details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClient();
  }, [id]);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/plans");
        if (res.ok) {
          const data = await res.json();
          const activePlans = data.filter((p: { isActive: boolean }) => p.isActive);
          setPlans(activePlans);
          if (activePlans.length > 0 && !renewForm.planId) {
            setRenewForm((prev) => ({ ...prev, planId: activePlans[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPlans();
  }, []);

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.latestMembership?.id) return;
    setModalError("");
    setModalSubmitting(true);

    try {
      const res = await fetch(`/api/memberships/${client.latestMembership.id}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(renewForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to renew membership");
      }

      setShowRenewModal(false);
      loadClient();
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

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setModalError("");
    setModalSubmitting(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client.id,
          membershipId: client.latestMembership?.id || null,
          amount: paymentForm.amount,
          paymentMethod: paymentForm.paymentMethod,
          transactionId: paymentForm.transactionId,
          notes: paymentForm.notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to record payment");
      }

      setShowPaymentModal(false);
      setPaymentForm({ amount: 0, paymentMethod: "UPI", transactionId: "", notes: "" });
      loadClient();
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSubmitting(true);

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update client");
      }

      setShowEditModal(false);
      loadClient();
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

  const handleDeleteClient = async () => {
    if (!confirm(`Are you sure you want to permanently delete member ${client?.fullName} (${client?.memberId})? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/clients");
      } else {
        alert("Failed to delete client.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting client.");
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <div style={{ color: "var(--text-secondary)", padding: "40px" }}>
          Loading member profile...
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="admin-content">
        <div className="card" style={{ padding: "32px", textAlign: "center" }}>
          <p style={{ color: "var(--accent-red)", marginBottom: "16px" }}>{error || "Member not found"}</p>
          <Link href="/admin/clients" className="btn btn-secondary btn-sm">
            ← Back to Clients List
          </Link>
        </div>
      </div>
    );
  }

  const latest = client.latestMembership;
  const statusBadgeClass = client.statusInfo?.badgeClass || "badge-expired";
  const statusLabel = client.statusInfo?.label || (client.status === "SUSPENDED" ? "Suspended" : "No Membership");

  const expiryFormatted = latest ? formatDate(latest.endDate) : "N/A";
  const reminderMsg = getWhatsAppReminderMessage(
    client.fullName,
    latest?.plan?.name || "Gym",
    expiryFormatted
  );
  const waUrl = generateWhatsAppUrl(client.phone, reminderMsg);

  return (
    <>
      <header className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/clients" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> BACK
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>{client.fullName}</h1>
              <span className={`badge ${statusBadgeClass}`}>{statusLabel}</span>
            </div>
            <div style={{ color: "var(--accent-red)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>
              MEMBER ID: {client.memberId}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-sm"
          >
            <MessageSquare size={16} /> WHATSAPP CLIENT
          </a>

          {latest && (
            <button onClick={() => setShowRenewModal(true)} className="btn btn-primary btn-sm">
              <RefreshCw size={16} /> RENEW MEMBERSHIP
            </button>
          )}

          <button onClick={() => setShowEditModal(true)} className="btn btn-secondary btn-sm">
            <Edit2 size={16} /> Edit Profile
          </button>

          <button onClick={handleDeleteClient} className="btn btn-danger btn-sm" title="Delete Member">
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="grid-2" style={{ marginBottom: "32px", gap: "24px" }}>
          {/* PERSONAL INFO CARD */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: "1.2rem", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={18} style={{ color: "var(--accent-red)" }} /> PERSONAL INFORMATION
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Phone Number</span>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem" }}>{client.phone}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Email</span>
                <span style={{ color: "#fff", fontSize: "0.95rem" }}>{client.email || "Not provided"}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Gender</span>
                <span style={{ color: "#fff", fontSize: "0.95rem" }}>{client.gender || "Not specified"}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Date of Birth</span>
                <span style={{ color: "#fff", fontSize: "0.95rem" }}>{formatDate(client.dateOfBirth)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Residential Address</span>
                <span style={{ color: "#fff", fontSize: "0.9rem", textAlign: "right", maxWidth: "60%" }}>{client.address || "Not provided"}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Emergency Contact</span>
                <span style={{ color: "#fff", fontSize: "0.95rem" }}>
                  {client.emergencyContactName ? `${client.emergencyContactName} (${client.emergencyContactPhone || 'No Phone'})` : "None"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Member Since</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{formatDate(client.memberships[client.memberships.length - 1]?.startDate || new Date())}</span>
              </div>
            </div>
          </div>

          {/* CURRENT MEMBERSHIP CARD */}
          <div className="card" style={{ border: latest?.statusInfo.isActive ? "1px solid rgba(46, 204, 113, 0.4)" : "1px solid var(--border)" }}>
            <div className="card-header">
              <h3 style={{ fontSize: "1.2rem", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={18} style={{ color: "var(--accent-red)" }} /> CURRENT MEMBERSHIP STATUS
              </h3>
            </div>

            {latest ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
                  <div>
                    <h2 style={{ fontSize: "2rem", color: "#fff" }}>{latest.plan.name} PLAN</h2>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                      Duration: {latest.plan.durationDays} Days
                    </span>
                  </div>
                  <span className={`badge ${latest.statusInfo.badgeClass}`} style={{ fontSize: "0.9rem", padding: "6px 12px" }}>
                    {latest.statusInfo.label}
                  </span>
                </div>

                <div
                  style={{
                    background: "#111",
                    border: "1px solid #282828",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px",
                    marginBottom: "20px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase" }}>
                      START DATE
                    </div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem", marginTop: "2px" }}>
                      {formatDate(latest.startDate)}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase" }}>
                      EXPIRY DATE
                    </div>
                    <div style={{ color: latest.statusInfo.daysRemaining <= 7 ? "var(--accent-red)" : "#fff", fontWeight: 700, fontSize: "1.1rem", marginTop: "2px" }}>
                      {formatDate(latest.endDate)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setShowRenewModal(true)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <RefreshCw size={16} /> Renew or Extend Plan
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus size={16} /> Record Payment
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
                  This client does not currently have an active membership.
                </p>
                <button
                  onClick={() => setShowRenewModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} /> Assign Membership Plan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MEMBERSHIP HISTORY TABLE */}
        <div className="card" style={{ marginBottom: "32px" }}>
          <div className="card-header">
            <h3 style={{ fontSize: "1.2rem", color: "#fff" }}>
              MEMBERSHIP HISTORY ({client.memberships.length})
            </h3>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Amount</th>
                  <th>Discount</th>
                  <th>Final</th>
                  <th>Payment Status</th>
                  <th>Derived Status</th>
                </tr>
              </thead>
              <tbody>
                {client.memberships.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, color: "#fff" }}>{m.plan.name}</td>
                    <td>{formatDate(m.startDate)}</td>
                    <td>{formatDate(m.endDate)}</td>
                    <td>{formatCurrency(m.amount)}</td>
                    <td>{formatCurrency(m.discount)}</td>
                    <td style={{ fontWeight: 700, color: "#fff" }}>{formatCurrency(m.finalAmount)}</td>
                    <td>
                      <span className={`badge ${m.paymentStatus === 'PAID' ? 'badge-active' : 'badge-warning'}`}>
                        {m.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${m.statusInfo.badgeClass}`}>
                        {m.statusInfo.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAYMENT HISTORY TABLE */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <h3 style={{ fontSize: "1.2rem", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <DollarSign size={18} style={{ color: "var(--accent-red)" }} /> PAYMENT TRANSACTIONS ({client.payments.length})
              </h3>
              <button onClick={() => setShowPaymentModal(true)} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add Payment
              </button>
            </div>
          </div>

          {client.payments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>
              No payments recorded yet for this client.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Transaction ID</th>
                    <th>Plan / Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {client.payments.map((p) => (
                    <tr key={p.id}>
                      <td>{formatDate(p.paymentDate)}</td>
                      <td style={{ fontWeight: 700, color: "#2ecc71", fontSize: "1.05rem" }}>
                        {formatCurrency(p.amount)}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "#fff" }}>{p.paymentMethod}</span>
                      </td>
                      <td style={{ fontFamily: "monospace", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        {p.transactionId || "N/A"}
                      </td>
                      <td>{p.membership?.plan?.name || p.notes || "General Payment"}</td>
                      <td>
                        <span className={`badge ${p.status === 'COMPLETED' ? 'badge-active' : 'badge-warning'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* RENEW MEMBERSHIP MODAL */}
      {showRenewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>RENEW / EXTEND MEMBERSHIP</h2>
              <button
                onClick={() => setShowRenewModal(false)}
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

            <form onSubmit={handleRenewSubmit}>
              <div className="form-group">
                <label className="form-label">Select Plan *</label>
                <select
                  required
                  className="form-select"
                  value={renewForm.planId}
                  onChange={(e) => setRenewForm({ ...renewForm, planId: e.target.value })}
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
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={renewForm.paymentMethod}
                    onChange={(e) => setRenewForm({ ...renewForm, paymentMethod: e.target.value })}
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={renewForm.discount}
                    onChange={(e) => setRenewForm({ ...renewForm, discount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Renewed at front desk"
                  value={renewForm.notes}
                  onChange={(e) => setRenewForm({ ...renewForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={() => setShowRenewModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={modalSubmitting} className="btn btn-primary btn-sm">
                  {modalSubmitting ? "Processing..." : "Confirm & Renew Membership"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>RECORD PAYMENT TRANSACTION</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
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

            <form onSubmit={handlePaymentSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    placeholder="e.g. 1500"
                    value={paymentForm.amount || ""}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method *</label>
                  <select
                    className="form-select"
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction / Reference ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. UPI Ref / Bank Txn"
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Partial balance payment"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={() => setShowPaymentModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={modalSubmitting} className="btn btn-primary btn-sm">
                  {modalSubmitting ? "Recording..." : "Save Payment Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLIENT MODAL */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "650px" }}>
            <div className="modal-header">
              <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>EDIT CLIENT PROFILE</h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Emergency Contact Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.emergencyContactName}
                    onChange={(e) => setEditForm({ ...editForm, emergencyContactName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={editForm.emergencyContactPhone}
                    onChange={(e) => setEditForm({ ...editForm, emergencyContactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={modalSubmitting} className="btn btn-primary btn-sm">
                  {modalSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
