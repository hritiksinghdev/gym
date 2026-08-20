import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import { Phone, Mail, MapPin, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await prisma.gymSettings.findUnique({
    where: { id: "default" },
  });

  const gymName = settings?.gymName || "TITAN FORGE GYM";
  const address = settings?.address || "Plot 42, Ironworks Industrial Estate, 2nd Cross, Bangalore";
  const phone = settings?.phone || "+91 98765 43210";
  const whatsappNumber = settings?.whatsappNumber || "919876543210";
  const email = settings?.email || "contact@titanforgegym.com";
  const openingHours = settings?.openingHours || "Mon - Sat: 5:00 AM - 11:00 PM | Sun: 6:00 AM - 8:00 PM";
  const googleMapsUrl = settings?.googleMapsUrl || "https://maps.google.com";

  const whatsappChatUrl = generateWhatsAppUrl(
    whatsappNumber,
    `Hello ${gymName}, I would like to inquire about gym memberships and training.`
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />

      {/* Header Banner */}
      <section style={{ backgroundColor: "#111", borderBottom: "1px solid var(--border)", padding: "60px 0" }}>
        <div className="container">
          <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            GET IN TOUCH
          </div>
          <h1 style={{ fontSize: "3.5rem", color: "#fff" }}>LOCATION & CONTACT</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", maxWidth: "600px", marginTop: "12px" }}>
            Drop by our facility during floor hours or reach out directly to the front desk team.
          </p>
        </div>
      </section>

      {/* Contact Information & Map */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="grid-2" style={{ gap: "48px" }}>
            {/* Contact Details Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card">
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "44px", height: "44px", background: "rgba(229, 56, 59, 0.15)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-red)", flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>GYM FACILITY ADDRESS</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.5", fontSize: "0.95rem" }}>
                      {address}
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-red)", fontWeight: 600, fontSize: "0.88rem", marginTop: "10px" }}
                    >
                      Open in Google Maps <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "44px", height: "44px", background: "rgba(229, 56, 59, 0.15)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-red)", flexShrink: 0 }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>OPERATING HOURS</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.95rem" }}>
                      {openingHours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "44px", height: "44px", background: "rgba(229, 56, 59, 0.15)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-red)", flexShrink: 0 }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>PHONE & SUPPORT</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "4px" }}>
                      {phone}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <a
                href={whatsappChatUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ width: "100%", textAlign: "center" }}
              >
                <MessageSquare size={20} /> CHAT ON WHATSAPP WITH DESK
              </a>
            </div>

            {/* Quick Visit Card / Google Map Preview */}
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "12px" }}>FIRST TIME VISITING?</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.95rem", marginBottom: "24px" }}>
                  We encourage prospective lifters to drop in during training hours, inspect our equipment, meet our coaches, and see our community in action.
                </p>

                <div style={{ background: "#111", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "20px", marginBottom: "24px" }}>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: "8px", fontSize: "0.95rem" }}>
                    VISITOR GUIDELINES:
                  </div>
                  <ul style={{ listStyle: "disc", paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "0.88rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <li>Clean training shoes are mandatory on the gym floor</li>
                    <li>Always bring a workout towel for hygiene</li>
                    <li>Chalk is provided at designated lifting platforms</li>
                    <li>Re-rack all plates and dumbbells after use</li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  height: "180px",
                  borderRadius: "var(--radius-sm)",
                  background: "url('https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1000&auto=format&fit=crop&q=80') center/cover no-repeat",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
