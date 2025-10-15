import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Healthy_meal_preparation_scene_65552892.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-accent/50 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-5 gap-16 items-center">
          <div className="md:col-span-3 space-y-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary leading-tight">
              Tu cuerpo no está roto, solo está protegiéndose.
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Aprende a leer las señales de tu cuerpo, equilibrar tu glucosa y empezar a revertir la diabetes tipo 2 desde la raíz.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Sanar no es controlar síntomas, es entender causas. Nutrición funcional clara, aplicada a tu día a día.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/diagnostico">
                  <Button 
                    size="lg" 
                    className="bg-terracota hover:bg-terracota text-terracota-foreground border border-terracota w-full sm:w-auto"
                    data-testid="button-diagnostico-hero"
                  >
                    Empieza tu diagnóstico gratuito
                  </Button>
                </Link>
                <Link href="/guia">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-accent/50 backdrop-blur-sm w-full sm:w-auto"
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
          <div className="md:col-span-2">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Preparación de comida saludable" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
