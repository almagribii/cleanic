import { type Metadata } from "next";
import ContactSection from "./(component)/ContactSection";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi tim Cleanic melalui kanal komunikasi resmi untuk kolaborasi, dukungan, dan informasi lebih lanjut.",
};

export default function ContactPage() {
  return <ContactSection />;
}
