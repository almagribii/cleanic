import MorphogenesisHero from "@/components/bisa";

export default function Home() {
  return (
    <main>
      <MorphogenesisHero
        title="CLEANIC"
        color="#ffffff"
        heroImage="/hero.png"
      />
      <section className="flex h-screen items-center justify-center bg-white">
        <p className="w-1/3 text-center text-white">Your about content here...</p>
      </section>
    </main>
  );
}