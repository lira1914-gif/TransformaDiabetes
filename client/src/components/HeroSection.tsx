import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary leading-tight mb-6">
          Tu cuerpo no está roto.<br />Solo está protegiéndose.
        </h1>
        
        <p className="text-lg sm:text-xl text-foreground leading-relaxed max-w-2xl mx-auto mb-8">
          Aprende a leer las señales de tu cuerpo, equilibrar tu glucosa y revertir la resistencia a la insulina desde la raíz.
        </p>
        
        <Link href="/pre-registro">
          <Button 
            size="lg" 
            variant="default"
            className="mb-4"
            data-testid="button-diagnostico-hero"
          >
            Iniciar mi diagnóstico funcional gratuito
          </Button>
        </Link>
        
        <p className="text-sm text-muted-foreground mt-4">
          Gratis • 3–5 minutos • Resultado personalizado
        </p>
      </div>
    </section>
  );
}
