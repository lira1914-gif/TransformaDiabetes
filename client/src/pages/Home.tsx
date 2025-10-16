import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PilaresSection from "@/components/PilaresSection";
import HistoriasSection from "@/components/HistoriasSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PilaresSection />
        <HistoriasSection />
      </main>
      <Footer />
    </div>
  );
}
