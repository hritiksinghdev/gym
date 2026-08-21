import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { CheckCircle2, Trophy, Flame, Dumbbell, Users, Shield, ArrowRight } from "lucide-react";
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

  const heroHeadline = settings?.heroHeadline || "BUILD YOUR STRONGEST SELF.";
  const heroDescription =
    settings?.heroDescription ||
    "Raw iron, elite trainers, and an unforgiving atmosphere built to sculpt greatness. No excuses, only results.";
  const currencySymbol = settings?.currencySymbol || "₹";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div style={{ maxWidth: "720px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                background: "rgba(229, 56, 59, 0.15)",
                border: "1px solid var(--accent-red)",
                borderRadius: "var(--radius-sm)",
                color: "var(--accent-red)",
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "20px",
              }}
            >
              <Flame size={16} /> RAW STRENGTH & DISCIPLINE
            </div>

            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: "1.05", marginBottom: "20px" }}>
              {heroHeadline}
            </h1>

            <p
              style={{
                fontSize: "1.2rem",
                color: "var(--text-secondary)",
                marginBottom: "36px",
                lineHeight: "1.6",
                maxWidth: "600px",
              }}
            >
              {heroDescription}
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/join" className="btn btn-primary btn-lg">
                JOIN THE FORGE NOW <ArrowRight size={20} />
              </Link>
              <Link href="/memberships" className="btn btn-secondary btn-lg">
                VIEW PLANS & PRICING
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section style={{ backgroundColor: "#111", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "40px 0" }}>
        <div className="container">
          <div className="grid-3" style={{ gap: "32px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  background: "rgba(229, 56, 59, 0.15)",
                  color: "var(--accent-red)",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  flexShrink: 0,
                }}
              >
                <Dumbbell size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>Heavy Steel & Calibrated Plates</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Competition powerlifting bars, calibrated steel plates, and commercial isolation machines.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  background: "rgba(229, 56, 59, 0.15)",
                  color: "var(--accent-red)",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  flexShrink: 0,
                }}
              >
                <Trophy size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>Certified Elite Coaches</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Competitive powerlifters, bodybuilders, and certified conditioning coaches for optimal progression.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  background: "rgba(229, 56, 59, 0.15)",
                  color: "var(--accent-red)",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  flexShrink: 0,
                }}
              >
                <Shield size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>Zero Gimmicks Guarantee</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Transparent membership pricing with no maintenance surcharges or hidden cancellation traps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP PLANS PREVIEW */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
              MEMBERSHIP TIERS
            </div>
            <h2 style={{ fontSize: "2.5rem", color: "#fff" }}>CHOOSE YOUR DISCIPLINE</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginTop: "12px" }}>
              Flexible membership packages designed for sustained results and peak physical development.
            </p>
          </div>

          <div className="grid-3" style={{ gap: "24px" }}>
            {plans.map((plan) => {
              let benefitsList: string[] = [];
              if (plan.benefits) {
                try {
                  benefitsList = JSON.parse(plan.benefits);
                } catch {
                  benefitsList = plan.benefits.split("\n");
                }
              }

              return (
                <div
                  key={plan.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    border: plan.name.toLowerCase().includes("yearly") ? "2px solid var(--accent-red)" : "1px solid var(--border)",
                  }}
                >
                  {plan.name.toLowerCase().includes("yearly") && (
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
                      BEST VALUE
                    </div>
                  )}

                  <div>
                    <h3 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: "4px" }}>{plan.name}</h3>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "20px" }}>
                      {plan.durationDays} Days Unlimited Access
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "var(--text-white)" }}>
                        {formatCurrency(plan.price, currencySymbol)}
                      </span>
                    </div>

                    {plan.description && (
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px", lineHeight: "1.5" }}>
                        {plan.description}
                      </p>
                    )}

                    <div style={{ borderTop: "1px solid #282828", paddingTop: "16px", marginBottom: "24px" }}>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {benefitsList.map((b, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "var(--text-primary)" }}>
                            <CheckCircle2 size={16} style={{ color: "var(--accent-red)", flexShrink: 0 }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link href={`/join?plan=${plan.id}`} className="btn btn-primary" style={{ width: "100%" }}>
                    JOIN WITH THIS PLAN
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/memberships" className="btn btn-secondary">
              View All Membership Details & Terms →
            </Link>
          </div>
        </div>
      </section>

      {/* COACHES SECTION */}
      {trainers.length > 0 && (
        <section style={{ padding: "80px 0", backgroundColor: "#0c0c0c", borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
              <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                COACHING STAFF
              </div>
              <h2 style={{ fontSize: "2.5rem", color: "#fff" }}>TRAIN WITH THE BEST</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginTop: "12px" }}>
                Our trainers have competed at national levels and possess decades of combined strength conditioning experience.
              </p>
            </div>

            <div className="grid-4" style={{ gap: "24px" }}>
              {trainers.map((trainer) => (
                <div key={trainer.id} className="card" style={{ padding: "16px" }}>
                  <div
                    style={{
                      height: "260px",
                      borderRadius: "var(--radius-sm)",
                      background: `url(${trainer.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}) center/cover no-repeat`,
                      marginBottom: "16px",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "4px" }}>{trainer.name}</h3>
                  <div style={{ color: "var(--accent-red)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px" }}>
                    {trainer.specialization}
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "12px" }}>
                    Experience: {trainer.experience}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/trainers" className="btn btn-secondary">
                Meet the Full Coaching Team →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section style={{ padding: "80px 0", backgroundColor: "#151515", borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <h2 style={{ fontSize: "3rem", color: "#fff", marginBottom: "16px" }}>
            STOP WAITING. START LIFTING.
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "32px", lineHeight: "1.6" }}>
            Step onto the training floor and join an uncompromising community dedicated to progressive overload and genuine fitness mastery.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link href="/join" className="btn btn-primary btn-lg">
              ENROLL ONLINE TODAY
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              TOUR THE FACILITY
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
