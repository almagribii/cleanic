import MorphogenesisHero from "@/components/Morphogenesis";
import Team from "@/components/Team";

export default function Home() {
  return (
    <main>
      <MorphogenesisHero
        title="CLEANIC"
        color="#15803d"
        heroImage="/hero.png"
      />
      <div
        className="w-full h-20"
        style={{
          background:
            "linear-gradient(to bottom, #15803d 0%, #15803d 20%, #4ade80 50%, #ffffff 100%)",
        }}
      />
      <Team />
    </main>
  );
}
