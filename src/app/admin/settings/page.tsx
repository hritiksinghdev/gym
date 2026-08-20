"use client";

import { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    gymName: "TITAN FORGE GYM",
    tagline: "BUILD YOUR STRONGEST SELF",
    logoUrl: "",
    heroHeadline: "BUILD YOUR STRONGEST SELF.",
    heroDescription:
      "Raw iron, expert trainers, and an unforgiving atmosphere built to sculpt greatness. No excuses, only results.",
    address: "Plot 42, Ironworks Industrial Estate, 2nd Cross, Near Metro Station, Bangalore",
    phone: "+91 98765 43210",
    whatsappNumber: "919876543210",
    email: "contact@titanforgegym.com",
    openingHours: "Mon - Sat: 5:00 AM - 11:00 PM | Sun: 6:00 AM - 8:00 PM",
    googleMapsUrl: "https://maps.google.com/?q=Titan+Forge+Gym",
    instagramUrl: "https://instagram.com/titanforgegym",
    facebookUrl: "https://facebook.com/titanforgegym",
    youtubeUrl: "https://youtube.com/titanforgegym",
    currencySymbol: "₹",
    memberIdPrefix: "GYM",
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save gym settings");
      }

      setSuccessMessage("Gym configuration saved successfully! Website updated.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <div style={{ padding: "40px", color: "var(--text-secondary)" }}>
          Loading gym settings...
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1 style={{ fontSize: "1.8rem", color: "#fff" }}>GYM CONFIGURATION & BRANDING</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Customize website headlines, contact information, hours, and numbering
          </p>
        </div>

        <button onClick={loadSettings} className="btn btn-secondary btn-sm">
          <RefreshCw size={16} /> Discard Changes
        </button>
      </header>

      <div className="admin-content" style={{ maxWidth: "900px" }}>
        {successMessage && (
          <div
            style={{
              background: "var(--status-active-bg)",
              border: "1px solid var(--status-active-border)",
              color: "var(--status-active-text)",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
              fontSize: "0.9rem",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              background: "var(--status-danger-bg)",
              border: "1px solid var(--status-danger-border)",
              color: "var(--status-danger-text)",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
              fontSize: "0.9rem",
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: "32px" }}>
          {/* Brand & Identity */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "16px" }}>
              1. BRAND IDENTITY & IDENTIFIERS
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gym Business Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.gymName}
                  onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Member ID Prefix</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.memberIdPrefix}
                  onChange={(e) => setFormData({ ...formData, memberIdPrefix: e.target.value })}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  e.g. GYM generates &quot;GYM-2026-0001&quot;
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Website Hero Section */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "16px" }}>
              2. HOMEPAGE HERO SECTION
            </h3>

            <div className="form-group">
              <label className="form-label">Hero Headline Text</label>
              <input
                type="text"
                className="form-input"
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero Subtitle / Description</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
              />
            </div>
          </div>

          {/* Contact Details & WhatsApp */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "16px" }}>
              3. CONTACT & WHATSAPP INTEGRATION
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Desk WhatsApp Number (Digits only) *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Used for click-to-chat links (e.g. 919876543210)
                </span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Google Maps URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Gym Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Floor & Operating Hours</label>
              <input
                type="text"
                className="form-input"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "16px" }}>
              4. SOCIAL CHANNELS
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Instagram Profile URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.instagramUrl || ""}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Facebook Page URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.facebookUrl || ""}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">YouTube Channel URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.youtubeUrl || ""}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
          >
            <Save size={20} /> {saving ? "SAVING SETTINGS..." : "SAVE & UPDATE CONFIGURATION"}
          </button>
        </form>
      </div>
    </>
  );
}
