import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import QueEsSection from "@/components/QueEsSection";
import PilaresSection from "@/components/PilaresSection";
import HistoriasSection from "@/components/HistoriasSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <QueEsSection />
        <PilaresSection />
        <HistoriasSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
