// TEMPORARY DEMO AUTH — REPLACE WITH FIREBASE
// Credentials are checked client-side only for demo purposes.
// The signInDemo server action issues a real JWT for the middleware.
// When Firebase is added: replace handleLogin with Firebase signInWithEmailAndPassword(),
// then set the JWT cookie via a Firebase-authenticated server action.

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dumbbell, Lock, Mail, AlertCircle, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { signInDemo } from "./actions";

// TEMPORARY DEMO AUTH — REPLACE WITH FIREBASE
const DEMO_EMAIL = "admin@gym.com";
const DEMO_PASSWORD = "admin123";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TEMPORARY DEMO AUTH — REPLACE WITH FIREBASE
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Local credential check — no API call, no database
      if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      // Issue JWT cookie via server action so middleware accepts the session
      await signInDemo();
      router.push(from);
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand */}
        <div className="login-brand">
          <Link href="/" className="login-logo">
            <Dumbbell size={30} style={{ color: "var(--accent-red)" }} />
            <span>TITAN<span style={{ color: "var(--accent-red)" }}>.</span>FORGE</span>
          </Link>
          <div className="login-portal-label">
            <Shield size={14} style={{ color: "var(--accent-red)" }} />
            ADMIN &amp; STAFF PORTAL
          </div>
        </div>

        {/* Card */}
        <div className="login-card">
          <h1 className="login-heading">STAFF LOGIN</h1>
          <p className="login-subtext">
            Sign in with authorized credentials to manage gym operations.
          </p>

          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
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
              style={{ width: "100%", padding: "14px", marginTop: "4px" }}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"} {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* Demo credentials — visible because this is a demo build */}
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

        <div style={{ textAlign: "center", marginTop: "28px" }}>
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
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#080808" }} />}>
      <LoginForm />
    </Suspense>
  );
}
