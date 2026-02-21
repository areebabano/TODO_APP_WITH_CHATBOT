import { NextResponse } from "next/server";

/**
 * Server-side signout: clears ALL auth cookies and redirects to /login.
 * This is bulletproof because cookies are cleared in the response headers
 * BEFORE the redirect happens, so middleware won't bounce back to /tasks.
 */
export async function GET() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));

  // Clear all Better Auth cookies
  response.cookies.set("better-auth.session_token", "", {
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  response.cookies.set("better-auth.session_data", "", {
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}

export async function POST() {
  return GET();
}
