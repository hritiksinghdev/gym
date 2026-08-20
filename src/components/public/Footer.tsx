import Link from "next/link";
import { Dumbbell, Phone, Mail, MapPin, Clock, Globe } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function PublicFooter() {
  const settings = await prisma.gymSettings.findUnique({
    where: { id: "default" },
  });

  const gymName = settings?.gymName || "TITAN FORGE GYM";
  const address = settings?.address || "Plot 42, Ironworks Industrial Estate, Bangalore";
  const phone = settings?.phone || "+91 98765 43210";
  const email = settings?.email || "contact@titanforgegym.com";
  const openingHours = settings?.openingHours || "Mon - Sat: 5:00 AM - 11:00 PM | Sun: 6:00 AM - 8:00 PM";

  return (
    <footer className="public-footer">
      <div className="container">
        <div className="grid-4" style={{ marginBottom: "48px" }}>
          {/* Brand */}
          <div>
            <Link href="/" className="logo-text" style={{ marginBottom: "16px", display: "inline-flex" }}>
              <Dumbbell size={28} style={{ color: "var(--accent-red)" }} />
              {gymName}
            </Link>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Engineered for true discipline, raw power, and sustained transformation. No compromises.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
              <a href={settings?.instagramUrl || "#"} target="_blank" rel="noreferrer" style={{ color: "#aaa" }} title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href={settings?.facebookUrl || "#"} target="_blank" rel="noreferrer" style={{ color: "#aaa" }} title="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href={settings?.youtubeUrl || "#"} target="_blank" rel="noreferrer" style={{ color: "#aaa" }} title="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <path d="m10 15 5-3-5-3v6Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", marginBottom: "16px", fontSize: "1.1rem" }}>NAVIGATION</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link href="/" style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  About Us & Facilities
                </Link>
              </li>
              <li>
                <Link href="/memberships" style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/trainers" style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Elite Trainers
                </Link>
              </li>
              <li>
                <Link href="/join" style={{ color: "var(--accent-red)", fontWeight: "600", fontSize: "0.95rem" }}>
                  Join Now →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: "#fff", marginBottom: "16px", fontSize: "1.1rem" }}>GET IN TOUCH</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li style={{ display: "flex", gap: "10px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                <MapPin size={18} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
                <span>{address}</span>
              </li>
              <li style={{ display: "flex", gap: "10px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                <Phone size={18} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
                <span>{phone}</span>
              </li>
              <li style={{ display: "flex", gap: "10px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                <Mail size={18} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
                <span>{email}</span>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 style={{ color: "#fff", marginBottom: "16px", fontSize: "1.1rem" }}>TRAINING HOURS</h4>
            <div style={{ display: "flex", gap: "10px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              <Clock size={18} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
              <p style={{ lineHeight: "1.6" }}>{openingHours}</p>
            </div>
            <div style={{ marginTop: "24px" }}>
              <Link href="/admin" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                Staff & Admin Portal
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          <p>© {new Date().getFullYear()} {gymName}. All rights reserved.</p>
          <p>Built for High-Performance Gym Management.</p>
        </div>
      </div>
    </footer>
  );
}
