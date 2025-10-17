import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/stock_images/man_looking_at_table_501cceea.jpg";

export default function HeroSection() {
  return (
    <section 
      className="min-h-[80vh] flex items-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(250,248,244,0.95) 0%, rgba(238,235,225,0.9) 100%)',
      }}
    >
      {/* Fondo decorativo sutil */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm5.656 0L50.142 12.487l-1.414 1.414L36.244 1.414 37.656 0zm-16.97 0l13.314 13.314-1.414 1.414L20.686 2.828 19.272 1.414 20.686 0z' fill='%23556B2F' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda - Texto */}
          <div className="space-y-6">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight"
              style={{ color: '#556B2F' }}
            >
              Tu cuerpo no está roto.
              <br />
              Solo está protegiéndose.
            </h1>
            
            <p 
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: '#3A3A3A' }}
            >
              Aprende a leer las señales de tu cuerpo, equilibrar tu glucosa y revertir la diabetes tipo 2 desde la raíz.
            </p>
            
            <div 
              className="space-y-3"
              style={{ color: '#6F6E66', fontSize: '0.95rem', lineHeight: 1.6 }}
            >
              <p>Sanar no es controlar síntomas,</p>
              <p>es entender causas.</p>
              <p>Nutrición funcional clara, aplicada a tu día a día.</p>
            </div>

            <div className="pt-4">
              <Link href="/pre-registro">
                <Button 
                  size="lg"
                  data-testid="button-diagnostico-hero"
                  style={{
                    backgroundColor: '#A15C38',
                    color: 'white',
                    padding: '0.9rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  Iniciar mi diagnóstico funcional gratuito
                </Button>
              </Link>
              
              <p 
                className="text-sm mt-3"
                style={{ color: '#6F6E66' }}
              >
                Gratis • 3–5 minutos • Resultados personalizados
              </p>
            </div>
          </div>

          {/* Columna derecha - Imagen */}
          <div className="hidden lg:flex justify-center items-center">
            <div 
              className="relative rounded-lg overflow-hidden shadow-2xl"
              style={{
                maxWidth: '480px',
                width: '100%',
              }}
            >
              <img
                src={heroImage}
                alt="Persona viendo tablet con información de salud"
                className="w-full h-auto object-cover"
                style={{
                  aspectRatio: '4/3',
                }}
              />
              {/* Overlay sutil */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(85,107,47,0.05) 0%, rgba(161,92,56,0.05) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
