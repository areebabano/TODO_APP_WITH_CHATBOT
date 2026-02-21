"use client";

import { motion } from "framer-motion";

export default function EmptyStateIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Floating color dots */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 right-6 w-4 h-4 rounded-full bg-brand-400/40"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-10 left-4 w-3 h-3 rounded-full bg-accent-rose-400/40"
      />
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-16 right-2 w-3 h-3 rounded-full bg-accent-amber-400/40"
      />
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-8 left-8 w-4 h-4 rounded-full bg-accent-emerald-400/40"
      />

      {/* Main clipboard SVG */}
      <motion.svg
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewBox="0 0 200 200"
        className="w-full h-full"
      >
        {/* Clipboard body */}
        <rect x="50" y="40" width="100" height="130" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2" />
        {/* Clipboard top */}
        <rect x="75" y="30" width="50" height="20" rx="6" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
        <circle cx="100" cy="40" r="4" fill="#cbd5e1" />

        {/* Task lines with color dots */}
        <circle cx="72" cy="72" r="4" fill="#8b5cf6" opacity="0.6" />
        <rect x="84" y="69" width="50" height="6" rx="3" fill="#f1f5f9" />

        <circle cx="72" cy="92" r="4" fill="#f43f5e" opacity="0.6" />
        <rect x="84" y="89" width="40" height="6" rx="3" fill="#f1f5f9" />

        <circle cx="72" cy="112" r="4" fill="#f59e0b" opacity="0.6" />
        <rect x="84" y="109" width="45" height="6" rx="3" fill="#f1f5f9" />

        <circle cx="72" cy="132" r="4" fill="#10b981" opacity="0.6" />
        <rect x="84" y="129" width="35" height="6" rx="3" fill="#f1f5f9" />

        {/* Animated plus button */}
        <motion.g
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="140" cy="145" r="16" fill="url(#emptyGrad)" />
          <path d="M140 138v14M133 145h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>

        <defs>
          <linearGradient id="emptyGrad" x1="124" y1="129" x2="156" y2="161">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
