import { type Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun Cleanic untuk melaporkan sampah, memantau poin, dan melihat leaderboard.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-lime-50 px-4">
      <LoginForm />
    </main>
  );
}
