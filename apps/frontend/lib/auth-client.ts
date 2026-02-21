import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "https://todo-app-with-chatbot-js74.vercel.app",
});

export const { signIn, signUp, signOut, useSession } = authClient;
