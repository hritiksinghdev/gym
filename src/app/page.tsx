import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { CheckCircle2, Trophy, Flame, Dumbbell, Shield, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Force dynamic so admin updates to plans/settings immediately show
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  let settings = null;
  let plans: any[] = [];
  let trainers: any[] = [];

  try {
    [settings, plans, trainers] = await Promise.all([
      prisma.gymSettings.findUnique({
        where: { id: "default" },
      }),
      prisma.membershipPlan.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.trainer.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 4,
      }),
    ]);
  } catch (error) {
    console.error(
      "HomePage database query error:",
      error instanceof Error ? error.message : "Unable to load homepage data"
    );
  }

  const heroDescription =
    settings?.heroDescription ||
    "Raw iron, expert trainers, and an atmosphere built for results.";
  const currencySymbol = settings?.currencySymbol || "₹";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div style={{ maxWidth: "620px" }}>
            <div className="hero-tag">
              <Flame size={13} /> RAW STRENGTH &amp; DISCIPLINE
            </div>

            <h1 className="hero-title">
              BUILD YOUR<br /><span>STRONGEST</span> SELF.
            </h1>

            <p className="hero-subtitle">{heroDescription}</p>

            <div className="hero-actions">
              <Link href="/join" className="btn btn-primary btn-lg btn-pill">
                JOIN THE FORGE <ArrowRight size={15} />
              </Link>
              <Link href="/memberships" className="btn btn-secondary btn-lg btn-pill">
                VIEW PLANS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Dumbbell size={20} />
              </div>
              <div>
                <span className="feature-label">Equipment</span>
                <div className="feature-heading">Heavy Steel &amp; Calibrated Plates</div>
                <p className="feature-body">
                  Competition powerlifting bars, calibrated steel plates, and commercial isolation machines.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Trophy size={20} />
              </div>
              <div>
                <span className="feature-label">Coaching</span>
                <div className="feature-heading">Certified Elite Coaches</div>
                <p className="feature-body">
                  Competitive powerlifters, bodybuilders, and certified conditioning coaches for optimal progression.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Shield size={20} />
              </div>
              <div>
                <span className="feature-label">Pricing</span>
                <div className="feature-heading">Zero Gimmicks Guarantee</div>
                <p className="feature-body">
                  Transparent membership pricing with no maintenance surcharges or hidden cancellation traps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP PLANS PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Membership Tiers</span>
            <h2 className="section-title">CHOOSE YOUR DISCIPLINE</h2>
            <p className="section-body">
              Flexible membership packages designed for sustained results and peak physical development.
            </p>
          </div>

          <div className="grid-3" style={{ gap: "20px" }}>
            {plans.map((plan) => {
              let benefitsList: string[] = [];
              if (plan.benefits) {
                try {
                  benefitsList = JSON.parse(plan.benefits);
                } catch {
                  benefitsList = plan.benefits.split("\n");
                }
              }
              const isFeature = plan.name.toLowerCase().includes("yearly");

              return (
                <div
                  key={plan.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    border: isFeature ? "1px solid var(--accent-red)" : "1px solid var(--border)",
                  }}
                >
                  {isFeature && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "14px",
                        background: "var(--accent-red)",
                        color: "#fff",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      BEST VALUE
                    </div>
                  )}

                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        color: "#fff",
                        marginBottom: "3px",
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "14px" }}>
                      {plan.durationDays} Days Unlimited Access
                    </div>

                    <div style={{ marginBottom: "14px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "2.1rem",
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
                          fontSize: "0.84rem",
                          marginBottom: "14px",
                          lineHeight: "1.5",
                        }}
                      >
                        {plan.description}
                      </p>
                    )}

                    <ul
                      style={{
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                        paddingTop: "12px",
                        borderTop: "1px solid var(--border)",
                        marginBottom: "18px",
                      }}
                    >
                      {benefitsList.map((b, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "0.82rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          <CheckCircle2 size={13} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={`/join?plan=${plan.id}`} className="btn btn-primary" style={{ width: "100%" }}>
                    JOIN WITH THIS PLAN
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link href="/memberships" className="btn btn-secondary btn-sm">
              View All Membership Details &amp; Terms →
            </Link>
          </div>
        </div>
      </section>

      {/* COACHES */}
      {trainers.length > 0 && (
        <section className="section-alt">
          <div className="container">
            <div className="section-header centered">
              <span className="section-label">Coaching Staff</span>
              <h2 className="section-title">TRAIN WITH THE BEST</h2>
              <p className="section-body">
                Our trainers have competed at national levels and possess decades of combined strength conditioning experience.
              </p>
            </div>

            <div className="grid-4" style={{ gap: "16px" }}>
              {trainers.map((trainer) => (
                <div key={trainer.id} style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      height: "220px",
                      borderRadius: "var(--radius-sm)",
                      background: `url(${
                        trainer.photoUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                      }) center/cover no-repeat`,
                      marginBottom: "10px",
                    }}
                  />
                  <h3 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "2px" }}>{trainer.name}</h3>
                  <div style={{ color: "var(--accent-red)", fontSize: "0.78rem", fontWeight: 700, marginBottom: "3px" }}>
                    {trainer.specialization}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    {trainer.experience}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <Link href="/trainers" className="btn btn-secondary btn-sm">
                Meet the Full Coaching Team →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "580px", margin: "0 auto" }}>
            <span className="section-label">Ready to start?</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#fff", marginBottom: "10px" }}>
              STOP WAITING. START LIFTING.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "24px", lineHeight: "1.6" }}>
              Step onto the training floor and join an uncompromising community dedicated to progressive overload and genuine fitness mastery.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/join" className="btn btn-primary btn-lg btn-pill">
                ENROLL ONLINE TODAY
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg btn-pill">
                TOUR THE FACILITY
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
