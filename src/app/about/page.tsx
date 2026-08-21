import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Dumbbell, ShieldCheck, Flame, Trophy, Award, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AboutPage() {
  let settings = null;
  try {
    settings = await prisma.gymSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error(
      "AboutPage database query error:",
      error instanceof Error ? error.message : "Unable to load about data"
    );
  }

  const gymName = settings?.gymName || "TITAN FORGE GYM";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />

      {/* Page Header Banner */}
      <div className="page-header">
        <div className="container">
          <span className="page-header-label">About Our Facility</span>
          <h1 className="page-header-title">WHERE STRENGTH IS FORGED</h1>
          <p className="page-header-sub">
            Learn about {gymName}&apos;s founding philosophy, training equipment, and community standards.
          </p>
        </div>
      </div>

      {/* Philosophy */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: "center" }}>
            <div>
              <span className="section-label">Our Philosophy</span>
              <h2 className="section-title">NO GIMMICKS.<br />JUST PROGRESSION.</h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.65",
                  fontSize: "0.95rem",
                  marginBottom: "14px",
                  marginTop: "14px",
                }}
              >
                {gymName} was built with a single mandate: create a space where athletes, lifters, and everyday
                fitness enthusiasts can push their physical limits without fighting for equipment or dealing with
                commercial gym distractions.
              </p>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.65",
                  fontSize: "0.95rem",
                  marginBottom: "24px",
                }}
              >
                Every barbell, rack, and bench in our facility has been selected for durability, biomechanical
                precision, and athlete safety. True fitness comes from consistent compound training, intelligent
                progression, and disciplined recovery.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/join" className="btn btn-primary btn-pill">
                  START TRAINING WITH US
                </Link>
                <Link href="/contact" className="btn btn-secondary btn-pill">
                  VISIT IN PERSON
                </Link>
              </div>
            </div>

            <div
              style={{
                height: "380px",
                borderRadius: "var(--radius-md)",
                background:
                  "url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80') center/cover no-repeat",
              }}
            />
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">Facilities &amp; Equipment</span>
            <h2 className="section-title">DESIGNED FOR HIGH PERFORMANCE</h2>
          </div>

          <div className="grid-3">
            <div className="card">
              <Dumbbell size={24} style={{ color: "var(--accent-red)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>
                Powerlifting &amp; Heavy Free Weights
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.55" }}>
                Full sets of calibrated competition plates, Texas power bars, dedicated deadlift platforms with
                shock-absorbent drop zones, and heavy dumbbells up to 60 kg.
              </p>
            </div>

            <div className="card">
              <Flame size={24} style={{ color: "var(--accent-red)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>
                Conditioning &amp; Turf Zone
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.55" }}>
                30-meter sprint turf, weighted push sleds, battle ropes, assault bikes, rowers, and plyometric
                boxes for high-intensity athletic conditioning.
              </p>
            </div>

            <div className="card">
              <Trophy size={24} style={{ color: "var(--accent-red)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>
                Custom Isolation Machines
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.55" }}>
                Biomechanical lever arms, pendulum squats, belt squat machines, standing chest-supported rows,
                and dual adjustable cable crossovers.
              </p>
            </div>

            <div className="card">
              <ShieldCheck size={24} style={{ color: "var(--accent-red)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>
                Lockers &amp; Showers
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.55" }}>
                Clean, well-maintained locker rooms with hot showers, changing areas, and secure individual
                storage lockers for all members.
              </p>
            </div>

            <div className="card">
              <Award size={24} style={{ color: "var(--accent-red)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>
                Body Composition Assessment
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.55" }}>
                Periodic segmental body composition analysis measuring muscle mass, body fat percentage, visceral
                fat levels, and metabolic rate.
              </p>
            </div>

            <div className="card">
              <HeartHandshake size={24} style={{ color: "var(--accent-red)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: "8px" }}>
                Supportive Community
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.55" }}>
                Spotters on demand, zero judgment, and a group of like-minded individuals focused on mutual
                encouragement and relentless progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
