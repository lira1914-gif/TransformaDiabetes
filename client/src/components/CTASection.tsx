import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTASection() {
  return (
    <section 
      className="py-20"
      style={{
        background: 'linear-gradient(to bottom, #F8F6F1 0%, #FFFFFF 100%)'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <h2 
            className="text-2xl md:text-4xl font-serif font-semibold"
            style={{ color: '#5E6647' }}
          >
            Tu cuerpo no necesita control, necesita comprensión.
          </h2>
          
          <p 
            className="text-base mx-auto leading-relaxed"
            style={{ 
              color: '#7A7A6F',
              maxWidth: '700px'
            }}
          >
            Empieza hoy a leer las señales que te guían hacia la reversión de tu resistencia a la insulina.
          </p>

          <div className="pt-4">
            <Link href="/diagnostico">
              <Button 
                size="lg" 
                className="rounded-xl font-medium py-3 px-8 transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: '#3D5A3A',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4E6A4B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3D5A3A'}
                data-testid="button-diagnostico-cta"
              >
                Haz tu diagnóstico gratuito ahora
              </Button>
            </Link>
          </div>

          <p 
            className="text-sm mt-4"
            style={{ color: '#8C847A' }}
          >
            Solo 3 minutos, sin registro, resultados personalizados según tus respuestas.
          </p>
        </div>
      </div>
    </section>
  );
}
