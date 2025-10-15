import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Man_viewing_Salud_metabólica_tablet_17b686b5.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70 blur-sm"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay Gradient */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: 'rgba(249, 248, 246, 0.8)' }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary leading-[1.2]">
              Tu cuerpo no está roto.
              <br />
              Solo está protegiéndose.
            </h1>
            <p className="text-xl md:text-2xl text-foreground leading-relaxed">
              Aprende a leer las señales de tu cuerpo, equilibrar tu glucosa y revertir la diabetes tipo 2 desde la raíz.
            </p>
            <p className="text-base text-muted-foreground leading-loose font-light">
              Sanar no es controlar síntomas,<br />
              es entender causas.<br />
              Nutrición funcional clara, aplicada a tu día a día.
            </p>
            <div className="space-y-4 pt-4 flex flex-col items-center lg:items-start">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/diagnostico" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="bg-terracota hover:bg-terracota text-terracota-foreground border border-terracota w-full"
                    data-testid="button-diagnostico-hero"
                  >
                    Empieza tu diagnóstico gratuito
                  </Button>
                </Link>
                <Link href="/guia" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-accent/50 backdrop-blur-sm w-full"
                    data-testid="button-descargar-guia-hero"
                  >
                    Descargar guía funcional
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Gratis • 3–5 minutos • Resultado personalizado
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Persona aprendiendo sobre salud metabólica en tablet, nutrición funcional y reversión de diabetes tipo 2 — NutriMarvin" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
