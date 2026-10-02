"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AdminTabs } from "./Tabs";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <Header title="Human Resource Portal" onMenuClick={() => setSidebarOpen(true)} />
        {user?.role === "ADMIN" && <AdminTabs />}
        <main className="flex-1 overflow-x-hidden bg-white px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
