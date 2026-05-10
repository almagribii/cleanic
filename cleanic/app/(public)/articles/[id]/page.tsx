import { ArrowLeft, CalendarDays, Clock3, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Metadata } from "next";
import ReactMarkdown from "react-markdown";

import { getArticleById } from "../data";

interface ArticleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const estimateReadTime = (content: string): string => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} menit baca`;
};

function ErrorComponent({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="bg-background flex min-h-[60vh] flex-col items-center justify-center px-4 py-24">
      <div className="bg-card max-w-lg rounded-2xl border border-slate-200/80 p-8 text-center shadow-lg">
        <h1 className="mb-3 text-4xl font-extrabold text-green-700">{title}</h1>
        <p className="text-muted-foreground mb-6 text-lg">{message}</p>

        <Link href="/articles">
          <span className="inline-flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/25 transition-colors hover:bg-green-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke daftar artikel
          </span>
        </Link>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const articleId = Number(id);

  if (Number.isNaN(articleId)) {
    return {
      title: "Artikel tidak ditemukan",
      description: "Artikel yang diminta tidak tersedia.",
    };
  }

  const article = getArticleById(articleId);

  if (!article) {
    return {
      title: "Artikel tidak ditemukan",
      description: "Artikel yang diminta tidak tersedia.",
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.created_at,
      images: [{ url: article.image_path, alt: article.title }],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { id } = await params;
  const articleId = Number(id);

  if (Number.isNaN(articleId)) {
    return (
      <ErrorComponent
        title="ID artikel tidak valid"
        message="Pastikan URL artikel berisi angka yang benar."
      />
    );
  }

  const article = getArticleById(articleId);

  if (!article) {
    return (
      <ErrorComponent
        title="Artikel tidak ditemukan"
        message={`Artikel dengan ID ${articleId} belum ada.`}
      />
    );
  }

  return (
    <section className="bg-background min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/articles"
            className="inline-flex items-center justify-center rounded-full border border-green-700/20 bg-green-700/10 px-5 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-700/15"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </div>

        <article className="bg-card rounded-3xl border border-slate-200/80 p-6 shadow-2xl md:p-10 lg:p-12">
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-inner">
            <Image
              src={article.image_path || "/images/placeholder.jpg"}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-green-700 shadow-lg backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Edukasi Sampah
            </div>
          </div>

          <header className="mb-8 space-y-5">
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-700/10 px-3 py-1 font-medium text-green-700">
                <CalendarDays className="h-4 w-4" />
                {formatDate(article.created_at)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                <Clock3 className="h-4 w-4" />
                {estimateReadTime(article.content)}
              </span>
            </div>

            <h1 className="text-foreground text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="text-muted-foreground max-w-3xl text-lg">
              {article.description}
            </p>

            <div className="h-px w-full bg-slate-200/80" />
          </header>

          <div className="text-card-foreground">
            <div className="prose prose-lg dark:prose-invert prose-headings:text-foreground prose-a:text-green-700 prose-li:marker:text-green-700 prose-strong:font-bold max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed">{children}</p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-green-700 underline transition-colors hover:text-green-600"
                    >
                      {children}
                    </a>
                  ),
                  h1: ({ children }) => (
                    <h1 className="mt-10 mb-5 text-4xl font-extrabold">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mt-8 mb-4 border-b border-slate-200/80 pb-2 text-3xl font-bold">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-6 mb-3 text-2xl font-semibold">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="mt-5 mb-2 text-xl font-medium">
                      {children}
                    </h4>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 list-disc space-y-2 pl-6">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-4 list-decimal space-y-2 pl-6">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="text-muted-foreground my-4 border-l-4 border-green-700/70 bg-green-700/5 py-2 pl-4 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
