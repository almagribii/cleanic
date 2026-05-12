"use client";

import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import {
  LayoutGrid,
  ScanLine,
  Map,
  Trophy,
  FileText,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Camera,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";

type SidebarProps = {
  onCollapseChange?: (collapsed: boolean) => void;
};

export function DashboardSidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, setUser, token } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const displayImage = useMemo(() => {
    return user?.image && user.image.length > 10 ? user.image : null;
  }, [user?.image]);
  const [imageError, setImageError] = useState(false);

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cleanic.sidebar.collapsed") === "1";
    }
    return true;
  });

  useEffect(() => {
    if (onCollapseChange) onCollapseChange(collapsed);
  }, [onCollapseChange, collapsed]);

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("cleanic.sidebar.collapsed", next ? "1" : "0");
      return next;
    });
  };

  const handleProfilePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    try {
      setUploadError(null);
      setUploading(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        try {
          const response = await apiRequest<{
            data: { image?: string | null };
          }>("/users/profile", {
            method: "PUT",
            token,
            body: JSON.stringify({ image: dataUrl }),
          });
          // Update user in context - will also save to localStorage via setUser wrapper
          if (setUser && user) {
            setUser({ ...user, image: response.data.image });
            setImageError(false);
          }
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : "Upload gagal");
        } finally {
          setUploading(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Gagal memproses foto",
      );
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const items = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      { href: "/dashboard/scanner", label: "AI Scanner", icon: ScanLine },
      { href: "/dashboard/report", label: "Laporan Sampah", icon: FileText },
      { href: "/dashboard/chatbot", label: "AI Chatbot", icon: Map },
      { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
      { href: "/dashboard/profile", label: "Profile", icon: User },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
    [],
  );

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-60 flex h-16 items-center justify-between bg-white/90 px-4 shadow-2xl backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden">
            <Image
              src="/logo-cleanic-trans.png"
              alt="Logo"
              fill
              className="object-contain p-1.5"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm leading-none font-bold text-slate-900">
              Cleanic
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" className="p-2 text-slate-500">
            <ArrowLeft size={20} />
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1a3c2a] transition-transform active:scale-90"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="animate-in slide-in-from-left absolute inset-y-0 left-0 w-70 bg-[#1a3c2a] p-6 text-white shadow-2xl duration-500">
            <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
              <span className="text-xl font-bold italic">Cleanic</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-4 transition-all ${isActive(item.href) ? "bg-white/20 text-white shadow-lg" : "text-emerald-100/60"}`}
                >
                  <item.icon size={22} />
                  <span className="text-base font-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="absolute right-6 bottom-10 left-6">
              <button
                onClick={() => logout()}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 py-4 font-bold text-rose-400"
              >
                <LogOut size={20} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 hidden flex-col bg-green-900 text-white transition-all duration-300 ease-in-out lg:flex ${collapsed ? "w-20" : "w-64"} rounded-r-[40px] shadow-2xl`}
      >
        <button
          onClick={toggleCollapsed}
          className="absolute top-1/2 -right-3 z-50 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-400 text-[#1a3c2a] shadow-md transition-all hover:bg-yellow-400 active:scale-90"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div
          className={`flex flex-col items-center py-12 transition-all ${collapsed ? "px-2" : "px-6"}`}
        >
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`group relative rounded-full border-2 border-emerald-500/30 bg-emerald-900/20 p-1 transition-all duration-500 ${collapsed ? "h-11 w-11 cursor-pointer hover:border-emerald-400" : "h-24 w-24 cursor-pointer hover:border-yellow-400"}`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-yellow-200">
              {displayImage && !imageError ? (
                <Image
                  key={`user-avatar-${displayImage}`}
                  src={displayImage}
                  alt="User"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-500">
                  <User size={collapsed ? 20 : 40} className="text-white/70" />
                </div>
              )}
            </div>
            {!uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition group-hover:bg-black/40">
                <Camera
                  size={collapsed ? 16 : 24}
                  className="text-white opacity-0 transition group-hover:opacity-100"
                />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2
                  size={collapsed ? 16 : 24}
                  className="animate-spin text-white"
                />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePhotoUpload}
            disabled={uploading}
          />

          {!collapsed && (
            <div className="animate-in fade-in slide-in-from-top-2 mt-4 text-center duration-300">
              <h3 className="max-w-45 truncate text-base font-bold">
                {user?.name ?? "Wafira Manal"}
              </h3>
              <p className="max-w-45 truncate text-[11px] text-emerald-300/60">
                {user?.email ?? "user@gmail.com"}
              </p>
              {uploadError && !collapsed && (
                <p className="mt-1 max-w-45 truncate text-[10px] text-rose-300">
                  {uploadError}
                </p>
              )}
            </div>
          )}
        </div>

        <nav className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-2xl py-3.5 transition-all duration-200 ${collapsed ? "justify-center" : "gap-4 px-4"} ${isActive(item.href) ? "bg-white/15 text-white shadow-inner" : "text-emerald-100/50 hover:bg-white/5 hover:text-white"}`}
            >
              <item.icon size={collapsed ? 24 : 20} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-6">
          <button
            onClick={() => logout()}
            className={`flex items-center text-red-400 transition-colors hover:text-rose-300 ${collapsed ? "justify-center" : "gap-4"}`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-bold">Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
