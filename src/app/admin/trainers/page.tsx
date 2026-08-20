"use client";

import { useState, useEffect } from "react";
import { UserCheck, Plus, Edit2, Trash2, X, AlertCircle, Phone, Mail, Award } from "lucide-react";

interface TrainerItem {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  photoUrl?: string | null;
  bio?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<TrainerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<TrainerItem | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    photoUrl: "",
    bio: "",
    phone: "",
    email: "",
    isActive: true,
    sortOrder: 0,
  });

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trainers");
      if (res.ok) {
        const data = await res.json();
        setTrainers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const openCreateModal = () => {
    setEditingTrainer(null);
    setFormData({
      name: "",
      specialization: "",
      experience: "5+ Years",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      bio: "",
      phone: "",
      email: "",
      isActive: true,
      sortOrder: trainers.length + 1,
    });
    setModalError("");
    setShowModal(true);
  };

  const openEditModal = (t: TrainerItem) => {
    setEditingTrainer(t);
    setFormData({
      name: t.name,
      specialization: t.specialization,
      experience: t.experience,
      photoUrl: t.photoUrl || "",
      bio: t.bio || "",
      phone: t.phone || "",
      email: t.email || "",
      isActive: t.isActive,
      sortOrder: t.sortOrder,
    });
    setModalError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSubmitting(true);

    try {
      const url = editingTrainer ? `/api/trainers/${editingTrainer.id}` : "/api/trainers";
      const method = editingTrainer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save trainer");
      }

      setShowModal(false);
      loadTrainers();
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

  const handleDeleteTrainer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove trainer "${name}"?`)) return;

    try {
      const res = await fetch(`/api/trainers/${id}`, { method: "DELETE" });
      if (res.ok) loadTrainers();
      else alert("Failed to delete trainer.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>COACHING ROSTER</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Manage fitness trainers, specializations, certifications, and bios
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> ADD NEW TRAINER
        </button>
      </header>

      <div className="admin-content">
        <div className="grid-2" style={{ gap: "24px" }}>
          {trainers.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                opacity: t.isActive ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "140px",
                  borderRadius: "var(--radius-sm)",
                  background: `url(${t.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}) center/cover no-repeat`,
                  flexShrink: 0,
                  border: "1px solid var(--border)",
                }}
              />

              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ fontSize: "1.3rem", color: "#fff" }}>{t.name}</h3>
                    <span className={`badge ${t.isActive ? 'badge-active' : 'badge-suspended'}`}>
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div style={{ color: "var(--accent-red)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", marginTop: "2px" }}>
                    {t.specialization}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: "6px" }}>
                    <Award size={14} style={{ color: "var(--accent-orange)" }} />
                    <span>{t.experience}</span>
                  </div>

                  {t.bio && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "8px", lineHeight: "1.4" }}>
                      {t.bio}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "12px", borderTop: "1px solid #222", paddingTop: "10px" }}>
                  <button onClick={() => openEditModal(t)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDeleteTrainer(t.id, t.name)} className="btn btn-danger btn-sm">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE / EDIT TRAINER MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h2 style={{ fontSize: "1.3rem", color: "#fff" }}>
                {editingTrainer ? `EDIT TRAINER: ${editingTrainer.name}` : "ADD NEW COACH"}
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
                  <label className="form-label">Trainer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Rao"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8+ Years"
                    className="form-input"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specialization / Discipline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Powerlifting & Hypertrophy"
                  className="form-input"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biography & Credentials</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Short description of coaching style and achievements"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98800 11223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="trainer@gym.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="isTrainerActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="isTrainerActive" style={{ color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>
                  Active (Displayed on public trainers page)
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={modalSubmitting} className="btn btn-primary btn-sm">
                  {modalSubmitting ? "Saving..." : "Save Coach"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
