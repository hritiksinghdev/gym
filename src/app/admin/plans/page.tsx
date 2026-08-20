"use client";

import { useState, useEffect } from "react";
import { Layers, Plus, Edit2, Trash2, CheckCircle2, X, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PlanItem {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  description?: string | null;
  benefits?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    durationDays: 30,
    price: 1500,
    description: "",
    benefitsText: "",
    isActive: true,
    sortOrder: 0,
  });

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      durationDays: 30,
      price: 1500,
      description: "",
      benefitsText: "Full gym & weights floor access\nLocker & shower facilities",
      isActive: true,
      sortOrder: plans.length + 1,
    });
    setModalError("");
    setShowModal(true);
  };

  const openEditModal = (plan: PlanItem) => {
    setEditingPlan(plan);
    let benefitsFormatted = "";
    if (plan.benefits) {
      try {
        const parsed = JSON.parse(plan.benefits);
        benefitsFormatted = Array.isArray(parsed) ? parsed.join("\n") : plan.benefits;
      } catch {
        benefitsFormatted = plan.benefits;
      }
    }

    setFormData({
      name: plan.name,
      durationDays: plan.durationDays,
      price: plan.price,
      description: plan.description || "",
      benefitsText: benefitsFormatted,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
    });
    setModalError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSubmitting(true);

    const benefitsArray = formData.benefitsText
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      durationDays: parseInt(String(formData.durationDays), 10),
      price: parseFloat(String(formData.price)),
      description: formData.description,
      benefits: JSON.stringify(benefitsArray),
      isActive: formData.isActive,
      sortOrder: parseInt(String(formData.sortOrder), 10),
    };

    try {
      const url = editingPlan ? `/api/plans/${editingPlan.id}` : "/api/plans";
      const method = editingPlan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save plan");
      }

      setShowModal(false);
      loadPlans();
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

  const handleDeletePlan = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete or deactivate the plan "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadPlans();
      } else {
        alert("Failed to delete plan.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting plan.");
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>MEMBERSHIP PACKAGES & PRICING</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Configure durations, pricing, and perks available to new lifters
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> CREATE NEW PLAN
        </button>
      </header>

      <div className="admin-content">
        <div className="grid-3" style={{ gap: "24px" }}>
          {plans.map((plan) => {
            let benefitsList: string[] = [];
            if (plan.benefits) {
              try {
                benefitsList = JSON.parse(plan.benefits);
              } catch {
                benefitsList = plan.benefits.split("\n");
              }
            }

            return (
              <div
                key={plan.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: plan.isActive ? 1 : 0.6,
                  border: plan.isActive ? "1px solid var(--border)" : "1px dashed #444",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <h3 style={{ fontSize: "1.6rem", color: "#fff" }}>{plan.name}</h3>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        {plan.durationDays} Days Duration
                      </span>
                    </div>

                    <span className={`badge ${plan.isActive ? 'badge-active' : 'badge-suspended'}`}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div style={{ margin: "16px 0" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: 900, color: "var(--accent-red)" }}>
                      {formatCurrency(plan.price)}
                    </span>
                  </div>

                  {plan.description && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.5", marginBottom: "20px" }}>
                      {plan.description}
                    </p>
                  )}

                  <div style={{ borderTop: "1px solid #282828", paddingTop: "16px", marginBottom: "24px" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#777", textTransform: "uppercase", marginBottom: "10px" }}>
                      INCLUDED BENEFITS ({benefitsList.length}):
                    </div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {benefitsList.map((b, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                          <CheckCircle2 size={15} style={{ color: "var(--accent-red)", flexShrink: 0, marginTop: "2px" }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #222", paddingTop: "16px" }}>
                  <button
                    onClick={() => openEditModal(plan)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Edit2 size={14} /> Edit Plan
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id, plan.name)}
                    className="btn btn-danger btn-sm"
                    title="Delete / Deactivate Plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE / EDIT PLAN MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>
                {editingPlan ? `EDIT PLAN: ${editingPlan.name}` : "CREATE MEMBERSHIP PLAN"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quarterly Pro"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration in Days *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="30, 90, 180, 365"
                    className="form-input"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value, 10) || 1 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 4000"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Plan Description</label>
                <input
                  type="text"
                  placeholder="Short tagline or summary"
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Included Benefits (One per line)</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  placeholder="Full gym & weights floor access&#10;Locker & shower facilities&#10;1 Free 1-on-1 PT session"
                  value={formData.benefitsText}
                  onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="isActiveCheck" style={{ color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>
                  Active (Visible on public website and enrollment dropdowns)
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={modalSubmitting} className="btn btn-primary btn-sm">
                  {modalSubmitting ? "Saving..." : "Save Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
