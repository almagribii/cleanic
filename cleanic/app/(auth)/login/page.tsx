"use client";

import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-lime-50 px-4">
      <LoginForm />
    </main>
  );
}
