import { auth } from "@/lib/auth-server";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const handler = toNextJsHandler(auth);

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Rate-limited auth handler.
 * POST requests (login/signup) are limited to 10 per minute per IP.
 * GET requests (session checks) are limited to 30 per minute per IP.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const result = checkRateLimit(`auth:post:${ip}`, 10, 60_000);

  if (!result.allowed) {
    return NextResponse.json(
      { error: { message: "Too many requests. Please try again later." } },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  return handler.POST!(request);
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const result = checkRateLimit(`auth:get:${ip}`, 30, 60_000);

  if (!result.allowed) {
    return NextResponse.json(
      { error: { message: "Too many requests. Please try again later." } },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  return handler.GET!(request);
}
