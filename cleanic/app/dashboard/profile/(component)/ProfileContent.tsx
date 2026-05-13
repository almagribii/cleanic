"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import {
  AlertCircle,
  BadgeCheck,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  User,
  Lock,
  Calendar,
  Trophy,
} from "lucide-react";
import Image from "next/image";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  points: number;
  createdAt: string;
};

export default function ProfileContent() {
  const { token, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const response = await apiRequest<{ data: UserProfile }>(
          "/users/profile",
          { method: "GET", token },
        );
        setUserData(response.data);
        setForm((current) => ({
          ...current,
          name: response.data.name || "",
          email: response.data.email || "",
          image: response.data.image || "",
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadProfile();
    }
  }, [token]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setForm((current) => ({ ...current, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses foto");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validations
    if (!form.name.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }

    if (!form.email.trim()) {
      setError("Email tidak boleh kosong");
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (form.newPassword && form.newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = await apiRequest<{ data: UserProfile }>(
        "/users/profile",
        {
          method: "PUT",
          token,
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            image: form.image,
            currentPassword: form.newPassword
              ? form.currentPassword
              : undefined,
            newPassword: form.newPassword || undefined,
          }),
        },
      );

      setUserData(payload.data);
      setForm((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Update auth context
      if (setUser) {
        setUser(payload.data);
      }

      setSuccess("Profil berhasil diperbarui");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const joinDate = user
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-emerald-100/70 bg-white/90 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold tracking-[0.18em] text-emerald-700 uppercase">
          <User size={14} /> Profil Saya
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          {user?.name || "Pengguna"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
          Kelola informasi pribadi dan preferensi akun kamu di sini.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Profile Card & Stats */}
        <div className="space-y-6 lg:col-span-1">
          {/* Profile Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="relative h-32 bg-emerald-500" />

            <div className="relative -mt-16 px-6 pb-6">
              {/* Photo Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative mb-4 h-32 w-32 cursor-pointer overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-lg transition hover:shadow-xl"
              >
                {form.image && (
                  <Image
                    src={form.image}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/40">
                  <Camera
                    size={28}
                    className="text-white opacity-0 transition group-hover:opacity-100"
                  />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-emerald-600" />
                <span className="text-sm text-slate-600">Total Points</span>
              </div>
              <span className="text-2xl font-black text-emerald-600">
                {user?.points}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-slate-400" />
                  <span className="text-sm text-slate-600">Bergabung</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-8 lg:col-span-2"
        >
          {/* Section: Informasi Dasar */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold tracking-[0.15em] text-emerald-700 uppercase">
              <Mail size={12} /> Informasi Dasar
            </div>

            {/* Name */}
            <label className="mb-4 block space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <User size={14} className="text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Nama Lengkap
                </span>
              </div>
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Masukkan nama lengkap Anda"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-300 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>

            {/* Email */}
            <label className="block space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <Mail size={14} className="text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Alamat Email
                </span>
              </div>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-300 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
          </div>

          {/* Password Change Section */}
          <div className="border-t border-slate-100 pt-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-xs font-bold tracking-[0.15em] text-amber-700 uppercase">
              <Lock size={12} /> Keamanan
            </div>
            <p className="mb-5 text-xs text-slate-500">
              Kosongkan jika tidak ingin mengubah password
            </p>

            {/* Current Password */}
            <label className="mb-4 block space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <Lock size={14} className="text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Password Saat Ini
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-300 transition outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {/* New Password */}
            <label className="mb-4 block space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <Lock size={14} className="text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Password Baru
                </span>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-300 transition outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {/* Confirm Password */}
            <label className="block space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <Lock size={14} className="text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Konfirmasi Password Baru
                </span>
              </div>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-300 transition outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </label>
          </div>

          {/* Messages */}
          <div className="space-y-3 border-t border-slate-100 pt-6">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border border-rose-200/60 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 backdrop-blur-sm duration-300">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 backdrop-blur-sm duration-300">
                <BadgeCheck size={18} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
