import { type Metadata } from "next";
import Nav from "@/components/Nav";
import { PublicFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Cleanic",
    template: "%s | Cleanic",
  },
  description:
    "Platform edukasi dan pelaporan sampah untuk membangun lingkungan yang lebih bersih bersama warga.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
