"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const publicItems = [
    { href: "/", label: "Beranda" },
    { href: "/articles", label: "Artikel" },
    { href: "/tentang", label: "Tentang" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto max-w-7xl border-b border-slate-200/70 bg-white/95 shadow-2xl backdrop-blur-md lg:mt-4 lg:rounded-4xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo - Kiri */}
        <Link href="/" className="inline-flex shrink-0 items-center gap-2">
          <Image src="/globe.svg" alt="Cleanic Logo" width={24} height={24} />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Cleanic
          </span>
        </Link>

        {/* Menu - Tengah */}
        <nav className="hidden items-center gap-1 md:flex">
          {publicItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-b-green-700 text-green-700"
                    : "border-b-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons - Kanan */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-8 w-32 animate-pulse rounded-full bg-gray-200"></div>
          ) : isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-green-700 bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white p-2 md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4 text-slate-600" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-0 px-4 py-2 sm:px-6 lg:px-8">
            {publicItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-b-cyan-500 text-cyan-600"
                      : "border-b-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-slate-200 pt-2">
              {loading ? (
                <div className="m-2 h-10 animate-pulse rounded-lg bg-gray-200"></div>
              ) : isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-green-600 transition hover:bg-green-50"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-cyan-600 transition hover:bg-cyan-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-cyan-600 transition hover:bg-cyan-50"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
