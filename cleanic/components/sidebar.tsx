"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  CircleUserRound,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  Newspaper,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ComponentType } from "react";

type SidebarItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo<SidebarItem[]>(
    () => [
      { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      { href: "/", label: "Public Home", icon: Home },
      { href: "/articles", label: "Artikel", icon: Newspaper },
      { href: "/tentang", label: "Tentang", icon: CircleUserRound },
    ],
    [],
  );

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
              Cleanic
            </p>
            <p className="text-sm font-semibold text-slate-900">Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Public
            </Link>
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-full border border-slate-200 p-2 text-slate-700"
              aria-label="Toggle sidebar"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white shadow-2xl">
            <div className="mb-4 rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                Welcome back
              </p>
              <p className="mt-1 text-lg font-semibold">{user?.name ?? "User"}</p>
              <p className="text-sm text-slate-300">{user?.email}</p>
            </div>

            <nav className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive(item.href)
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4">
              {loading ? (
                <div className="h-11 animate-pulse rounded-2xl bg-white/10" />
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-800 bg-slate-950 px-5 py-6 text-white lg:flex">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Cleanic
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="mt-2 text-sm text-slate-400">
            Kelola akun dan akses fitur internal dari sini.
          </p>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Logged in as
          </p>
          <p className="mt-1 text-lg font-semibold">{user?.name ?? "User"}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          {loading ? (
            <div className="h-11 animate-pulse rounded-2xl bg-white/10" />
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}