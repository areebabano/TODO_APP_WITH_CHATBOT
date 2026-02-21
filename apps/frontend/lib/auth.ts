/**
 * Auth utilities wrapping Better Auth client.
 *
 * Authentication is fully cookie-based (httpOnly, Secure, SameSite=Lax).
 * No tokens are ever stored in localStorage or exposed to client JavaScript.
 * API calls go through Next.js proxy routes that forward the cookie securely.
 */

import { authClient } from "./auth-client";

export const { signIn, signUp, useSession } = authClient;

/**
 * Sign out: clear server-side httpOnly cookies via the signout API route,
 * then redirect to login.
 */
export function signOut() {
  if (typeof window !== "undefined") {
    window.location.href = "/api/signout";
  }
}
