import { type Metadata } from "next";
import Teams from "@/components/Team";

export const metadata: Metadata = {
  title: "Tentang Cleanic",
  description:
    "Pelajari visi, misi, dan tim di balik Cleanic dalam mendorong kota yang lebih bersih dan berkelanjutan.",
};

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      <Teams />
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold">Tentang</h1>
        <p className="text-gray-600">Halaman tentang akan segera hadir</p>
      </div>
    </div>
  );
}
