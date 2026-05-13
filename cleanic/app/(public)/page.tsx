import { type Metadata } from "next";
import MorphogenesisHero from "@/components/Morphogenesis";
import Team from "@/components/Team";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Cleanic membantu warga melaporkan sampah liar, belajar pengelolaan sampah, dan menukar kontribusi menjadi poin bermanfaat.",
};

export default function Home() {
  return (
    <main>
      <MorphogenesisHero
        title="CLEANIC"
        color="#15803d"
        heroImage="/hero.png"
      />
      <div
        className="h-20 w-full"
        style={{
          background:
            "linear-gradient(to bottom, #15803d 0%, #15803d 20%, #4ade80 50%, #ffffff 100%)",
        }}
      />
      <Team />
    </main>
  );
}
