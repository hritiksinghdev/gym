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

      {/* Header Banner */}
      <section style={{ backgroundColor: "#111", borderBottom: "1px solid var(--border)", padding: "60px 0" }}>
        <div className="container">
          <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            EXPERT COACHING STAFF
          </div>
          <h1 style={{ fontSize: "3.5rem", color: "#fff" }}>ELITE STRENGTH TRAINERS</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", maxWidth: "600px", marginTop: "12px" }}>
            Coached by competitive athletes with proven track records in powerlifting, physique prep, and athletic performance.
          </p>
        </div>
      </section>

      {/* Trainers List */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="grid-2" style={{ gap: "32px" }}>
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="card"
                style={{
                  display: "flex",
                  gap: "24px",
                  flexDirection: "row",
                  padding: "24px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "160px",
                    height: "200px",
                    borderRadius: "var(--radius-sm)",
                    background: `url(${trainer.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}) center/cover no-repeat`,
                    flexShrink: 0,
                    border: "1px solid var(--border)",
                  }}
                />

                <div style={{ flex: 1, minWidth: "220px" }}>
                  <h3 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "4px" }}>
                    {trainer.name}
                  </h3>
                  <div
                    style={{
                      display: "inline-block",
                      color: "var(--accent-red)",
                      fontSize: "0.85rem",
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
                    <Award size={16} style={{ color: "var(--accent-orange)" }} />
                    <span>{trainer.experience}</span>
                  </div>

                  {trainer.bio && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "16px" }}>
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

          <div
            className="card"
            style={{
              marginTop: "60px",
              textAlign: "center",
              padding: "48px 24px",
              background: "linear-gradient(180deg, #151515 0%, #111111 100%)",
            }}
          >
            <Flame size={36} style={{ color: "var(--accent-red)", margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "2.2rem", color: "#fff", marginBottom: "12px" }}>
              LOOKING FOR 1-ON-1 PERSONAL TRAINING?
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 24px", fontSize: "1rem" }}>
              Our coaches work directly with athletes of all skill levels on tailored programming, nutritional guidance, and lifting mechanics.
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
