import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Scanner",
  description:
    "Gunakan AI Scanner Cleanic untuk membantu identifikasi sampah secara cepat.",
};

export default function AIScannerPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">AI Scanner</h1>
      <p className="text-gray-600">Welcome to the AI Scanner page</p>
    </div>
  );
}
