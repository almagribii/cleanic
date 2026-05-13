"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import Webcam from "react-webcam";
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

export default function ReportContent() {
  const { token } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraMessage, setCameraMessage] = useState<string | null>(null);
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

  async function startCamera() {
    try {
      setError(null);
      setCameraReady(false);
      setCameraMessage("Membuka kamera...");
      setCameraActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuka kamera");
    }
  }

  function stopCamera() {
    setCameraReady(false);
    setCameraMessage(null);
    setCameraActive(false);
  }

  function capturePhoto() {
    try {
      if (!cameraReady) {
        setCameraMessage("Kamera masih menyiapkan. Coba lagi sebentar.");
        return;
      }

      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        setCameraMessage("Gagal ambil gambar dari kamera. Coba ulangi lagi.");
        return;
      }

      // Convert data URL to blob then to File
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `kamera-${Date.now()}.jpg`, {
            type: blob.type || "image/jpeg",
          });
          readFileAsDataUrl(file).then((dataUrl) => {
            setForm((current) => ({ ...current, imageUrl: dataUrl }));
            setSelectedFileName("camera.jpg");
            stopCamera();
          });
        })
        .catch(() => {
          setCameraMessage("Gagal memproses gambar dari kamera.");
        });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal capture foto");
    }
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
          className="space-y-6 rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <div className="flex items-center gap-2">
                <ImagePlus size={16} className="text-emerald-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Foto Sampah
                </span>
              </div>
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-emerald-300 bg-white px-4 py-3 transition hover:bg-emerald-50/30">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-700"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {selectedFileName
                    ? `✓ ${selectedFileName}`
                    : "Pilih file atau ambil foto dari kamera"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {!cameraActive ? (
                    <>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                      >
                        📷 Buka Kamera
                      </button>
                      <button
                        type="button"
                        onClick={() => nativeCameraInputRef.current?.click()}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        📱 Native
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={capturePhoto}
                        disabled={!cameraReady}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        ✓ Capture
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        ✕ Close
                      </button>
                    </>
                  )}
                </div>
                {cameraActive && (
                  <div className="mt-3">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={0.9}
                      videoConstraints={{
                        facingMode: { ideal: "environment" },
                      }}
                      onUserMedia={() => {
                        setCameraReady(true);
                        setCameraMessage(null);
                      }}
                      onUserMediaError={() => {
                        setCameraReady(false);
                        setCameraMessage(
                          typeof window !== "undefined" &&
                            !window.isSecureContext
                            ? "Kamera butuh HTTPS/localhost. Buka via localhost atau gunakan upload file."
                            : "Izin kamera ditolak / tidak tersedia. Gunakan upload file atau buka kamera native.",
                        );
                      }}
                      className="h-80 w-full rounded-2xl bg-black object-cover"
                    />
                    {cameraMessage && (
                      <p className="mt-2 text-xs text-slate-500">
                        {cameraMessage}
                      </p>
                    )}
                  </div>
                )}
                <input
                  ref={nativeCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      readFileAsDataUrl(file).then((dataUrl) => {
                        setForm((current) => ({
                          ...current,
                          imageUrl: dataUrl,
                        }));
                        setSelectedFileName(file.name);
                        stopCamera();
                      });
                    }
                  }}
                />
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                <input
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      imageUrl: event.target.value,
                    }))
                  }
                  placeholder="atau paste URL gambar..."
                  className="w-full bg-transparent text-sm placeholder-slate-400 outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Alamat
                </span>
              </div>
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
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder-slate-400 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
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
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder-slate-400 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
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
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder-slate-400 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-900">
              Deskripsi (opsional)
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={3}
              placeholder="Jelaskan jenis sampah dan kondisi lokasi..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder-slate-400 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-700 hover:shadow-emerald-900/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {loading ? "Mengirim..." : "Kirim Laporan"}
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
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex gap-3 p-3">
                    {report.imageUrl && (
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <img
                          src={report.imageUrl}
                          alt="Report"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {report.address}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {new Date(report.createdAt).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold tracking-[0.16em] uppercase ${report.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}
                        >
                          {report.status}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600">
                          +{report.pointsEarned} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 px-3 py-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-900">
                            {report.upvotes}
                          </span>
                          <span>upvotes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-900">
                            {report.latitude.toFixed(2)}°
                          </span>
                          <span>lat</span>
                        </div>
                      </div>
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
