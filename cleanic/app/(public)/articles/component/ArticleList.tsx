"use client";

import { CalendarDays, ChevronRight, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { ArticleItem } from "../data";

interface ArticleListProps {
  articles: ArticleItem[];
}

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getPreview = (content: string): string => {
  const cleaned = content
    .replace(/#+\s?/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\n+/g, " ")
    .trim();

  return cleaned.length > 160 ? `${cleaned.slice(0, 160)}...` : cleaned;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  return (
    <section className="bg-background min-h-screen py-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-green-700/10 px-4 py-2 text-sm font-medium text-green-700"
          >
            <Sparkles className="h-4 w-4" />
            Edukasi lingkungan dari Cleanic
          </motion.div>

          <h1 className="text-foreground text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
            Artikel edukasi lingkungan tentang sampah dan klasifikasinya
          </h1>

          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            Pelajari cara memilah sampah organik, anorganik, B3, dan residu
            dengan langkah praktis yang bisa langsung diterapkan di rumah maupun
            sekolah.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {articles.length > 0 ? (
            articles.map((article) => (
              <motion.div
                key={article.id}
                className="group bg-card flex transform flex-col overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:border-green-700/40 hover:shadow-xl"
                variants={itemVariants}
              >
                <Link
                  href={`/articles/${article.id}`}
                  className="flex h-full flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={article.image_path || "/images/placeholder.jpg"}
                      alt={article.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="opacity-90 transition duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 p-4">
                      <span className="text-primary-foreground inline-flex items-center gap-1 rounded-full bg-green-700/95 px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm transition duration-300 group-hover:bg-green-600">
                        <Sparkles className="h-4 w-4" />
                        Edukasi Sampah
                      </span>
                    </div>
                  </div>

                  <div className="flex grow flex-col p-6 md:p-7">
                    <div className="text-muted-foreground mb-3 flex items-center text-sm font-medium">
                      <CalendarDays className="mr-1 h-4 w-4 text-green-700" />
                      {formatDate(article.created_at)}
                    </div>

                    <h2 className="text-card-foreground mb-3 line-clamp-2 overflow-hidden text-2xl leading-snug font-semibold text-ellipsis transition duration-300 group-hover:text-green-700">
                      {article.title}
                    </h2>

                    <p className="text-muted-foreground mb-5 line-clamp-3 grow overflow-hidden text-base text-ellipsis">
                      {article.description}
                      <span className="text-muted-foreground/80 mt-3 block text-sm">
                        {getPreview(article.content)}
                      </span>
                    </p>

                    <div className="mt-auto border-t border-slate-200/80 pt-4">
                      <span className="flex items-center font-medium text-green-700 transition duration-300 hover:text-green-600">
                        Baca selengkapnya
                        <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-muted-foreground col-span-full py-10 text-center text-lg">
              Tidak ada artikel yang tersedia saat ini.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
