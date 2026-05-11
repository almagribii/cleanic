import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/transition";
import { AuthProvider } from "@/hooks/useAuth";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cleanic",
  description:
    "Cleanic adalah platform digital yang memudahkan warga untuk melaporkan dan memilah sampah liar secara cerdas, sehingga dapat ditukar dengan poin yang bermanfaat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
