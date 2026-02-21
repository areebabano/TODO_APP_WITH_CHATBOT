"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const ProtectedRoute = dynamic(
  () => import("@/components/auth/ProtectedRoute"),
  { ssr: false }
);
const Sidebar = dynamic(() => import("@/components/layout/Sidebar"), {
  ssr: false,
});
const Navbar = dynamic(() => import("@/components/layout/Navbar"), {
  ssr: false,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-surface-gradient overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
