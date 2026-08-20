"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { CheckCircle2, Dumbbell, AlertCircle, ArrowRight, MessageSquare, UserCheck } from "lucide-react";
import { formatCurrency, generateWhatsAppUrl } from "@/lib/utils";
import Link from "next/link";

interface PlanOption {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  description?: string;
}

function JoinForm() {
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

  if (successData) {
    const whatsappMsg = `Hi Titan Forge Gym! I just registered online.\nName: ${successData.clientName}\nMember ID: ${successData.memberId}\nPlan: ${successData.planName}`;
    const deskWhatsappUrl = generateWhatsAppUrl("919876543210", whatsappMsg);

    return (
      <div className="container" style={{ padding: "80px 24px", maxWidth: "680px" }}>
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "48px 32px",
            border: "2px solid var(--accent-red)",
            backgroundColor: "#161616",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "rgba(46, 204, 113, 0.15)",
              border: "2px solid #2ecc71",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              color: "#2ecc71",
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <div style={{ color: "var(--accent-red)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.9rem", marginBottom: "8px" }}>
            MEMBERSHIP ACTIVATED
          </div>
          <h1 style={{ fontSize: "2.4rem", color: "#fff", marginBottom: "16px" }}>
            WELCOME TO THE FORGE
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6", marginBottom: "32px" }}>
            Your registration is registered in our management database. Present your Member ID at the front desk when you arrive for your first workout.
          </p>

          <div
            style={{
              background: "#0c0c0c",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
              textAlign: "left",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "12px", marginBottom: "12px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>MEMBER ID</span>
              <span style={{ color: "var(--accent-red)", fontWeight: 900, fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
                {successData.memberId}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "12px", marginBottom: "12px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>MEMBER NAME</span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem" }}>
                {successData.clientName}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "12px", marginBottom: "12px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>SELECTED PLAN</span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem" }}>
                {successData.planName} ({formatCurrency(successData.price)})
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>VALIDITY PERIOD</span>
              <span style={{ color: "#2ecc71", fontWeight: 600, fontSize: "0.9rem" }}>
                {successData.startDate} → {successData.endDate}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a
              href={deskWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
              style={{ width: "100%" }}
            >
              <MessageSquare size={18} /> CONFIRM WITH FRONT DESK ON WHATSAPP
            </a>
            <Link href="/" className="btn btn-secondary" style={{ width: "100%" }}>
              RETURN TO HOMEPAGE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "60px 24px", maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
          NEW LIFTER ENROLLMENT
        </div>
        <h1 style={{ fontSize: "3rem", color: "#fff", marginBottom: "12px" }}>
          JOIN TITAN FORGE GYM
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Fill in your details below to generate your official Member ID and register your membership plan.
        </p>
      </div>

      <div className="card" style={{ padding: "36px 32px" }}>
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

        <form onSubmit={handleSubmit}>
          {/* Section 1: Personal Details */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <UserCheck size={18} style={{ color: "var(--accent-red)" }} /> 1. PERSONAL INFORMATION
            </h3>

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

            <div className="form-row">
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

            <div className="form-group">
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

          {/* Section 2: Emergency Contact */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "16px" }}>
              2. EMERGENCY CONTACT
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Emergency Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Family member or guardian"
                  className="form-input"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Phone</label>
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

          {/* Section 3: Membership Plan Selection */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Dumbbell size={18} style={{ color: "var(--accent-red)" }} /> 3. MEMBERSHIP SELECTION
            </h3>

            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Select Membership Plan *</label>
                {loadingPlans ? (
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading plans...</div>
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
                  background: "#111",
                  border: "1px solid #292929",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ color: "#fff", fontWeight: 700 }}>
                    Selected Plan: {selectedPlan.name}
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    Duration: {selectedPlan.durationDays} Days
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--accent-red)" }}>
                  {formatCurrency(selectedPlan.price)}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
          >
            {submitting ? "GENERATING MEMBER ID..." : "SUBMIT REGISTRATION"} <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />
      <Suspense fallback={<div className="container" style={{ padding: "80px 0", textAlign: "center" }}>Loading form...</div>}>
        <JoinForm />
      </Suspense>
      <PublicFooter />
    </div>
  );
}
