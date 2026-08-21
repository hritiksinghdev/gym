import { Suspense } from "react";
import PublicNavbar from "@/components/public/Navbar";
import PublicFooter from "@/components/public/Footer";
import JoinForm from "@/components/public/JoinForm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function JoinPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicNavbar />
      <Suspense
        fallback={
          <div className="container" style={{ padding: "80px 0", textAlign: "center", color: "var(--text-secondary)" }}>
            Loading enrollment form...
          </div>
        }
      >
        <JoinForm />
      </Suspense>
      <PublicFooter />
    </div>
  );
}
