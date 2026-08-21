import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Award, Flame } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function TrainersPage() {
  let trainers: any[] = [];
  try {
    trainers = await prisma.trainer.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error(
      "TrainersPage database query error:",
      error instanceof Error ? error.message : "Unable to load trainers"
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />

      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <span className="page-header-label">Expert Coaching Staff</span>
          <h1 className="page-header-title">ELITE STRENGTH TRAINERS</h1>
          <p className="page-header-sub">
            Coached by competitive athletes with proven track records in powerlifting, physique prep, and athletic
            performance.
          </p>
        </div>
      </div>

      {/* Trainer Cards */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  padding: "0 0 24px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "150px",
                    height: "190px",
                    borderRadius: "var(--radius-sm)",
                    background: `url(${
                      trainer.photoUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                    }) center/cover no-repeat`,
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, minWidth: "220px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      color: "#fff",
                      marginBottom: "3px",
                    }}
                  >
                    {trainer.name}
                  </h3>
                  <div
                    style={{
                      color: "var(--accent-red)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "8px",
                    }}
                  >
                    {trainer.specialization}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--text-secondary)",
                      fontSize: "0.84rem",
                      marginBottom: "10px",
                    }}
                  >
                    <Award size={14} style={{ color: "var(--accent-orange)" }} />
                    <span>{trainer.experience}</span>
                  </div>

                  {trainer.bio && (
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.88rem",
                        lineHeight: "1.5",
                        marginBottom: "16px",
                        maxWidth: "540px",
                      }}
                    >
                      {trainer.bio}
                    </p>
                  )}

                  <Link href="/join" className="btn btn-secondary btn-sm btn-pill">
                    Book Personal Consultation →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: "56px", textAlign: "center", maxWidth: "560px", margin: "56px auto 0" }}>
            <Flame size={28} style={{ color: "var(--accent-red)", margin: "0 auto 12px" }} />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                color: "#fff",
                marginBottom: "10px",
              }}
            >
              LOOKING FOR 1-ON-1 PERSONAL TRAINING?
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.92rem", lineHeight: "1.6" }}>
              Our coaches work directly with athletes of all skill levels on tailored programming, nutritional
              guidance, and lifting mechanics.
            </p>
            <Link href="/contact" className="btn btn-primary btn-pill">
              INQUIRE ABOUT PERSONAL COACHING
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
