import { type Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar",
  description:
    "Buat akun Cleanic untuk mulai melaporkan sampah liar dan mengumpulkan poin dari kontribusimu.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-lime-50 px-4">
      <RegisterForm />
    </main>
  );
}
