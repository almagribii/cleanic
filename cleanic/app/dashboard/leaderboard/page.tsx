import { type Metadata } from "next";
import LeaderboardPage from "../leaderboard/(component)/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Lihat peringkat pengguna Cleanic berdasarkan poin kontribusi pelaporan sampah.",
};

export default function Leaderboard() {
  return (
    <div>
      <LeaderboardPage />
    </div>
  );
}
