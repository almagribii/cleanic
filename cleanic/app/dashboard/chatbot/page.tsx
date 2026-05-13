import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatbot",
  description:
    "Asisten chatbot Cleanic untuk membantu informasi seputar sampah dan penggunaan platform.",
};

export default function MapsPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">Maps</h1>
      <p className="text-gray-600">Welcome to the Maps page</p>
    </div>
  );
}
