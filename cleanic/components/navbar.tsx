"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


export function Navbar() {
  const pathname = usePathname();
  const isLoggedIn = false;
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const publicItems = [
    { href: "/", label: "Beranda" },
    { href: "/article", label: "Artikel" },
    { href: "/game", label: "Game" },
    { href: "/tentang", label: "Tentang" },
  ];

  return (
    <header
      className="fixed inset-x-0 max-w-7xl top-0 z-50 mx-auto border-b lg:rounded-4xl lg:mt-4 border-slate-200/70 bg-white/95 backdrop-blur-md shadow-2xl"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo - Kiri */}
        <Link href="/" className="inline-flex items-center gap-2 shrink-0">
          <Image src="/globe.svg" alt="Cleanic Logo" width={24} height={24} />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Cleanic
          </span>
        </Link>

        {/* Menu - Tengah */}
        <nav className="hidden items-center gap-1 md:flex">
          {publicItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
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
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600 inline-flex items-center gap-2"
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
          className="inline-flex items-center md:hidden rounded-full p-2 border border-slate-200 bg-white"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4 text-slate-600" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md md:hidden z-30">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-0 px-4 py-2 sm:px-6 lg:px-8">
            {publicItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
  isActive
    ? "border-b-cyan-500 text-cyan-600"
    : "border-b-transparent text-slate-600 hover:text-slate-900"
}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-slate-200 mt-2 pt-2">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 text-sm font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 text-sm font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
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
