import { type Metadata } from "next";
import ReportContent from "./(component)/ReportContent";

export const metadata: Metadata = {
  title: "Laporan Sampah",
  description:
    "Kirim laporan sampah beserta lokasi dan pantau riwayat laporan kamu di Cleanic.",
};

export default function ReportPage() {
  return <ReportContent />;
}
