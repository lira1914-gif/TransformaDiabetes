import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Guia() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              Guía Funcional Gratuita
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descarga tu guía completa para comenzar a revertir la diabetes tipo 2 desde hoy
            </p>
            
            <div className="bg-accent/30 rounded-lg p-8 max-w-md mx-auto">
              <Button 
                size="lg" 
                className="bg-terracota hover:bg-terracota text-terracota-foreground border border-terracota w-full"
                data-testid="button-download-guide"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Guía en PDF
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Formato PDF • 100% Gratis • Acceso Inmediato
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
