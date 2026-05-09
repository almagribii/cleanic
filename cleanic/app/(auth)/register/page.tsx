"use client";

import { RegisterForm } from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200/80">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Join Cleanic
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Create your account to get started
        </p>

        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-green-600 hover:text-green-800"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}