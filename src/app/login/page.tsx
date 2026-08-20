"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dumbbell, Lock, Mail, AlertCircle, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("admin@gym.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Successful login
      router.push(from);
      router.refresh();
    } catch (err) {
      console.error("Login request error:", err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Branding header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" className="logo-text" style={{ justifyContent: "center", marginBottom: "12px", display: "inline-flex" }}>
            <Dumbbell size={32} style={{ color: "var(--accent-red)" }} />
            <span>TITAN</span> FORGE
          </Link>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
            <Shield size={16} style={{ color: "var(--accent-red)" }} /> ADMIN & STAFF PORTAL
          </div>
        </div>

        <div className="card" style={{ padding: "36px 28px", border: "1px solid var(--border)", backgroundColor: "#141414" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: "8px" }}>STAFF LOGIN</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "24px" }}>
            Sign in with authorized administrator credentials to manage gym operations.
          </p>

          {error && (
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
                fontSize: "0.88rem",
                marginBottom: "20px",
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: "38px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gym.com"
                />
                <Mail
                  size={16}
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#777" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: "38px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Lock
                  size={16}
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#777" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px" }}
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN TO DASHBOARD"} <ArrowRight size={18} />
            </button>
          </form>

          {/* Dev credentials note */}
          <div
            style={{
              marginTop: "24px",
              padding: "12px",
              background: "#0d0d0d",
              border: "1px dashed #333",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            <strong style={{ color: "#fff" }}>Demo Admin Credentials:</strong>
            <br />
            Email: <span style={{ color: "var(--accent-red)" }}>admin@gym.com</span>
            <br />
            Password: <span style={{ color: "var(--accent-red)" }}>admin123</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0a0a" }} />}>
      <LoginForm />
    </Suspense>
  );
}
