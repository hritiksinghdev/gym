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

      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <span className="page-header-label">Transparent Pricing</span>
          <h1 className="page-header-title">MEMBERSHIP PACKAGES</h1>
          <p className="page-header-sub">
            Straightforward pricing with no hidden registration fees, lock-in contracts, or surprise maintenance
            charges.
          </p>
        </div>
      </div>

      {/* Plans */}
      <section className="section">
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

              const isPopular =
                plan.name.toLowerCase().includes("quarterly") ||
                plan.name.toLowerCase().includes("yearly");

              return (
                <div
                  key={plan.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    border: isPopular
                      ? "1px solid var(--accent-red)"
                      : "1px solid var(--border)",
                    backgroundColor: isPopular ? "#161616" : "var(--bg-card)",
                  }}
                >
                  {isPopular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "14px",
                        background: "var(--accent-red)",
                        color: "#fff",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {plan.name.toLowerCase().includes("yearly") ? "BEST VALUE" : "MOST POPULAR"}
                    </div>
                  )}

                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.45rem",
                        color: "#fff",
                        marginBottom: "3px",
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "16px" }}>
                      Full Access · {plan.durationDays} Days
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "2.4rem",
                          fontWeight: 900,
                          color: "var(--text-white)",
                          lineHeight: 1,
                        }}
                      >
                        {formatCurrency(plan.price, currencySymbol)}
                      </span>
                    </div>

                    {plan.description && (
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.85rem",
                          marginBottom: "16px",
                          lineHeight: "1.5",
                        }}
                      >
                        {plan.description}
                      </p>
                    )}

                    <div
                      style={{
                        paddingTop: "14px",
                        borderTop: "1px solid var(--border)",
                        marginBottom: "22px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          letterSpacing: "1px",
                          marginBottom: "10px",
                        }}
                      >
                        INCLUDED:
                      </div>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {benefitsList.map((b, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "8px",
                              fontSize: "0.84rem",
                              color: "var(--text-primary)",
                            }}
                          >
                            <CheckCircle2
                              size={13}
                              style={{ color: "var(--accent-red)", flexShrink: 0, marginTop: "3px" }}
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={`/join?plan=${plan.id}`}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    SELECT &amp; REGISTER
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Terms notice */}
          <div style={{ marginTop: "56px" }}>
            <div className="section-header">
              <span className="section-label">Membership Terms</span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ShieldCheck size={20} style={{ color: "var(--accent-red)" }} />
                MEMBERSHIP GUARANTEES
              </h3>
            </div>

            <div className="grid-3">
              <div>
                <h4 style={{ fontSize: "0.95rem", color: "#fff", marginBottom: "4px" }}>Instant Activation</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                  Your membership begins immediately upon registration or your custom chosen start date.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", color: "#fff", marginBottom: "4px" }}>Locker &amp; Shower Access</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.5" }}>
                  All plans include complimentary day locker usage and high-pressure hot shower amenities.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", color: "#fff", marginBottom: "4px" }}>Renewal Reminders</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.5" }}>
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
