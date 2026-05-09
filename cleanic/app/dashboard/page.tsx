"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function DashboardPage() {
  const { user, token } = useAuth();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-700">
          Dashboard
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {user?.name ?? "User"} 👋
            </h1>
            <p className="mt-2 text-slate-600">{user?.email}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Back to Public
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Points
          </h3>
          <p className="mt-3 text-4xl font-bold text-emerald-600">
            {user?.points || 0}
          </p>
          <p className="mt-2 text-sm text-slate-500">Total points earned</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Account Status
          </h3>
          <p className="mt-3 text-3xl font-bold text-blue-600">Active</p>
          <p className="mt-2 text-sm text-slate-500">Account ready to use</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Member Since
          </h3>
          <p className="mt-3 text-3xl font-bold text-violet-600">
            {user?.id ? `${new Date().getFullYear()}` : "N/A"}
          </p>
          <p className="mt-2 text-sm text-slate-500">Your joining year</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <h2 className="text-xl font-bold text-slate-900">API Token</h2>
          <p className="mt-2 text-sm text-slate-500">
            Token ini dipakai untuk request ke backend selama sesi aktif.
          </p>
          <div className="mt-4 max-h-32 overflow-y-auto rounded-2xl bg-slate-100 p-4 font-mono text-sm break-all text-slate-700">
            {token}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/articles"
              className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              Buka Artikel
            </Link>
            <Link
              href="/tentang"
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              Lihat Tentang
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900">Status Akun</h2>
        <p className="mt-2 text-sm text-slate-500">
          Dashboard ini sudah dipisah dari navbar public, jadi tampilan lebih
          fokus dan tidak ramai.
        </p>
      </section>
    </div>
  );
}
