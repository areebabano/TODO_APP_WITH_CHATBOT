import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

/**
 * Extract the raw session token from a Better Auth signed cookie value.
 *
 * Better Auth signs cookies as: encodeURIComponent(`rawToken.hmacBase64Signature`)
 * The cookie value in the Cookie header is URL-encoded, so we must decode first.
 * The HMAC signature is always 44 chars (base64-encoded SHA-256) ending with '='.
 * The backend stores the raw token in the session table, so we strip the signature.
 */
function extractRawToken(cookieValue: string): string {
  // Step 1: URL-decode the cookie value (Better Auth encodes it with encodeURIComponent)
  let decoded: string;
  try {
    decoded = decodeURIComponent(cookieValue);
  } catch {
    decoded = cookieValue;
  }

  // Step 2: Find and strip the HMAC signature (last segment after '.')
  // Better Auth format: rawToken.base64HmacSignature
  // HMAC-SHA256 in base64 = always 44 chars ending with '='
  const lastDot = decoded.lastIndexOf(".");
  if (lastDot < 1) return decoded;

  const signature = decoded.substring(lastDot + 1);
  if (signature.length === 44 && signature.endsWith("=")) {
    return decoded.substring(0, lastDot);
  }

  // Not a signed cookie format - return decoded value as-is
  return decoded;
}

/**
 * Proxy requests to the FastAPI backend.
 * Reads the httpOnly session cookie, extracts the raw token,
 * and forwards it as a Bearer token to the backend.
 */
export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
  options?: { method?: string; body?: string | null }
): Promise<NextResponse> {
  const rawCookieValue = request.cookies.get("better-auth.session_token")?.value;

  if (!rawCookieValue) {
    return NextResponse.json(
      { detail: "Not authenticated" },
      { status: 401 }
    );
  }

  const sessionToken = extractRawToken(rawCookieValue);

  const method = options?.method || request.method;
  const url = `${BACKEND_URL}${backendPath}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${sessionToken}`,
    "Content-Type": "application/json",
  };

  const fetchOptions: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (options?.body !== undefined) {
    fetchOptions.body = options.body;
  } else if (method !== "GET" && method !== "HEAD") {
    try {
      const body = await request.text();
      if (body) fetchOptions.body = body;
    } catch {
      // No body to forward
    }
  }

  try {
    const backendRes = await fetch(url, fetchOptions);
    const data = await backendRes.text();

    return new NextResponse(data, {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api-proxy] Backend fetch failed:", backendPath, err);
    return NextResponse.json(
      { detail: "Backend service unavailable" },
      { status: 502 }
    );
  }
}
