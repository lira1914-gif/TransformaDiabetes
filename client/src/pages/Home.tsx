import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import QueEsSection from "@/components/QueEsSection";
import PilaresSection from "@/components/PilaresSection";
import HistoriasSection from "@/components/HistoriasSection";
import SuscripcionSection from "@/components/SuscripcionSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <QueEsSection />
        <PilaresSection />
        <HistoriasSection />
        <SuscripcionSection />
      </main>
      <Footer />
    </div>
  );
}
