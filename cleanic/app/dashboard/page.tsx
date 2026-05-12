"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  ScanLine,
  History,
  MapPin,
  TrendingUp,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data untuk grafik
const data = [
  { name: "Mon", value: 20 },
  { name: "Tue", value: 25 },
  { name: "Wed", value: 35 },
  { name: "Thu", value: 15 },
  { name: "Fri", value: 22 },
  { name: "Sat", value: 30 },
  { name: "Sun", value: 45 },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="animate-in fade-in mx-auto max-w-7xl space-y-10 duration-700">
      {/* Header Section */}
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Hi, {user?.name ?? "Wafira"}!
        </h1>
        <p className="mt-1 font-medium text-slate-400">
          Lets make a positive impact today.
        </p>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Scans",
            value: "128",
            trend: "+11.01%",
            color: "bg-emerald-50",
          },
          {
            label: "Points",
            value: "2,318",
            trend: "+6.08%",
            color: "bg-emerald-50",
          },
          {
            label: "Rank",
            value: "15",
            trend: "+15.03%",
            color: "bg-emerald-50",
          },
          {
            label: "Active Users",
            value: "2,318",
            trend: "+6.08%",
            color: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`${stat.color} flex flex-col justify-between rounded-3xl p-5`}
          >
            <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <h3 className="text-2xl leading-none font-bold text-slate-900">
                {stat.value}
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <span>{stat.trend}</span>
                <TrendingUp size={10} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions Section */}
      <section className="rounded-4xl border border-slate-50 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/scanner"
            className="flex items-center justify-center gap-3 rounded-2xl bg-green-700 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#2d4327]"
          >
            <ScanLine size={18} />
            Start Scanning
          </Link>
          <Link
            href="/dashboard/report"
            className="flex items-center justify-center gap-3 rounded-2xl bg-green-700 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#2d4327]"
          >
            <FileText size={18} />
            Laporan Sampah
          </Link>
          <Link
            href="/dashboard/history"
            className="flex items-center justify-center gap-3 rounded-2xl bg-[#f0f2f0] py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            <History size={18} />
            History Scan
          </Link>
          <Link
            href="/dashboard/maps"
            className="flex items-center justify-center gap-3 rounded-2xl bg-[#f0f2f0] py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            <MapPin size={18} />
            Open Maps
          </Link>
        </div>
      </section>

      {/* Bottom Grid: Recent Activity & Impact */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-4xl border border-slate-50 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-bold text-slate-900">
            Recent Activity
          </h2>
          <div className="space-y-6">
            {[
              {
                name: "Plastic Bottle",
                time: "2 hours ago",
                points: "+10 pts",
                icon: "🍾",
              },
              {
                name: "Snack Wrapper",
                time: "8 hours ago",
                points: "+10 pts",
                icon: "🍿",
              },
              {
                name: "Plastic Bag",
                time: "2 days ago",
                points: "+10 pts",
                icon: "🛍️",
              },
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-2xl shadow-sm">
                    {act.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {act.name}
                    </h4>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={10} /> Scanned • {act.time}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  {act.points}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full rounded-2xl border border-slate-100 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50">
            View All Activity
          </button>
        </div>

        {/* Your Impact (Chart) */}
        <div className="rounded-4xl border border-slate-50 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Impact</h2>
            <select className="border-none bg-transparent text-[10px] font-bold text-slate-400 focus:ring-0">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
