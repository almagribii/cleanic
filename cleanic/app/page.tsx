import MorphogenesisHero from "@/components/bisa";

export default function Home() {
  return (
    <main>
      <MorphogenesisHero
        title="CLEANIC"
        color="#ffffff"
        heroImage="/hero.png"
      />
      {/* Section About selanjutnya */}
      <section className="h-screen bg-white flex items-center justify-center">
        <p className="text-white w-1/3 text-center">Your about content here...</p>
      </section>
    </main>
  );
}
