import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import { Phone, Mail, MapPin, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ContactPage() {
  let settings = null;
  try {
    settings = await prisma.gymSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error(
      "ContactPage database query error:",
      error instanceof Error ? error.message : "Unable to load contact settings"
    );
  }

  const gymName = settings?.gymName || "TITAN FORGE GYM";
  const address = settings?.address || "Plot 42, Ironworks Industrial Estate, 2nd Cross, Bangalore";
  const phone = settings?.phone || "+91 98765 43210";
  const whatsappNumber = settings?.whatsappNumber || "919876543210";
  const email = settings?.email || "contact@titanforgegym.com";
  const openingHours =
    settings?.openingHours || "Mon - Sat: 5:00 AM - 11:00 PM | Sun: 6:00 AM - 8:00 PM";
  const googleMapsUrl = settings?.googleMapsUrl || "https://maps.google.com";

  const whatsappChatUrl = generateWhatsAppUrl(
    whatsappNumber,
    `Hello ${gymName}, I would like to inquire about gym memberships and training.`
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />

      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <span className="page-header-label">Get In Touch</span>
          <h1 className="page-header-title">LOCATION &amp; CONTACT</h1>
          <p className="page-header-sub">
            Drop by our facility during floor hours or reach out directly to the front desk team.
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: "40px", alignItems: "flex-start" }}>
            {/* Left: contact rows + WhatsApp */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {/* Address */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  paddingBottom: "20px",
                  marginBottom: "20px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    background: "var(--accent-red-glow)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-red)",
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "var(--text-muted)",
                      marginBottom: "3px",
                    }}
                  >
                    Gym Address
                  </div>
                  <p style={{ color: "var(--text-primary)", fontSize: "0.92rem", lineHeight: "1.5" }}>
                    {address}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "var(--accent-red)",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      marginTop: "6px",
                    }}
                  >
                    Open in Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  paddingBottom: "20px",
                  marginBottom: "20px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    background: "var(--accent-red-glow)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-red)",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "var(--text-muted)",
                      marginBottom: "3px",
                    }}
                  >
                    Training Hours
                  </div>
                  <p style={{ color: "var(--text-primary)", fontSize: "0.92rem", lineHeight: "1.55" }}>
                    {openingHours}
                  </p>
                </div>
              </div>

              {/* Phone & Email */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  paddingBottom: "24px",
                  marginBottom: "24px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    background: "var(--accent-red-glow)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-red)",
                    flexShrink: 0,
                  }}
                >
                  <Phone size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "var(--text-muted)",
                      marginBottom: "3px",
                    }}
                  >
                    Phone &amp; Email
                  </div>
                  <p style={{ color: "var(--text-primary)", fontSize: "0.92rem", marginBottom: "3px" }}>
                    {phone}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    <Mail size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                    {email}
                  </p>
                </div>
              </div>

              <a
                href={whatsappChatUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-lg btn-pill"
                style={{ width: "100%", textAlign: "center" }}
              >
                <MessageSquare size={17} /> CHAT ON WHATSAPP
              </a>
            </div>

            {/* Right: visitor info */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  color: "#fff",
                  marginBottom: "10px",
                }}
              >
                FIRST TIME VISITING?
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  fontSize: "0.92rem",
                  marginBottom: "20px",
                }}
              >
                We encourage prospective lifters to drop in during training hours, inspect our equipment, meet
                our coaches, and see our community in action.
              </p>

              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "var(--text-muted)",
                    marginBottom: "10px",
                  }}
                >
                  VISITOR GUIDELINES
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    "Clean training shoes are mandatory on the gym floor",
                    "Always bring a workout towel for hygiene",
                    "Chalk is provided at designated lifting platforms",
                    "Re-rack all plates and dumbbells after use",
                  ].map((rule, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: "8px",
                        color: "var(--text-secondary)",
                        fontSize: "0.88rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--accent-red)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          lineHeight: 1,
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      >
                        —
                      </span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  height: "190px",
                  borderRadius: "var(--radius-sm)",
                  background:
                    "url('https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1000&auto=format&fit=crop&q=80') center/cover no-repeat",
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
