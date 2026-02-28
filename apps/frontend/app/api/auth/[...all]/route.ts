import { auth } from "@/lib/auth-server";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

/**
 * Auth handler for Better Auth.
 * Rate limiting removed because in-memory rate limiters do NOT work
 * on Vercel serverless (each invocation gets a fresh memory space).
 * Vercel has built-in DDoS protection, and Better Auth has its own safeguards.
 */
export async function POST(request: NextRequest) {
  try {
    return await handler.POST!(request);
  } catch (error) {
    console.error("[Auth POST Error]", error);
    return NextResponse.json(
      { error: { message: "Authentication service error. Please try again." } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    return await handler.GET!(request);
  } catch (error) {
    console.error("[Auth GET Error]", error);
    return NextResponse.json(
      { error: { message: "Authentication service error. Please try again." } },
      { status: 500 }
    );
  }
}
