"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    bg: "bg-accent-emerald-50",
    border: "border-accent-emerald-200",
    text: "text-accent-emerald-700",
    icon: (
      <div className="w-8 h-8 rounded-xl bg-accent-emerald-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-accent-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
  },
  error: {
    bg: "bg-accent-rose-50",
    border: "border-accent-rose-200",
    text: "text-accent-rose-700",
    icon: (
      <div className="w-8 h-8 rounded-xl bg-accent-rose-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-accent-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  },
  info: {
    bg: "bg-brand-50",
    border: "border-brand-200",
    text: "text-brand-700",
    icon: (
      <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
};

export default function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  const config = toastConfig[type];

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-4 right-4 z-[100] max-w-sm"
        >
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lift-lg backdrop-blur-xl ${config.bg} ${config.border}`}
          >
            {config.icon}
            <p className={`text-sm font-medium flex-1 ${config.text}`}>
              {message}
            </p>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/50 text-slate-400 hover:text-slate-600 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Auto-dismiss progress bar */}
          {duration > 0 && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`h-0.5 mt-0.5 mx-4 rounded-full origin-left ${
                type === "success"
                  ? "bg-accent-emerald-400"
                  : type === "error"
                  ? "bg-accent-rose-400"
                  : "bg-brand-400"
              }`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
