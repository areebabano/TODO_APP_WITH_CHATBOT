"use client";

import { useSession, signOut } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { data: session, isPending } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    setShowProfile(false);
    signOut();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "?";

  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/60 backdrop-blur-xl flex items-center px-4 lg:px-6 gap-4 relative z-30">
      {/* Mobile menu button */}
      <button onClick={onMenuToggle} className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border-0 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* 4-color dots indicator */}
        <div className="hidden sm:flex items-center gap-1 mr-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-rose-500 animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-amber-500 animate-pulse-soft" style={{ animationDelay: "1s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald-500 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose-500 rounded-full" />
        </button>

        {/* Profile dropdown */}
        {!isPending && session?.user && (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-sm font-semibold shadow-brand-sm">
                  {userInitial}
                </div>
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {session.user.name || session.user.email}
              </span>
              <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-glass-lg border border-slate-200/60 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-800 truncate">{session.user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                    {/* Mini color bar */}
                    <div className="flex items-center gap-1 mt-2">
                      <span className="flex-1 h-0.5 rounded-full bg-brand-500" />
                      <span className="flex-1 h-0.5 rounded-full bg-accent-rose-500" />
                      <span className="flex-1 h-0.5 rounded-full bg-accent-amber-500" />
                      <span className="flex-1 h-0.5 rounded-full bg-accent-emerald-500" />
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-accent-rose-600 hover:bg-accent-rose-50 rounded-xl cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}
