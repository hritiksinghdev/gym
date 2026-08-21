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
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                style={{
                  display: "flex",
                  gap: "28px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  padding: "0 0 28px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "160px",
                    height: "200px",
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
                      fontSize: "1.7rem",
                      color: "#fff",
                      marginBottom: "4px",
                    }}
                  >
                    {trainer.name}
                  </h3>
                  <div
                    style={{
                      color: "var(--accent-red)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "10px",
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
                      fontSize: "0.85rem",
                      marginBottom: "12px",
                    }}
                  >
                    <Award size={15} style={{ color: "var(--accent-orange)" }} />
                    <span>{trainer.experience}</span>
                  </div>

                  {trainer.bio && (
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: "1.55",
                        marginBottom: "18px",
                        maxWidth: "560px",
                      }}
                    >
                      {trainer.bio}
                    </p>
                  )}

                  <Link href="/join" className="btn btn-secondary btn-sm">
                    Book Personal Consultation →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: "64px", textAlign: "center", maxWidth: "580px", margin: "64px auto 0" }}>
            <Flame size={32} style={{ color: "var(--accent-red)", margin: "0 auto 16px" }} />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                color: "#fff",
                marginBottom: "12px",
              }}
            >
              LOOKING FOR 1-ON-1 PERSONAL TRAINING?
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem", lineHeight: "1.65" }}>
              Our coaches work directly with athletes of all skill levels on tailored programming, nutritional
              guidance, and lifting mechanics.
            </p>
            <Link href="/contact" className="btn btn-primary">
              INQUIRE ABOUT PERSONAL COACHING
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
