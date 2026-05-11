"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi password
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      // Redirect ke dashboard setelah register berhasil
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md">
      <div className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/92 p-5 shadow-[0_30px_100px_rgba(16,185,129,0.16)] backdrop-blur-xl sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-700 via-emerald-500 to-lime-400" />
        <div className="absolute -top-12 right-8 h-28 w-28 rounded-full bg-emerald-100/70 blur-3xl" />

        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="mb-6 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase ring-1 ring-emerald-100">
            <Sparkles className="h-3.5 w-3.5" />
            Cleanic Register
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Buat akun baru
            </h1>
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Lengkapi data untuk mulai menggunakan Cleanic dengan pengalaman
              yang lebih halus.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Masukkan nama lengkap"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="nama@email.com"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3.5 pr-14 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Minimal 6 karakter"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center rounded-xl px-2 text-slate-500 transition hover:text-emerald-700"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Konfirmasi Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3.5 pr-14 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Ulangi password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center rounded-xl px-2 text-slate-500 transition hover:text-emerald-700"
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan konfirmasi password"
                    : "Tampilkan konfirmasi password"
                }
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,128,61,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-[0_24px_50px_rgba(21,128,61,0.28)] disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {loading ? "Memproses..." : "Buat akun"}
          </button>

          <div className="flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-sm text-slate-600">
            <p className="inline-flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-700" />
              Sudah punya akun?
            </p>
            <Link
              href="/login"
              className="font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              Login di sini
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
