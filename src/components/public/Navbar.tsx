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
          <Dumbbell size={28} className="text-accent" style={{ color: "var(--accent-red)" }} />
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
            <Link href="/join" className="btn btn-primary btn-sm">
              JOIN NOW
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="btn btn-secondary btn-sm"
              title="Admin Portal"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Shield size={16} /> ADMIN
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="btn btn-secondary btn-sm"
          style={{ display: "none" }}
          id="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "#121212",
            borderBottom: "1px solid var(--border)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="public-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <Link
              href="/join"
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              JOIN NOW
            </Link>
            <Link
              href="/admin"
              className="btn btn-secondary btn-sm"
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
