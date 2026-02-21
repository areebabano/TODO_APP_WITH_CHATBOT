"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  isActive: boolean;
}

const colors = ["#8b5cf6", "#f43f5e", "#f59e0b", "#10b981"];

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  color: colors[i % colors.length],
  angle: (i / 12) * 360,
  distance: 30 + Math.random() * 30,
  size: 4 + Math.random() * 4,
  delay: Math.random() * 0.1,
}));

export default function Confetti({ isActive }: ConfettiProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-20 flex items-center justify-center">
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const x = Math.cos(rad) * p.distance;
            const y = Math.sin(rad) * p.distance;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 0, x, y }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: p.size,
                  height: p.size,
                  borderRadius: p.size > 6 ? "2px" : "50%",
                  backgroundColor: p.color,
                }}
              />
            );
          })}
          {/* Central flash */}
          <motion.div
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.4 }}
            className="absolute w-8 h-8 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)",
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
