"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dumbbell, Menu, X, Shield } from "lucide-react";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Memberships", href: "/memberships" },
    { name: "Trainers", href: "/trainers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="public-navbar">
      <div className="container public-navbar-inner">
        <Link href="/" className="logo-text">
          <Dumbbell size={26} style={{ color: "var(--accent-red)" }} />
          <span>TITAN</span> FORGE
        </Link>

        {/* Desktop Links */}
        <ul className="public-nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`public-nav-link ${pathname === link.href ? "active" : ""}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/join" className="btn btn-primary btn-sm" id="nav-join-btn">
              JOIN NOW
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="btn btn-secondary btn-sm"
              id="nav-admin-btn"
              title="Admin Portal"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Shield size={14} /> ADMIN
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger — shown via CSS at ≤900px */}
        <button
          className="nav-hamburger"
          id="mobile-menu-btn"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border)",
            padding: "20px var(--container-pad)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`public-nav-link ${pathname === link.href ? "active" : ""}`}
              style={{ padding: "10px 0", display: "block", borderBottom: "1px solid var(--border)", fontSize: "1.15rem" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <Link
              href="/join"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              JOIN NOW
            </Link>
            <Link
              href="/admin"
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={16} /> ADMIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
