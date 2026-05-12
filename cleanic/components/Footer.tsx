import Image from "next/image";
import Link from "next/link";
import {
  AtSign,
  BookOpenText,
  House,
  Info,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Beranda", icon: House },
  { href: "/tentang", label: "Tentang", icon: Info },
  { href: "/article", label: "Artikel", icon: BookOpenText },
  { href: "/kontak", label: "Kontak", icon: ShieldCheck },
];

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-linear-to-b from-green-700 to-green-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-cleanic-trans.png"
                alt="Paham Logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl bg-white p-1"
              />
              <h3 className="text-2xl font-bold text-white">Cleanic</h3>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
              Platform belajar berbasis AI untuk bantu kamu scan materi, pahami
              konsep, dan latihan lebih cepat secara interaktif.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-white">Quick Links</h4>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-3 rounded-lg px-2 py-1 text-slate-300 transition hover:text-cyan-200"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-white">Kontak</h4>
            <ul className="mt-5 space-y-4 text-slate-300">
              <li className="flex items-center gap-3">
                <AtSign className="h-5 w-5 text-green-200" />
                <span>cleanic.site</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-200" />
                <span>brucadalm@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-200" />
                <span>+62 822-1098-0898</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-700/70 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year}. Paham. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-400">
            <span className="py-1 pr-20 text-xs sm:text-sm">
              Dibuat dengan ❤️ untuk Pemahaman Anda.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
