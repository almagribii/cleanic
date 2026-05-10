import { type Metadata } from "next";

import { ArticleList } from "./component/ArticleList";
import { articles } from "./data";

export const metadata: Metadata = {
  title: "Artikel Edukasi Lingkungan",
  description:
    "Kumpulan artikel edukasi lingkungan tentang sampah, klasifikasi sampah, dan kebiasaan kecil yang berdampak besar untuk kebersihan kota.",
  openGraph: {
    title: "Artikel Edukasi Lingkungan",
    description:
      "Kumpulan artikel edukasi lingkungan tentang sampah, klasifikasi sampah, dan kebiasaan kecil yang berdampak besar untuk kebersihan kota.",
  },
};

export default function ArticlePage() {
  return <ArticleList articles={articles} />;
}
