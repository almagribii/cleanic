"use client";

import { Star, LayoutGrid, ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardHeader({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentPath = segments[segments.length - 1];
  const pageTitle = currentPath
    ? currentPath.charAt(0).toUpperCase() +
      currentPath.slice(1).replace(/-/g, " ")
    : "Overview";

  return (
    <header
      className={`fixed top-0 right-0 z-40 hidden h-14 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md transition-all duration-300 lg:flex ${
        collapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[13px] text-slate-500">
          <LayoutGrid size={15} className="text-slate-400" />
          <span className="text-slate-200">/</span>
          <span className="text-slate-400">Dashboards</span>
          <span className="text-slate-200">/</span>
          <span className="font-medium text-slate-900">{pageTitle}</span>
        </div>
      </div>

      {/* KANAN: Navigasi & Actions */}
      <div className="flex items-center gap-5">
        {/* Tombol Back to Public Site (Mengganti Search) */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:bg-[#1a3c2a] hover:text-white"
        >
          <ArrowLeft size={14} />
          <span>Back to Site</span>
        </Link>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full border border-white bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
