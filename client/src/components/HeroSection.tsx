import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Healthy_meal_preparation_scene_65552892.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-accent/50 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3 space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary leading-tight">
              Revierte tu Diabetes Tipo 2
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Descubre cómo la nutrición funcional puede transformar tu salud y liberarte de la dependencia de medicamentos
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Un camino científico y comprobado hacia la reversión de DM2, con empatía y esperanza en cada paso
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/diagnostico">
                <Button 
                  size="lg" 
                  className="bg-terracota hover:bg-terracota text-terracota-foreground border border-terracota w-full sm:w-auto"
                  data-testid="button-diagnostico-hero"
                >
                  Realizar Diagnóstico Gratuito
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="backdrop-blur-sm w-full sm:w-auto"
                data-testid="button-descargar-guia-hero"
              >
                Descargar Guía Gratuita
              </Button>
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
