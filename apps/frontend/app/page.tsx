"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check auth status via cookie presence (client-side only)
    fetch("/api/auth/get-session", { credentials: "same-origin" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data?.session) setIsLoggedIn(true); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-surface-gradient">
      {/* Animated color blobs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-1/4 w-80 h-80 bg-brand-300/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 right-1/4 w-72 h-72 bg-accent-rose-300/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-1/3 w-64 h-64 bg-accent-amber-300/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-20 right-1/3 w-56 h-56 bg-accent-emerald-300/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-2xl"
        >
          {/* Animated logo with rainbow ring */}
          <div className="mb-8 inline-block relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-4px] rounded-[22px] opacity-60"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #f43f5e, #f59e0b, #10b981, #8b5cf6)",
              }}
            />
            <div className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight mb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-accent-rose-500 to-accent-amber-500">
              Taskflow
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 mb-12 leading-relaxed max-w-md mx-auto">
            Stay organized, boost productivity, and achieve your goals with a beautifully designed task manager.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href="/tasks" className="brand-button px-10 py-4 text-base">
                  Go to Tasks
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/login" className="brand-button px-10 py-4 text-base">
                    Get Started
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/signup"
                    className="inline-flex justify-center items-center px-10 py-4 border border-slate-200 text-base font-semibold rounded-2xl text-slate-700 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow-md"
                  >
                    Create account
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl w-full"
        >
          {[
            {
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              title: "Organize",
              desc: "Create & manage tasks",
              color: "brand",
              bg: "bg-brand-50",
              iconColor: "text-brand-600",
              border: "border-brand-100",
            },
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              title: "Prioritize",
              desc: "Focus on what matters",
              color: "rose",
              bg: "bg-accent-rose-50",
              iconColor: "text-accent-rose-600",
              border: "border-accent-rose-100",
            },
            {
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              title: "Track Time",
              desc: "Stay on schedule",
              color: "amber",
              bg: "bg-accent-amber-50",
              iconColor: "text-accent-amber-600",
              border: "border-accent-amber-100",
            },
            {
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              title: "Complete",
              desc: "Achieve your goals",
              color: "emerald",
              bg: "bg-accent-emerald-50",
              iconColor: "text-accent-emerald-600",
              border: "border-accent-emerald-100",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`glass-card p-5 text-center border ${feature.border} cursor-default`}
            >
              <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mx-auto mb-3`}>
                <svg
                  className={`w-5 h-5 ${feature.iconColor}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800">{feature.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Colorful dots decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce-gentle" />
          <span className="w-2 h-2 rounded-full bg-accent-rose-500 animate-bounce-gentle" style={{ animationDelay: "0.1s" }} />
          <span className="w-2 h-2 rounded-full bg-accent-amber-500 animate-bounce-gentle" style={{ animationDelay: "0.2s" }} />
          <span className="w-2 h-2 rounded-full bg-accent-emerald-500 animate-bounce-gentle" style={{ animationDelay: "0.3s" }} />
        </motion.div>
      </div>
    </div>
  );
}
