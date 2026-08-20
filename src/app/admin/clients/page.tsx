"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  UserPlus,
  MessageSquare,
  ArrowRight,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatDate, generateWhatsAppUrl, getWhatsAppReminderMessage } from "@/lib/utils";

interface ClientListItem {
  id: string;
  memberId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  gender?: string | null;
  status: string;
  computedStatus: string;
  statusInfo?: {
    label: string;
    badgeClass: string;
    daysRemaining: number;
  } | null;
  latestMembership?: {
    id: string;
    plan: {
      name: string;
    };
    startDate: string;
    endDate: string;
  } | null;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  durationDays: number;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Add Client Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    planId: "",
    startDate: new Date().toISOString().split("T")[0],
    paymentMethod: "UPI",
    discount: 0,
    paymentNotes: "",
  });

  const loadClients = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/clients", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [statusFilter]);

  // Load plans for the modal
  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/plans");
        if (res.ok) {
          const data = await res.json();
          const activePlans = data.filter((p: { isActive: boolean }) => p.isActive);
          setPlans(activePlans);
          if (activePlans.length > 0) {
            setFormData((prev) => ({ ...prev, planId: activePlans[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load plans:", err);
      }
    }
    fetchPlans();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadClients();
  };

  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSubmitting(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.error || "Failed to create client");
        setModalSubmitting(false);
        return;
      }

      setShowAddModal(false);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        dateOfBirth: "",
        gender: "Male",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        planId: plans[0]?.id || "",
        startDate: new Date().toISOString().split("T")[0],
        paymentMethod: "UPI",
        discount: 0,
        paymentNotes: "",
      });
      loadClients();
    } catch (err) {
      console.error(err);
      setModalError("An unexpected error occurred");
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>CLIENT DIRECTORY</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Search, filter, and manage registered gym members
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
        >
          <UserPlus size={16} /> ADD NEW CLIENT
        </button>
      </header>

      <div className="admin-content">
        {/* FILTERS & SEARCH BAR */}
        <div
          className="card"
          style={{
            marginBottom: "24px",
            padding: "16px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px", flex: 1, minWidth: "280px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="Search by Name, Phone, or Member ID..."
                className="form-input"
                style={{ paddingLeft: "36px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                size={16}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#777" }}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">
              Search
            </button>
          </form>

          {/* Status Filter Buttons */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["ALL", "ACTIVE", "EXPIRING_SOON", "EXPIRED", "SUSPENDED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.82rem", padding: "6px 12px" }}
              >
                {status === "ALL" ? "All Clients" : status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* CLIENTS TABLE */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>
              MEMBERS LIST ({clients.length})
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading member profiles...
            </div>
          ) : clients.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              No clients found matching your search criteria.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Full Name</th>
                    <th>Phone</th>
                    <th>Current Plan</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => {
                    const badgeClass = client.statusInfo?.badgeClass || "badge-expired";
                    const statusLabel = client.statusInfo?.label || (client.status === "SUSPENDED" ? "Suspended" : "No Plan");
                    const planName = client.latestMembership?.plan?.name || "None";
                    const expiryDate = client.latestMembership?.endDate ? formatDate(client.latestMembership.endDate) : "N/A";

                    const reminderMsg = getWhatsAppReminderMessage(
                      client.fullName,
                      planName,
                      expiryDate
                    );
                    const waUrl = generateWhatsAppUrl(client.phone, reminderMsg);

                    return (
                      <tr key={client.id}>
                        <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent-red)" }}>
                          {client.memberId}
                        </td>
                        <td>
                          <Link href={`/admin/clients/${client.id}`} style={{ fontWeight: 600, color: "#fff" }}>
                            {client.fullName}
                          </Link>
                          {client.email && (
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                              {client.email}
                            </div>
                          )}
                        </td>
                        <td style={{ color: "var(--text-secondary)" }}>{client.phone}</td>
                        <td>{planName}</td>
                        <td>{expiryDate}</td>
                        <td>
                          <span className={`badge ${badgeClass}`}>{statusLabel}</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-whatsapp btn-sm"
                              title="Chat / Remind on WhatsApp"
                            >
                              <MessageSquare size={14} />
                            </a>
                            <Link href={`/admin/clients/${client.id}`} className="btn btn-secondary btn-sm">
                              Profile <ArrowRight size={14} />
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

      {/* ADD CLIENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "680px" }}>
            <div className="modal-header">
              <h2 style={{ fontSize: "1.4rem", color: "#fff" }}>ENROLL NEW GYM MEMBER</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}
              >
                <X size={22} />
              </button>
            </div>

            {modalError && (
              <div
                style={{
                  background: "var(--status-danger-bg)",
                  border: "1px solid var(--status-danger-border)",
                  color: "var(--status-danger-text)",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                  fontSize: "0.88rem",
                }}
              >
                <AlertCircle size={16} />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddClientSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. rahul@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Street, City, Pincode"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Emergency Contact Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contact person"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Phone number"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  />
                </div>
              </div>

              {/* Initial Membership Assignment */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "16px" }}>
                <h4 style={{ color: "#fff", marginBottom: "12px", fontSize: "1rem" }}>
                  INITIAL MEMBERSHIP & PAYMENT
                </h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Membership Plan</label>
                    <select
                      className="form-select"
                      value={formData.planId}
                      onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    >
                      <option value="">-- No Plan (Create Client Only) --</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.durationDays}d - ₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                </div>

                {formData.planId && (
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
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="btn btn-primary btn-sm"
                >
                  {modalSubmitting ? "Creating..." : "Save & Register Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
