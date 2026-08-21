// TEMPORARY DEMO AUTH — replace with Firebase authentication later.
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dumbbell, Lock, Mail, AlertCircle, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch (err) {
      console.error("Login request error:", err);
      setError("An unexpected error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand Header */}
        <div className="login-brand">
          <Link href="/" className="login-logo">
            <Dumbbell size={24} style={{ color: "var(--accent-red)" }} />
            <span>TITAN<span style={{ color: "var(--accent-red)" }}>.</span>FORGE</span>
          </Link>
          <div className="login-portal-label">
            <Shield size={13} style={{ color: "var(--accent-red)" }} />
            ADMIN &amp; STAFF PORTAL
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h1 className="login-heading">STAFF LOGIN</h1>
          <p className="login-subtext">
            Sign in with authorized administrator credentials to manage gym operations.
          </p>

          {error && (
            <div className="login-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="login-field">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={15} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  required
                  className="form-input login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gym.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={15} className="input-icon" />
                <input
                  id="login-password"
                  type="password"
                  required
                  className="form-input login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "10px", marginTop: "4px" }}
            >
              {loading ? "SIGNING IN..." : "SIGN IN TO DASHBOARD"}{" "}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Dev Demo Credentials Box */}
          <div className="login-demo-creds">
            <span className="login-demo-label">DEMO CREDENTIALS</span>
            <div className="login-demo-row">
              <span>Email</span>
              <code style={{ color: "var(--accent-red)" }}>admin@gym.com</code>
            </div>
            <div className="login-demo-row">
              <span>Password</span>
              <code style={{ color: "var(--accent-red)" }}>admin123</code>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
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
