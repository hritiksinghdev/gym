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
    <header className="public-navbar-header">
      <div className="public-navbar-container">
        {/* Left: Brand Logo */}
        <Link href="/" className="logo-text">
          <Dumbbell size={22} style={{ color: "var(--accent-red)" }} />
          <span>TITAN</span> FORGE
        </Link>

        {/* Center: Navigation Links */}
        <ul className="public-nav-links">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`public-nav-link ${active ? "active" : ""}`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: Actions */}
        <div className="nav-actions">
          <Link
            href="/admin"
            className="btn btn-secondary btn-sm"
            id="nav-admin-btn"
            title="Admin & Staff Portal"
            style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
          >
            <Shield size={13} /> ADMIN
          </Link>
          <Link href="/join" className="btn btn-primary btn-sm btn-pill" id="nav-join-btn">
            JOIN NOW
          </Link>
          {/* Mobile hamburger button */}
          <button
            className="nav-hamburger"
            id="mobile-menu-btn"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`public-nav-link ${pathname === link.href ? "active" : ""}`}
              style={{
                padding: "8px 0",
                display: "block",
                borderBottom: "1px solid var(--border)",
                fontSize: "1rem",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
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
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={14} /> ADMIN
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
