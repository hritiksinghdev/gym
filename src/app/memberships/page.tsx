import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MembershipsPage() {
  let settings = null;
  let plans: any[] = [];

  try {
    [settings, plans] = await Promise.all([
      prisma.gymSettings.findUnique({
        where: { id: "default" },
      }),
      prisma.membershipPlan.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
  } catch (error) {
    console.error(
      "MembershipsPage database query error:",
      error instanceof Error ? error.message : "Unable to load membership plans"
    );
  }

  const currencySymbol = settings?.currencySymbol || "₹";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />

      {/* Header Banner */}
      <section style={{ backgroundColor: "#111", borderBottom: "1px solid var(--border)", padding: "60px 0" }}>
        <div className="container">
          <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            TRANSPARENT PRICING
          </div>
          <h1 style={{ fontSize: "3.5rem", color: "#fff" }}>MEMBERSHIP PACKAGES</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", maxWidth: "600px", marginTop: "12px" }}>
            Straightforward pricing with no hidden registration fees, lock-in contracts, or surprise maintenance charges.
          </p>
        </div>
      </section>

      {/* Plans List */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="grid-4">
            {plans.map((plan) => {
              let benefitsList: string[] = [];
              if (plan.benefits) {
                try {
                  benefitsList = JSON.parse(plan.benefits);
                } catch {
                  benefitsList = plan.benefits.split("\n");
                }
              }

              const isPopular = plan.name.toLowerCase().includes("quarterly") || plan.name.toLowerCase().includes("yearly");

              return (
                <div
                  key={plan.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    border: isPopular ? "2px solid var(--accent-red)" : "1px solid var(--border)",
                    backgroundColor: isPopular ? "#191919" : "var(--bg-card)",
                  }}
                >
                  {isPopular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px",
                        right: "16px",
                        background: "var(--accent-red)",
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: "2px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {plan.name.toLowerCase().includes("yearly") ? "BEST VALUE (365 DAYS)" : "MOST POPULAR"}
                    </div>
                  )}

                  <div>
                    <h3 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: "4px" }}>{plan.name}</h3>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "20px" }}>
                      Full Access • {plan.durationDays} Days Duration
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "var(--text-white)" }}>
                        {formatCurrency(plan.price, currencySymbol)}
                      </span>
                    </div>

                    {plan.description && (
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px", lineHeight: "1.5" }}>
                        {plan.description}
                      </p>
                    )}

                    <div style={{ borderTop: "1px solid #282828", paddingTop: "20px", marginBottom: "32px" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#888", letterSpacing: "1px", marginBottom: "12px" }}>
                        INCLUDED PERKS:
                      </div>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {benefitsList.map((b, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.88rem", color: "var(--text-primary)" }}>
                            <CheckCircle2 size={16} style={{ color: "var(--accent-red)", flexShrink: 0, marginTop: "2px" }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link href={`/join?plan=${plan.id}`} className="btn btn-primary" style={{ width: "100%" }}>
                    SELECT & REGISTER
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Membership FAQ / Notice */}
          <div className="card" style={{ marginTop: "60px", padding: "32px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldCheck size={24} style={{ color: "var(--accent-red)" }} />
              MEMBERSHIP TERMS & GUARANTEES
            </h3>
            <div className="grid-3" style={{ gap: "24px" }}>
              <div>
                <h4 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "6px" }}>Instant Activation</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.5" }}>
                  Your membership begins immediately upon registration or on your custom chosen start date.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "6px" }}>Locker & Shower Access</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.5" }}>
                  All plans include complimentary day locker usage and high-pressure hot shower amenities.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "6px" }}>Renewal Reminders</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.5" }}>
                  We send polite reminders before your expiry date so you never experience interrupted training.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
