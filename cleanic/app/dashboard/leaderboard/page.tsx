"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import {
  Award,
  BadgeCheck,
  Crown,
  Flame,
  Loader2,
  Medal,
  Sparkles,
  Trophy,
  Users2,
} from "lucide-react";

type LeaderboardRow = {
  id: string;
  name: string;
  image?: string | null;
  points: number;
  reportCount: number;
  scanCount: number;
  rank: number;
  createdAt: string;
};

type LeaderboardResponse = {
  leaderboard: LeaderboardRow[];
  currentUser: LeaderboardRow | null;
  stats: {
    totalUsers: number;
    totalPoints: number;
    totalReports: number;
  };
};

const accentClasses = [
  "from-emerald-500 to-lime-400",
  "from-green-500 to-emerald-400",
  "from-lime-500 to-emerald-400",
  "from-teal-500 to-emerald-400",
  "from-emerald-500 to-teal-400",
  "from-sky-500 to-emerald-400",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "U")
    .join("");
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildEntries(rows: LeaderboardRow[]) {
  return rows.map((entry) => ({
    ...entry,
    avatar: getInitials(entry.name),
    accent: accentClasses[(entry.rank - 1) % accentClasses.length],
  }));
}

export default function LeaderboardPage() {
  const { token, user } = useAuth();
  const [period] = useState<"week" | "month" | "all-time">("month");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        const payload = await apiRequest<{ data: LeaderboardResponse }>(
          "/leaderboard",
          {
            method: "GET",
            token,
          },
        );

        if (!ignore) {
          setData(payload.data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat leaderboard",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (token) {
      loadLeaderboard();
    }

    return () => {
      ignore = true;
    };
  }, [token]);

  const leaderboard = useMemo(
    () => buildEntries(data?.leaderboard ?? []),
    [data],
  );
  const currentUser = data?.currentUser
    ? {
        ...data.currentUser,
        avatar: getInitials(data.currentUser.name),
        accent: "from-slate-900 to-emerald-500",
      }
    : null;
  const topThree = leaderboard.slice(0, 3);
  const isTopThree = currentUser ? currentUser.rank <= 3 : false;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-130 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(250,250,250,0.78))]" />

      <div className="relative space-y-8 pb-8">
        <section className="overflow-hidden rounded-4xl border border-emerald-100/70 bg-white/80 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold tracking-[0.18em] text-emerald-700 uppercase">
                <Trophy size={14} /> Cleanic Leaderboard
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                  Track the people turning reports into impact.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                  Leaderboard ini diambil langsung dari backend berdasarkan poin
                  yang dikumpulkan dari laporan sampah dan aktivitas lain di
                  akun Cleanic.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: "week", label: "Week" },
                  { key: "month", label: "Month" },
                  { key: "all-time", label: "All Time" },
                ].map((option) => (
                  <span
                    key={option.key}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold ${option.key === period ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}
                  >
                    {option.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-107.5 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-[11px] font-bold tracking-[0.16em] text-emerald-700 uppercase">
                  Your rank
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-black text-slate-950">
                      #{currentUser?.rank ?? "-"}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {user?.name ?? "Sign in to see your position"}
                    </p>
                  </div>
                  <Crown className="text-emerald-600" size={28} />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                  Your points
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-black text-slate-950">
                      {currentUser?.points?.toLocaleString() ?? "0"}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Points from reports and scans
                    </p>
                  </div>
                  <Sparkles className="text-amber-500" size={28} />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                  Board size
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-black text-slate-950">
                      {data?.stats.totalUsers ?? 0}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Active members in backend
                    </p>
                  </div>
                  <Users2 className="text-slate-700" size={28} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            {loading ? (
              <div className="flex min-h-90 items-center justify-center rounded-4xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 text-slate-500">
                  <Loader2 className="animate-spin" size={18} /> Loading
                  leaderboard...
                </div>
              </div>
            ) : error ? (
              <div className="rounded-4xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                {error}
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  {topThree.map((entry, index) => {
                    const podiumStyles = [
                      "md:order-2 md:translate-y-0",
                      "md:order-1 md:translate-y-8",
                      "md:order-3 md:translate-y-12",
                    ];

                    return (
                      <article
                        key={entry.id}
                        className={`relative overflow-hidden rounded-4xl border border-white/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${podiumStyles[index]}`}
                      >
                        <div
                          className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${entry.accent}`}
                        />
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                              {index === 0 ? (
                                <Crown size={16} className="text-amber-500" />
                              ) : (
                                <Medal
                                  size={16}
                                  className={
                                    index === 1
                                      ? "text-slate-400"
                                      : "text-amber-700"
                                  }
                                />
                              )}
                              Rank {entry.rank}
                            </div>
                            <h2 className="mt-3 text-xl font-black text-slate-950">
                              {entry.name}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              {entry.scanCount} scans
                            </p>
                          </div>
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${entry.accent} text-sm font-black text-white shadow-lg`}
                          >
                            {entry.avatar}
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                              Points
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-950">
                              {entry.points.toLocaleString()}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                              Reports
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-950">
                              {entry.reportCount}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                            <BadgeCheck size={12} /> Backend sourced
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Flame size={12} className="text-orange-500" />{" "}
                            {entry.scanCount} scan activity
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="flex flex-col gap-3 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs font-bold tracking-[0.18em] text-emerald-700 uppercase">
                        Full ranking
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-slate-950">
                        Current board
                      </h2>
                    </div>
                    <p className="max-w-md text-sm text-slate-500">
                      {data?.stats.totalReports ?? 0} reports have been
                      converted into points across the board.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {leaderboard.map((entry) => {
                      const isCurrent = entry.id === currentUser?.id;
                      return (
                        <div
                          key={entry.id}
                          className={`flex flex-col gap-4 px-6 py-4 transition ${isCurrent ? "bg-emerald-50/70" : "hover:bg-slate-50/80"}`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${entry.accent} text-sm font-black text-white shadow-md`}
                            >
                              {entry.avatar}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-black text-slate-950">
                                  {entry.rank}. {entry.name}
                                </p>
                                {isCurrent && (
                                  <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="truncate text-xs text-slate-500">
                                {entry.scanCount} scans ·{" "}
                                {formatDate(entry.createdAt)}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-black text-slate-950">
                                {entry.points.toLocaleString()} pts
                              </p>
                              <p className="text-xs text-emerald-600">
                                {entry.reportCount} reports
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-xs text-slate-500 sm:grid-cols-4">
                            <div>
                              <p className="font-bold text-slate-900">
                                {entry.scanCount}
                              </p>
                              <p>Scans</p>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {entry.reportCount}
                              </p>
                              <p>Reports</p>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {entry.points.toLocaleString()}
                              </p>
                              <p>Points</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 text-emerald-700 sm:justify-start">
                              <Award size={14} />
                              <span className="font-semibold">
                                Live backend score
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Trophy className="text-emerald-600" size={18} /> Ranking logic
              </div>
              <div className="mt-5 space-y-4 text-sm text-slate-500">
                <p>
                  Leaderboard ini dibaca langsung dari backend, lalu diurutkan
                  berdasarkan poin total user yang berasal dari laporan sampah
                  dan aktivitas lainnya.
                </p>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                    How it works
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>• Reports add points to your account</li>
                    <li>• Scan points stay included in the total</li>
                    <li>• Current user is highlighted automatically</li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className={`rounded-4xl border p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${isTopThree ? "border-emerald-100 bg-emerald-50/70" : "border-slate-200 bg-white"}`}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Flame
                  className={
                    isTopThree ? "text-emerald-600" : "text-orange-500"
                  }
                  size={18}
                />{" "}
                Weekly mission
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                {isTopThree
                  ? "You are in the podium zone. Keep submitting reports to defend your position and widen the gap."
                  : "Submit more verified reports to climb toward the podium and grow your sustainability score."}
              </p>
              <div className="mt-5 rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200 ring-inset">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Progress to next milestone</span>
                  <span>
                    {currentUser?.points
                      ? `${Math.min(100, Math.round((currentUser.points / 6000) * 100))}%`
                      : "0%"}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-linear-to-r from-emerald-500 to-lime-400"
                    style={{
                      width: currentUser?.points
                        ? `${Math.min(100, Math.max(8, Math.round((currentUser.points / 6000) * 100)))}%`
                        : "8%",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <BadgeCheck className="text-emerald-600" size={18} /> Current
                profile
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-slate-900 to-emerald-500 text-lg font-black text-white shadow-lg">
                  {getInitials(currentUser?.name ?? "You")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-black text-slate-950">
                    {currentUser?.name ?? "Your profile"}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {user?.email ??
                      "Connect your account to see the full board"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                    Rank
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950">
                    #{currentUser?.rank ?? "-"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                    Reports
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950">
                    {currentUser?.reportCount ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
