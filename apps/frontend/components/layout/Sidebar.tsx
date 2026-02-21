"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "All Tasks",
    href: "/tasks",
    color: "brand",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
];

const colorCategories = [
  { label: "Personal", color: "bg-brand-500", textColor: "text-brand-700", bgColor: "bg-brand-50" },
  { label: "Work", color: "bg-accent-rose-500", textColor: "text-accent-rose-700", bgColor: "bg-accent-rose-50" },
  { label: "Ideas", color: "bg-accent-amber-500", textColor: "text-accent-amber-700", bgColor: "bg-accent-amber-50" },
  { label: "Goals", color: "bg-accent-emerald-500", textColor: "text-accent-emerald-700", bgColor: "bg-accent-emerald-50" },
];

const shortcuts = [
  { keys: "N", action: "New task" },
  { keys: "Esc", action: "Close modal" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = (() => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const today = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const userName = session?.user?.name?.split(" ")[0] || "there";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo with rainbow accent */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-2px] rounded-[14px] opacity-50"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #f43f5e, #f59e0b, #10b981, #8b5cf6)",
            }}
          />
          <div className="relative w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-rose-500">
          Taskflow
        </span>
      </div>

      {/* Color bar */}
      <div className="mx-6 h-1 rounded-full bg-gradient-to-r from-brand-500 via-accent-rose-500 via-accent-amber-500 to-accent-emerald-500 opacity-30" />

      {/* Greeting section */}
      <div className="px-6 pt-5 pb-3">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-semibold text-slate-800"
        >
          {greeting}, {userName}!
        </motion.p>
        <p className="text-xs text-slate-400 mt-0.5">{today}</p>
      </div>

      {/* Quick Add Button */}
      <div className="px-4 mb-4">
        <Link href="/tasks" onClick={onClose}>
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-gradient text-white shadow-brand-sm cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-semibold">New Task</span>
            <kbd className="ml-auto px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-mono">N</kbd>
          </motion.div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={isActive ? "sidebar-link-active" : "sidebar-link"}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-6 bg-brand-gradient rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Color Categories */}
      <div className="px-4 mt-6">
        <p className="px-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Categories
        </p>
        <div className="space-y-1.5">
          {colorCategories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl ${cat.bgColor} cursor-pointer hover:shadow-sm transition-shadow`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
              <span className={`text-xs font-semibold ${cat.textColor}`}>{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visual decoration - animated mini progress ring */}
      <div className="px-6 mt-6 flex justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="6" />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="url(#progressGradient)"
              strokeDasharray={2 * Math.PI * 40}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 40 * 0.35 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="33%" stopColor="#f43f5e" />
                <stop offset="66%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="text-lg font-bold text-slate-700"
            >
              65%
            </motion.span>
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Focus</span>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Shortcuts */}
      <div className="px-4 mb-3">
        <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Shortcuts
        </p>
        <div className="space-y-1.5">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex items-center justify-between px-3 py-1.5">
              <span className="text-xs text-slate-500">{s.action}</span>
              <kbd className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-mono text-slate-500 shadow-sm border border-slate-200/60">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom card */}
      <div className="px-4 pb-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 via-accent-rose-50/50 to-accent-amber-50/50 border border-brand-100/50 relative overflow-hidden">
          {/* Animated shimmer */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-brand-500" />
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="w-2 h-2 rounded-full bg-accent-rose-500" />
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="w-2 h-2 rounded-full bg-accent-amber-500" />
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} className="w-2 h-2 rounded-full bg-accent-emerald-500" />
            </div>
            <p className="text-xs font-semibold text-brand-700">Stay focused!</p>
            <p className="text-xs text-brand-600/70 mt-1">
              Organize tasks by categories to boost your productivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200/60 bg-white/50 backdrop-blur-xl overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-glass-xl z-50 lg:hidden overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
