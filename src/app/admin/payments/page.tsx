"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  X,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PaymentRecord {
  id: string;
  clientId: string;
  membershipId?: string | null;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string | null;
  status: string;
  notes?: string | null;
  client: {
    id: string;
    memberId: string;
    fullName: string;
    phone: string;
  };
  membership?: {
    id: string;
    plan: {
      name: string;
    };
  } | null;
}

interface ClientOption {
  id: string;
  memberId: string;
  fullName: string;
  phone: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState("ALL");

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    amount: 1500,
    paymentMethod: "UPI",
    transactionId: "",
    status: "COMPLETED",
    notes: "",
  });

  const loadPayments = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/payments", window.location.origin);
      if (methodFilter !== "ALL") url.searchParams.set("method", methodFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [methodFilter]);

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch("/api/clients");
        if (res.ok) {
          const data = await res.json();
          setClients(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, clientId: data[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadClients();
  }, []);

  const totalCollected = payments.reduce(
    (sum, p) => (p.status === "COMPLETED" ? sum + p.amount : sum),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSubmitting(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to record payment");
      }

      setShowAddModal(false);
      loadPayments();
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
          <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>PAYMENT TRANSACTIONS</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Record cash, UPI, card, and bank receipts for memberships and renewals
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
          <Plus size={16} /> RECORD PAYMENT
        </button>
      </header>

      <div className="admin-content">
        {/* Top Summary Card */}
        <div
          className="card"
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            background: "linear-gradient(180deg, #181818 0%, #121212 100%)",
          }}
        >
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700 }}>
              FILTERED REVENUE COLLECTED
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "#2ecc71", marginTop: "4px" }}>
              {formatCurrency(totalCollected)}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
              {payments.length} total transactions found
            </div>
          </div>

          {/* Payment Method Filters */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["ALL", "UPI", "CASH", "CARD", "BANK_TRANSFER"].map((method) => (
              <button
                key={method}
                onClick={() => setMethodFilter(method)}
                className={`btn btn-sm ${methodFilter === method ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.82rem" }}
              >
                {method === "ALL" ? "All Methods" : method.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>TRANSACTION LOG ({payments.length})</h2>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading transactions...
            </div>
          ) : payments.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              No payments recorded matching this filter.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Member</th>
                    <th>Phone</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Txn / Ref ID</th>
                    <th>Allocated Plan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td>{formatDate(p.paymentDate)}</td>
                      <td>
                        <Link href={`/admin/clients/${p.client.id}`} style={{ fontWeight: 600, color: "#fff" }}>
                          {p.client.fullName}
                        </Link>
                        <div style={{ fontFamily: "var(--font-display)", color: "var(--accent-red)", fontSize: "0.82rem" }}>
                          {p.client.memberId}
                        </div>
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>{p.client.phone}</td>
                      <td style={{ fontWeight: 700, color: "#2ecc71", fontSize: "1.1rem" }}>
                        {formatCurrency(p.amount)}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "#fff" }}>{p.paymentMethod}</span>
                      </td>
                      <td style={{ fontFamily: "monospace", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {p.transactionId || "N/A"}
                      </td>
                      <td>{p.membership?.plan?.name || p.notes || "General"}</td>
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

      {/* RECORD PAYMENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>RECORD PAYMENT</h2>
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

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Client *</label>
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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method *</label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
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
                  placeholder="e.g. UPI Ref / Receipt No"
                  className="form-input"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Front desk receipt"
                  className="form-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={modalSubmitting} className="btn btn-primary btn-sm">
                  {modalSubmitting ? "Saving..." : "Save Payment Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
