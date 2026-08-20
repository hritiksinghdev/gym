import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import { CheckCircle2, Trophy, Flame, Dumbbell, Users, Shield, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Force dynamic so admin updates to plans/settings immediately show
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await prisma.gymSettings.findUnique({
    where: { id: "default" },
  });

  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const trainers = await prisma.trainer.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 4,
  });

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

            <h1 className="hero-title">{heroHeadline}</h1>
            <p className="hero-subtitle">{heroDescription}</p>

            <div className="hero-actions">
              <Link href="/join" className="btn btn-primary btn-lg">
                JOIN NOW <ArrowRight size={20} />
              </Link>
              <Link href="/memberships" className="btn btn-secondary btn-lg">
                VIEW MEMBERSHIPS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS BAR */}
      <section style={{ backgroundColor: "#111", borderBottom: "1px solid var(--border)", padding: "36px 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "24px",
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "var(--accent-red)" }}>
                500+
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                Active Lifters
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "var(--accent-red)" }}>
                15+
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                Certified Coaches
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "var(--accent-red)" }}>
                10,000
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                Sq.Ft Heavy Iron Floor
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, color: "var(--accent-red)" }}>
                100+
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                Custom Equipment Units
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US / FEATURES */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
              WHY TRAIN WITH US
            </div>
            <h2 style={{ fontSize: "2.5rem", color: "#fff" }}>BUILT FOR THOSE WHO DEMAND RESULTS</h2>
          </div>

          <div className="grid-3">
            <div className="card" style={{ padding: "32px 24px" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(229, 56, 59, 0.15)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-red)", marginBottom: "20px" }}>
                <Dumbbell size={26} />
              </div>
              <h3 style={{ fontSize: "1.4rem", color: "#fff", marginBottom: "12px" }}>HEAVY DUTY EQUIPMENT</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.95rem" }}>
                Olympic grade barbells, calibrated steel plates, multi-grip power racks, and specialized isolation machines.
              </p>
            </div>

            <div className="card" style={{ padding: "32px 24px" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(229, 56, 59, 0.15)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-red)", marginBottom: "20px" }}>
                <Trophy size={26} />
              </div>
              <h3 style={{ fontSize: "1.4rem", color: "#fff", marginBottom: "12px" }}>NO-NONSENSE COACHING</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.95rem" }}>
                Experienced lifters and competitive athletes who coach form, progressive overload, and high-impact nutrition.
              </p>
            </div>

            <div className="card" style={{ padding: "32px 24px" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(229, 56, 59, 0.15)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-red)", marginBottom: "20px" }}>
                <Shield size={26} />
              </div>
              <h3 style={{ fontSize: "1.4rem", color: "#fff", marginBottom: "12px" }}>SERIOUS TRAINING CULTURE</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.95rem" }}>
                A respectful, focused environment where people come to put in actual work. Zero gimmicks, zero crowd bottlenecks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP PLANS PREVIEW */}
      <section style={{ padding: "80px 0", backgroundColor: "#0e0e0e", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                MEMBERSHIP PLANS
              </div>
              <h2 style={{ fontSize: "2.5rem", color: "#fff" }}>CHOOSE YOUR COMMITMENT</h2>
            </div>
            <Link href="/memberships" className="btn btn-secondary">
              ALL PLANS & DETAILS →
            </Link>
          </div>

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

              return (
                <div
                  key={plan.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    border: plan.name.toLowerCase().includes("yearly") || plan.name.toLowerCase().includes("quarterly")
                      ? "1px solid var(--accent-red)"
                      : "1px solid var(--border)",
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
                        padding: "3px 8px",
                        borderRadius: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      BEST VALUE
                    </div>
                  )}

                  <div>
                    <h3 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "6px" }}>{plan.name}</h3>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "20px" }}>
                      Valid for {plan.durationDays} Days
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 900, color: "var(--text-white)" }}>
                        {formatCurrency(plan.price, currencySymbol)}
                      </span>
                    </div>

                    {plan.description && (
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "20px", lineHeight: "1.5" }}>
                        {plan.description}
                      </p>
                    )}

                    <div style={{ borderTop: "1px solid #282828", paddingTop: "16px", marginBottom: "24px" }}>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {benefitsList.slice(0, 4).map((b, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            <CheckCircle2 size={16} style={{ color: "var(--accent-red)", flexShrink: 0, marginTop: "2px" }} />
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
        </div>
      </section>

      {/* TRAINERS PREVIEW */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                COACHING STAFF
              </div>
              <h2 style={{ fontSize: "2.5rem", color: "#fff" }}>MEET THE FORGE TRAINERS</h2>
            </div>
            <Link href="/trainers" className="btn btn-secondary">
              VIEW ALL COACHES →
            </Link>
          </div>

          <div className="grid-4">
            {trainers.map((t) => (
              <div key={t.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    height: "260px",
                    background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%), url(${t.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}) center/cover no-repeat`,
                  }}
                />
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "4px" }}>{t.name}</h3>
                  <div style={{ color: "var(--accent-red)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>
                    {t.specialization}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    {t.experience}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section style={{ padding: "80px 0", backgroundColor: "var(--accent-red)", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
          <h2 style={{ fontSize: "3.2rem", fontWeight: 900, marginBottom: "16px", color: "#fff" }}>
            STOP WAITING. START LIFTING.
          </h2>
          <p style={{ fontSize: "1.2rem", marginBottom: "32px", opacity: 0.95 }}>
            Sign up online in 60 seconds, receive your unique Member ID, and walk right in today.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link
              href="/join"
              className="btn btn-lg"
              style={{ background: "#000", color: "#fff", borderColor: "#000" }}
            >
              REGISTER ONLINE NOW
            </Link>
            <Link
              href="/contact"
              className="btn btn-lg"
              style={{ background: "transparent", color: "#fff", borderColor: "#fff" }}
            >
              VISIT GYM LOCATION
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
