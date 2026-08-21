// TODO: Replace with Firebase Authentication
// TEMPORARY DEVELOPMENT AUTHENTICATION — DO NOT STORE IN DATABASE

import { NextResponse } from "next/server";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HARDCODED_ADMIN_EMAIL = "admin@gym.com";
const HARDCODED_ADMIN_PASSWORD = "admin123";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check temporary credentials
    if (
      normalizedEmail !== HARDCODED_ADMIN_EMAIL ||
      password !== HARDCODED_ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Issue JWT session token
    const token = await createSessionToken({
      id: "admin-default",
      email: HARDCODED_ADMIN_EMAIL,
      name: "Gym Head Coach",
      role: "ADMIN",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: "admin-default",
        email: HARDCODED_ADMIN_EMAIL,
        name: "Gym Head Coach",
        role: "ADMIN",
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
