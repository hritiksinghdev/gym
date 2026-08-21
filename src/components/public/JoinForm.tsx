"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { formatCurrency, generateWhatsAppUrl } from "@/lib/utils";
import Link from "next/link";

interface PlanOption {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  description?: string;
}

export default function JoinForm() {
  const searchParams = useSearchParams();
  const preselectedPlanId = searchParams.get("plan") || "";

  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    planId: preselectedPlanId,
    startDate: new Date().toISOString().split("T")[0],
    photoUrl: "",
  });

  const [successData, setSuccessData] = useState<{
    memberId: string;
    clientName: string;
    planName: string;
    price: number;
    startDate: string;
    endDate: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/plans");
        if (res.ok) {
          const data = await res.json();
          const activePlans = data.filter((p: { isActive: boolean }) => p.isActive);
          setPlans(activePlans);
          if (!formData.planId && activePlans.length > 0) {
            setFormData((prev) => ({
              ...prev,
              planId: preselectedPlanId || activePlans[0].id,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoadingPlans(false);
      }
    }
    loadPlans();
  }, [preselectedPlanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      setSubmitting(false);
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      setSubmitting(false);
      return;
    }
    if (!formData.planId) {
      setErrorMessage("Please select a membership plan.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to complete registration.");
        setSubmitting(false);
        return;
      }

      setSuccessData(data);
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id === formData.planId);

  // Success State
  if (successData) {
    const whatsappMsg = `Hi Titan Forge Gym! I just registered online.\nName: ${successData.clientName}\nMember ID: ${successData.memberId}\nPlan: ${successData.planName}`;
    const deskWhatsappUrl = generateWhatsAppUrl("919876543210", whatsappMsg);

    return (
      <div className="container" style={{ padding: "100px var(--container-pad) 60px", maxWidth: "580px" }}>
        <div
          style={{
            textAlign: "center",
            padding: "36px 28px",
            border: "1px solid var(--accent-red)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              background: "rgba(46, 204, 113, 0.12)",
              border: "1px solid #2ecc71",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#2ecc71",
            }}
          >
            <CheckCircle2 size={28} />
          </div>

          <span className="section-label">Membership Activated</span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              color: "#fff",
              marginBottom: "8px",
            }}
          >
            WELCOME TO THE FORGE
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.88rem",
              lineHeight: "1.55",
              marginBottom: "24px",
            }}
          >
            Your registration is confirmed. Present your Member ID at the front desk when you arrive.
          </p>

          {/* Receipt */}
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-sm)",
              padding: "16px",
              textAlign: "left",
              marginBottom: "22px",
            }}
          >
            {[
              { label: "MEMBER ID", value: successData.memberId, accent: true },
              { label: "NAME", value: successData.clientName },
              {
                label: "PLAN",
                value: `${successData.planName} (${formatCurrency(successData.price)})`,
              },
              {
                label: "VALIDITY",
                value: `${successData.startDate} → ${successData.endDate}`,
                green: true,
              },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: i < 3 ? "8px" : 0,
                  marginBottom: i < 3 ? "8px" : 0,
                  borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: row.accent ? "var(--font-display)" : "inherit",
                    fontSize: row.accent ? "1.05rem" : "0.86rem",
                    fontWeight: row.accent ? 900 : 600,
                    color: row.accent ? "var(--accent-red)" : row.green ? "#2ecc71" : "#fff",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href={deskWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-pill"
              style={{ width: "100%" }}
            >
              <MessageSquare size={15} /> CONFIRM WITH FRONT DESK ON WHATSAPP
            </a>
            <Link href="/" className="btn btn-secondary btn-pill" style={{ width: "100%" }}>
              RETURN TO HOMEPAGE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "100px var(--container-pad) 60px", maxWidth: "700px" }}>
      {/* Page Heading */}
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">New Member Enrollment</span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3vw, 2.3rem)",
            color: "#fff",
            marginBottom: "6px",
          }}
        >
          JOIN TITAN FORGE
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.55", maxWidth: "500px" }}>
          Fill in your details below to generate your official Member ID and register your membership.
        </p>
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="login-error" style={{ marginBottom: "20px" }}>
          <AlertCircle size={15} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 01 Personal Information */}
        <div className="join-section">
          <div className="join-section-header">
            <div className="join-section-number">01</div>
            <div className="join-section-title-wrap">
              <div className="join-section-title">Personal Information</div>
              <div className="join-section-desc">Your contact and identification details</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rohan Varma"
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: "12px" }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="e.g. rohan@gmail.com"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
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

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "12px" }}>
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              placeholder="e.g. 100ft Road, Indiranagar, Bangalore"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        {/* 02 Emergency Contact */}
        <div className="join-section">
          <div className="join-section-header">
            <div className="join-section-number">02</div>
            <div className="join-section-title-wrap">
              <div className="join-section-title">Emergency Contact</div>
              <div className="join-section-desc">Someone we can reach if needed</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Name</label>
              <input
                type="text"
                placeholder="e.g. Family member or guardian"
                className="form-input"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                placeholder="e.g. 9876509999"
                className="form-input"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 03 Membership */}
        <div className="join-section" style={{ borderBottom: "none", paddingBottom: "0", marginBottom: "28px" }}>
          <div className="join-section-header">
            <div className="join-section-number">03</div>
            <div className="join-section-title-wrap">
              <div className="join-section-title">Membership Plan</div>
              <div className="join-section-desc">Select your plan and start date</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Select Plan *</label>
              {loadingPlans ? (
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", padding: "8px 0" }}>
                  Loading plans...
                </div>
              ) : (
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
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
          </div>

          {selectedPlan && (
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.88rem" }}>
                  {selectedPlan.name}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                  {selectedPlan.durationDays} Days Access
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.45rem",
                  fontWeight: 900,
                  color: "var(--accent-red)",
                }}
              >
                {formatCurrency(selectedPlan.price)}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          id="join-submit-btn"
          disabled={submitting}
          className="btn btn-primary btn-lg btn-pill"
          style={{ width: "100%" }}
        >
          {submitting ? "GENERATING MEMBER ID..." : "SUBMIT REGISTRATION"}{" "}
          {!submitting && <ArrowRight size={15} />}
        </button>
      </form>
    </div>
  );
}
