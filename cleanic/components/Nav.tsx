"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LayoutGrid, CircleUserRound } from "lucide-react";
import Image from "next/image";

const Nav = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const toggleNav = () => setNavOpen(!navOpen);

  const navLinks = [
    { name: "Beranda", href: "/", delay: "800ms" },
    { name: "Artikel", href: "/articles", delay: "900ms" },
    { name: "Tentang", href: "/tentang", delay: "1000ms" },
  ];

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  // no active page marker as requested

  return (
    <nav className="pointer-events-none fixed inset-0 z-50">
      <div className="pointer-events-auto fixed top-0 left-0 z-60 flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className={`group pointer-events-auto flex items-center gap-3 rounded-full border px-2 py-2 pr-5 shadow-lg transition-all duration-300 ${
            navOpen
              ? "border-emerald-800 bg-emerald-900 text-white"
              : "border-emerald-200 bg-white/85 text-emerald-900 hover:bg-white"
          }`}
          onClick={toggleNav}
          aria-expanded={navOpen}
          aria-label={navOpen ? "Close menu" : "Open menu"}
        >
          <div
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
              navOpen ? "bg-emerald-800" : "bg-emerald-700"
            }`}
          >
            <div className="relative h-0.5 w-5">
              <span
                className={`absolute block h-full w-full rounded-full bg-white transition-all duration-300 ${
                  navOpen ? "top-0 rotate-135" : "-top-1.5"
                }`}
              />
              <span
                className={`absolute block h-full w-full rounded-full bg-white transition-all duration-300 ${
                  navOpen ? "bottom-0 rotate-225" : "top-1.5"
                }`}
              />
            </div>
          </div>

          <span
            className={`text-xs font-semibold tracking-[0.22em] uppercase ${
              navOpen ? "text-white" : "text-emerald-900"
            }`}
          >
            {navOpen ? "Close" : "Menu"}
          </span>
        </button>
        <div className="hidden items-center md:flex">
          {loading ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-white/60 backdrop-blur-sm" />
          ) : isAuthenticated ? (
            <Link
              href="/dashboard"
              className="group pointer-events-auto flex items-center gap-3 rounded-full border border-emerald-800 bg-emerald-900 px-2 py-2 pr-5 text-white shadow-lg transition-all duration-300 hover:bg-emerald-950"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800 transition-all duration-300">
                <LayoutGrid className="h-5 w-5 text-white" />
              </div>

              <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                Dashboard
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="group pointer-events-auto flex items-center gap-3 rounded-full border border-emerald-200 bg-white/85 px-2 py-2 pr-5 text-emerald-900 shadow-lg transition-all duration-300 hover:bg-white"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 transition-all duration-300 group-hover:bg-emerald-800">
                <CircleUserRound className="h-5 w-5 text-white" />
              </div>

              <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>

      <div
        className={`pointer-events-auto fixed inset-0 z-50 flex flex-col overflow-hidden p-6 transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-8 ${
          navOpen ? "translate-y-0" : "pointer-events-none -translate-y-full"
        }`}
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/bg-nav.jpeg"
            alt="Navigation background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-emerald-950/70" />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center">
          <ul className="space-y-3 text-center sm:space-y-4">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="group relative overflow-hidden py-1"
              >
                <Link
                  href={link.href}
                  onClick={toggleNav}
                  className={`inline-flex items-center justify-center font-serif text-5xl leading-tight text-white transition-all duration-1500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-6xl md:text-7xl ${
                    navOpen ? "translate-y-0" : "translate-y-40"
                  }`}
                  style={{ transitionDelay: navOpen ? link.delay : "0s" }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 flex w-full flex-col gap-4 overflow-hidden border-t border-white/15 px-6 pt-5 pb-6 text-xs tracking-[0.2em] text-emerald-100 uppercase sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-8">
          <div
            className={`transition-all duration-1000 ${
              navOpen ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
            style={{ transitionDelay: navOpen ? "1.2s" : "0s" }}
          >
            Crafted in Indonesia
          </div>

          <div className="ml-auto flex gap-6">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className={`transition-all duration-1000 hover:text-white ${
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
              className={`transition-all duration-1000 hover:text-white ${
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
