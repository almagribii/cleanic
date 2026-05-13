import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Autentikasi",
    template: "%s | Cleanic",
  },
  description: "Halaman autentikasi Cleanic untuk masuk dan membuat akun baru.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
