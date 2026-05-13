import { type Metadata } from "next";
import DashboardContent from "./(component)/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Dashboard Cleanic untuk memantau aktivitas, poin, laporan, dan progres kontribusi kebersihan lingkungan.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
