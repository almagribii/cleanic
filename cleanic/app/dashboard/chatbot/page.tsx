import { type Metadata } from "next";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Chatbot",
  description:
    "Asisten chatbot Cleanic untuk membantu informasi seputar sampah dan penggunaan platform.",
};

export default function ChatbotPage() {
  return (
    <div className="h-[calc(100vh-5rem)]">
      <Chatbot />
    </div>
  );
}
