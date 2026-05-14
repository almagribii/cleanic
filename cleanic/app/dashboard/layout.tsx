"use client";
import { useState } from "react";
import { DashboardSidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/Header";
import { ProtectedRoute } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fafafa]">
        <DashboardSidebar onCollapseChange={setIsCollapsed} />
        <div
          className={`transition-all duration-300 ease-in-out ${isCollapsed ? "lg:pl-20" : "lg:pl-64"}`}
        >
          <DashboardHeader collapsed={isCollapsed} />
          <main className="bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(250,250,250,0.78))] px-4 pt-20 pb-10 sm:px-6 lg:px-10 lg:pt-20">
            <div className="mx-auto max-w-400">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
