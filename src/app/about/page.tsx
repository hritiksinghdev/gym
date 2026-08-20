import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Dumbbell, ShieldCheck, Flame, Trophy, Award, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await prisma.gymSettings.findUnique({
    where: { id: "default" },
  });

  const gymName = settings?.gymName || "TITAN FORGE GYM";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />

      {/* Header Banner */}
      <section style={{ backgroundColor: "#111", borderBottom: "1px solid var(--border)", padding: "60px 0" }}>
        <div className="container">
          <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            ABOUT OUR FACILITY
          </div>
          <h1 style={{ fontSize: "3.5rem", color: "#fff" }}>WHERE STRENGTH IS FORGED</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", maxWidth: "600px", marginTop: "12px" }}>
            Learn about {gymName}&apos;s founding philosophy, training equipment, and community standards.
          </p>
        </div>
      </section>

      {/* Main Story & Philosophy */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: "center" }}>
            <div>
              <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                OUR PHILOSOPHY
              </div>
              <h2 style={{ fontSize: "2.4rem", color: "#fff", marginBottom: "20px" }}>
                NO GIMMICKS. JUST PROGRESSION.
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1rem", marginBottom: "16px" }}>
                {gymName} was built with a single mandate: create a space where athletes, lifters, and everyday fitness enthusiasts can push their physical limits without fighting for equipment or dealing with commercial gym distractions.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1rem", marginBottom: "28px" }}>
                Every barbell, rack, and bench in our facility has been selected for durability, biomechanical precision, and athlete safety. We believe that true fitness comes from consistent compound training, intelligent progression, and disciplined recovery.
              </p>

              <div style={{ display: "flex", gap: "16px" }}>
                <Link href="/join" className="btn btn-primary">
                  START TRAINING WITH US
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  VISIT IN PERSON
                </Link>
              </div>
            </div>

            <div
              style={{
                height: "420px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80') center/cover no-repeat",
              }}
            />
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section style={{ padding: "80px 0", backgroundColor: "#0c0c0c", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <div style={{ color: "var(--accent-red)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
              FACILITIES & EQUIPMENT
            </div>
            <h2 style={{ fontSize: "2.5rem", color: "#fff" }}>DESIGNED FOR HIGH PERFORMANCE</h2>
          </div>

          <div className="grid-3">
            <div className="card">
              <Dumbbell size={32} style={{ color: "var(--accent-red)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "10px" }}>Powerlifting & Heavy Free Weights</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Full sets of calibrated competition plates, Texas power bars, dedicated deadlift platforms with shock-absorbent drop zones, and heavy dumbbells up to 60kg.
              </p>
            </div>

            <div className="card">
              <Flame size={32} style={{ color: "var(--accent-red)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "10px" }}>Conditioning & Turf Zone</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                30-meter sprint turf, weighted push sleds, battle ropes, assault bikes, rowers, and plyometric boxes for high-intensity athletic conditioning.
              </p>
            </div>

            <div className="card">
              <Trophy size={32} style={{ color: "var(--accent-red)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "10px" }}>Custom Isolation Machines</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Biomechanical lever arms, pendulum squats, belt squat machines, standing chest-supported rows, and dual adjustable cable crossovers.
              </p>
            </div>

            <div className="card">
              <ShieldCheck size={32} style={{ color: "var(--accent-red)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "10px" }}>Lockers & Showers</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Clean, well-maintained locker rooms with hot showers, changing areas, and secure individual storage lockers for all members.
              </p>
            </div>

            <div className="card">
              <Award size={32} style={{ color: "var(--accent-red)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "10px" }}>Body Composition & InBody Assessment</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Periodic segmental body composition analysis, measuring muscle mass, body fat percentage, visceral fat levels, and metabolic rate.
              </p>
            </div>

            <div className="card">
              <HeartHandshake size={32} style={{ color: "var(--accent-red)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "10px" }}>Supportive Community</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Spotters on demand, zero judgment, and a group of like-minded individuals focused on mutual encouragement and relentless progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
