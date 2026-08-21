// TEMPORARY DEMO AUTH — REPLACE WITH FIREBASE
// This server action bypasses the database entirely.
// It issues a real JWT so the existing middleware (src/proxy.ts) accepts it.
// When Firebase auth is added, delete this file and replace the login page's
// handleLogin function with Firebase signInWithEmailAndPassword().

"use server";

import { cookies } from "next/headers";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function signInDemo(): Promise<void> {
  const token = await createSessionToken({
    id: "demo-admin",
    email: "admin@gym.com",
    name: "Admin",
    role: "admin",
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
