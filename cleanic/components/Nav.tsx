"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LayoutGrid } from "lucide-react";

const Nav = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const toggleNav = () => setNavOpen(!navOpen);

  const navLinks = [
    { name: "Home", href: "/", delay: "800ms" },
    { name: "Artikel", href: "/projects", delay: "900ms" },
    { name: "Tentang", href: "/about", delay: "1000ms" },
    { name: "Game", href: "/contact", delay: "1100ms" },
  ];

  return (
    <nav className="pointer-events-none fixed inset-0 z-50">
      <div className="pointer-events-auto fixed top-0 left-0 z-60 flex w-full items-center justify-between p-8">
        <button
          type="button"
          className={`group pointer-events-auto flex items-center gap-3 rounded-full p-1 pr-6 shadow-lg transition-all duration-300 ${
            navOpen ? "bg-green-800" : "bg-green-700 hover:bg-green-800"
          }`}
          onClick={toggleNav}
        >
          {/* Lingkaran Ikon - Kita buat sedikit lebih gelap agar ada kontras di dalam tombol hijau */}
          <div
            className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
              navOpen ? "bg-green-900" : "bg-green-800"
            }`}
          >
            <div className="relative h-0.5 w-5">
              <span
                className={`absolute block h-full w-full rounded-full bg-white transition-all duration-400 ${
                  navOpen ? "top-0 rotate-[135deg]" : "-top-1.5"
                }`}
              />
              <span
                className={`absolute block h-full w-full rounded-full bg-white transition-all duration-400 ${
                  navOpen ? "bottom-0 rotate-[225deg]" : "top-1.5"
                }`}
              />
            </div>
          </div>

          {/* Teks Menu - Putih Solid */}
          <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
            {navOpen ? "Close" : "Menu"}
          </span>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-white/10 backdrop-blur-sm" />
          ) : isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-green-600"
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="rounded-full border border-green-700 bg-white px-5 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-100"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>

      <div
        className={`pointer-events-auto fixed inset-0 z-50 flex flex-col bg-green-700 p-8 transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          navOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-1 flex-col items-center justify-center">
          <ul className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="group relative overflow-hidden py-2"
              >
                <Link
                  href={link.href}
                  onClick={toggleNav}
                  className={`block font-serif text-6xl text-white transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-8xl ${
                    navOpen ? "translate-y-0" : "translate-y-37.5"
                  }`}
                  style={{ transitionDelay: navOpen ? link.delay : "0s" }}
                >
                  {link.name}
                </Link>
                <div className="pointer-events-none absolute inset-0 translate-y-full bg-green-700" />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full items-end justify-between overflow-hidden pb-8 font-sans text-xs tracking-widest text-white uppercase">
          <div
            className={`hidden transition-all duration-1000 md:block ${
              navOpen ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
            style={{ transitionDelay: navOpen ? "1.2s" : "0s" }}
          >
            Ponorogo, Indonesia
          </div>
          <div className="ml-auto flex gap-8">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className={`transition-all duration-1000 ${
                navOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}
              style={{ transitionDelay: navOpen ? "1.3s" : "0s" }}
            >
              YouTube
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className={`transition-all duration-1000 ${
                navOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}
              style={{ transitionDelay: navOpen ? "1.4s" : "0s" }}
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
