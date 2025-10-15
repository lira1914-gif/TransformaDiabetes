import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary">
            Comienza Tu Transformación Hoy
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
            Descubre exactamente dónde estás en tu camino hacia la reversión con nuestra herramienta de diagnóstico gratuita
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/diagnostico">
              <Button 
                size="lg" 
                className="bg-terracota hover:bg-terracota text-terracota-foreground border border-terracota w-full sm:w-auto"
                data-testid="button-diagnostico-cta"
              >
                Realizar Diagnóstico Gratuito
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto"
              data-testid="button-descargar-guia-cta"
            >
              Descargar Guía Gratuita
            </Button>
          </div>

          <div className="pt-8 border-t mt-12">
            <p className="text-lg font-semibold text-primary mb-6">
              O accede a todo nuestro contenido premium
            </p>
            <div className="bg-card rounded-lg p-8 max-w-md mx-auto space-y-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">$5</p>
                <p className="text-muted-foreground">/mes</p>
              </div>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Acceso completo a planes de alimentación personalizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Guías descargables y recetas exclusivas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Seguimiento de progreso y análisis personalizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Comunidad de apoyo y recursos continuos</span>
                </li>
              </ul>
              <Button 
                variant="default" 
                size="lg" 
                className="w-full"
                data-testid="button-suscripcion"
              >
                Únete por $5/mes - Acceso Total
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
