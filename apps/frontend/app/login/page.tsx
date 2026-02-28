"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import AuthIllustration from "@/components/ui/AuthIllustration";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await signIn.email(
        { email, password },
        {
          onError: (ctx) => {
            if (ctx.error.status === 429) {
              setError("Too many attempts. Please wait a minute and try again.");
            } else if (ctx.error.status === 401 || ctx.error.status === 403) {
              setError("Invalid email or password.");
            } else {
              setError(ctx.error.message || "Login failed. Please try again.");
            }
          },
          onSuccess: () => {
            router.push("/tasks");
            router.refresh();
          },
        }
      );
      // Fallback check if callbacks didn't fire
      if (res?.error) {
        setError("Invalid email or password.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-gradient relative overflow-hidden">
        {/* Abstract blurred shapes */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-200/15 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">Taskflow</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="mt-2 text-slate-500">Sign in to continue to your workspace</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-red-50 border border-red-100 p-4"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-premium pl-11 ${fieldErrors.email ? "ring-2 ring-red-300" : ""}`}
                  placeholder="you@example.com"
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-premium pl-11 ${fieldErrors.password ? "ring-2 ring-red-300" : ""}`}
                  placeholder="Enter your password"
                />
              </div>
              {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="brand-button w-full py-3.5 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #e11d48 50%, #d97706 100%)" }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-emerald-300 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent-amber-300 rounded-full blur-3xl animate-blob" style={{ animationDelay: "5s" }} />
        </div>
        <div className="relative z-10 p-12 max-w-xl">
          <AuthIllustration />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mt-8"
          >
            <h2 className="text-2xl font-bold text-white">Organize your life</h2>
            <p className="mt-2 text-white/70 text-sm">
              Manage tasks, boost productivity, and achieve your goals with ease.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
