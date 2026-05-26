import StickyHero from "@/components/StickyHero";
import ScrollNarrative from "@/components/ScrollNarrative";
import TheStory from "@/components/TheStory";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <main>
      {/* Fixed moto background + fixed UI chrome */}
      <StickyHero />

      {/* Fixed stat stream over the moto */}
      <ScrollNarrative />

      {/* Scroll driver for the stat narrative (20 stats × ~48vh) */}
      <div style={{ height: "960vh" }} />

      {/* Content sections slide over the fixed hero at z:20 */}
      <div style={{ position: "relative", zIndex: 20 }}>
        <TheStory />
        <CTASection />
      </div>
    </main>
  );
}
