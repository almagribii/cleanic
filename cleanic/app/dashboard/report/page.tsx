"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import {
  AlertCircle,
  BadgeCheck,
  FileText,
  ImagePlus,
  Loader2,
  MapPin,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";

type ReportItem = {
  id: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  description?: string | null;
  status: "ACTIVE" | "CLEANED";
  upvotes: number;
  createdAt: string;
  pointsEarned: number;
};

type ReportsResponse = {
  reports: ReportItem[];
};

const initialForm = {
  imageUrl: "",
  address: "",
  description: "",
  latitude: "",
  longitude: "",
};

export default function ReportPage() {
  const { token } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function readFileAsDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(typeof reader.result === "string" ? reader.result : "");
      };

      reader.onerror = () => {
        reject(new Error("Gagal membaca file gambar"));
      };

      reader.readAsDataURL(file);
    });
  }

  useEffect(() => {
    let ignore = false;

    async function loadReports() {
      try {
        setPageLoading(true);
        const payload = await apiRequest<{ data: ReportsResponse }>(
          "/reports/me",
          {
            method: "GET",
            token,
          },
        );

        if (!ignore) {
          setReports(payload.data.reports);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat laporan",
          );
        }
      } finally {
        if (!ignore) {
          setPageLoading(false);
        }
      }
    }

    if (token) {
      loadReports();
    }

    return () => {
      ignore = true;
    };
  }, [token]);

  const summary = useMemo(() => {
    const totalReports = reports.length;
    const totalPoints = reports.reduce(
      (sum, report) => sum + report.pointsEarned,
      0,
    );
    const activeReports = reports.filter(
      (report) => report.status === "ACTIVE",
    ).length;

    return { totalReports, totalPoints, activeReports };
  }, [reports]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFileName(null);
      return;
    }

    try {
      setError(null);
      const dataUrl = await readFileAsDataUrl(file);
      setForm((current) => ({ ...current, imageUrl: dataUrl }));
      setSelectedFileName(file.name);
    } catch (fileError) {
      setSelectedFileName(null);
      setError(
        fileError instanceof Error ? fileError.message : "Gagal memproses file",
      );
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const latitude = Number.parseFloat(form.latitude);
      const longitude = Number.parseFloat(form.longitude);

      const payload = await apiRequest<{
        data: { report: ReportItem; pointsEarned: number };
      }>("/reports", {
        method: "POST",
        token,
        body: JSON.stringify({
          imageUrl: form.imageUrl,
          address: form.address,
          description: form.description || undefined,
          latitude,
          longitude,
        }),
      });

      setReports((current) => [payload.data.report, ...current].slice(0, 10));
      setSuccess(
        `Laporan berhasil dikirim. Kamu mendapatkan ${payload.data.pointsEarned} poin.`,
      );
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal mengirim laporan",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="rounded-4xl border border-emerald-100/70 bg-white/90 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold tracking-[0.18em] text-emerald-700 uppercase">
            <FileText size={14} /> Laporan Sampah
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Report waste, earn points, and move the board.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
            Kirim laporan sampah ke backend, lalu poin akan otomatis masuk ke
            akunmu dan ikut memengaruhi leaderboard.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                Total reports
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {summary.totalReports}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                Points earned
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {summary.totalPoints}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                Active cases
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {summary.activeReports}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Upload image
              </span>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <ImagePlus size={18} className="text-emerald-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2d4327]"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {selectedFileName
                    ? `Selected file: ${selectedFileName}`
                    : "Pilih file gambar dari perangkat, nanti otomatis dikirim ke backend."}
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                  URL optional
                </span>
                <input
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      imageUrl: event.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Address
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <MapPin size={18} className="text-emerald-600" />
                <input
                  required
                  value={form.address}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      address: event.target.value,
                    }))
                  }
                  placeholder="Lokasi sampah ditemukan"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Latitude
              </span>
              <input
                required
                value={form.latitude}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    latitude: event.target.value,
                  }))
                }
                placeholder="-6.200000"
                inputMode="decimal"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition outline-none focus:border-emerald-500"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Longitude
              </span>
              <input
                required
                value={form.longitude}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    longitude: event.target.value,
                  }))
                }
                placeholder="106.816666"
                inputMode="decimal"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition outline-none focus:border-emerald-500"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={4}
              placeholder="Jelaskan jenis sampah dan kondisi lokasi"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition outline-none focus:border-emerald-500"
            />
          </label>

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <BadgeCheck size={18} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-green-700 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#2d4327] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            Submit report
          </button>
        </form>
      </section>

      <aside className="space-y-6">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
            <Sparkles className="text-emerald-600" size={18} /> How points work
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Setiap laporan yang dikirim melalui backend akan menambah poin ke
            user login saat ini. Poin itu otomatis muncul di leaderboard.
          </p>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Reward</p>
            <p className="mt-2">50 poin per report submitted</p>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
            <Trash2 className="text-emerald-600" size={18} /> Recent reports
          </div>

          <div className="mt-5 space-y-4">
            {pageLoading ? (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={16} /> Loading
                reports...
              </div>
            ) : reports.length === 0 ? (
              <p className="text-sm text-slate-500">
                Belum ada laporan yang dikirim.
              </p>
            ) : (
              reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {report.address}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(report.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] uppercase ${report.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-500">
                    <div>
                      <p className="font-bold text-slate-900">
                        {report.pointsEarned}
                      </p>
                      <p>Points</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {report.upvotes}
                      </p>
                      <p>Upvotes</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {report.latitude.toFixed(3)}
                      </p>
                      <p>Lat</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
