"use client";

import { motion } from "framer-motion";

export default function AuthIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Floating colored blobs */}
      {/* commit */}
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 w-40 h-40 bg-brand-400/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-10 -right-10 w-52 h-52 bg-accent-rose-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 10, 0], y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 right-0 w-32 h-32 bg-accent-amber-400/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ x: [0, -10, 0], y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-1/4 left-0 w-28 h-28 bg-accent-emerald-400/20 rounded-full blur-2xl"
      />

      {/* Main illustration */}
      <motion.svg
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full drop-shadow-xl"
      >
        {/* Background card */}
        <rect x="80" y="60" width="340" height="280" rx="24" fill="white" fillOpacity="0.6" />
        <rect x="80" y="60" width="340" height="280" rx="24" stroke="url(#cardStroke)" strokeWidth="1.5" />

        {/* Rainbow header bar */}
        <rect x="100" y="80" width="300" height="12" rx="6" fill="url(#rainbowBar)" />

        {/* Task items with 4 colors */}
        <g>
          {/* Task 1 - purple, completed */}
          <rect x="100" y="115" width="300" height="48" rx="12" fill="white" fillOpacity="0.8" />
          <rect x="100" y="115" width="4" height="48" rx="2" fill="#8b5cf6" />
          <circle cx="124" cy="139" r="10" fill="#8b5cf6" />
          <path d="M119 139L122 142L129 135" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="144" y="131" width="140" height="8" rx="4" fill="#c4b5fd" fillOpacity="0.4" />
          <rect x="144" y="143" width="80" height="6" rx="3" fill="#e2e8f0" />
          <rect x="360" y="131" width="28" height="16" rx="8" fill="#f5f3ff" />
          <circle cx="374" cy="139" r="3" fill="#8b5cf6" fillOpacity="0.5" />

          {/* Task 2 - rose, active */}
          <rect x="100" y="175" width="300" height="48" rx="12" fill="white" />
          <rect x="100" y="175" width="4" height="48" rx="2" fill="#f43f5e" />
          <circle cx="124" cy="199" r="10" stroke="#f43f5e" strokeWidth="2" fill="none" />
          <rect x="144" y="191" width="180" height="8" rx="4" fill="#475569" fillOpacity="0.3" />
          <rect x="144" y="203" width="100" height="6" rx="3" fill="#e2e8f0" />
          <rect x="360" y="191" width="28" height="16" rx="8" fill="#fff1f2" />
          <circle cx="374" cy="199" r="3" fill="#f43f5e" fillOpacity="0.5" />

          {/* Task 3 - amber, active */}
          <rect x="100" y="235" width="300" height="48" rx="12" fill="white" />
          <rect x="100" y="235" width="4" height="48" rx="2" fill="#f59e0b" />
          <circle cx="124" cy="259" r="10" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <rect x="144" y="251" width="160" height="8" rx="4" fill="#475569" fillOpacity="0.3" />
          <rect x="144" y="263" width="120" height="6" rx="3" fill="#e2e8f0" />
          <rect x="360" y="251" width="28" height="16" rx="8" fill="#fffbeb" />
          <circle cx="374" cy="259" r="3" fill="#f59e0b" fillOpacity="0.5" />
        </g>

        {/* Add button with rainbow gradient */}
        <circle cx="400" cy="320" r="22" fill="url(#addBtnGrad)" />
        <path d="M392 320H408M400 312V328" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

        {/* Floating colored elements */}
        <circle cx="60" cy="140" r="6" fill="#8b5cf6" fillOpacity="0.4" />
        <circle cx="55" cy="220" r="4" fill="#f43f5e" fillOpacity="0.3" />
        <circle cx="440" cy="120" r="5" fill="#f59e0b" fillOpacity="0.4" />
        <circle cx="445" cy="200" r="4" fill="#10b981" fillOpacity="0.3" />
        <rect x="430" y="260" width="12" height="12" rx="3" fill="#8b5cf6" fillOpacity="0.2" transform="rotate(15 436 266)" />

        <defs>
          <linearGradient id="rainbowBar" x1="100" y1="86" x2="400" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="33%" stopColor="#f43f5e" />
            <stop offset="66%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="addBtnGrad" x1="378" y1="298" x2="422" y2="342" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="cardStroke" x1="80" y1="60" x2="420" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="0.33" stopColor="#f43f5e" stopOpacity="0.2" />
            <stop offset="0.66" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="1" stopColor="#10b981" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
