import { useEffect } from "react";
import { Link } from "wouter";
import { BookOpen, Target, UtensilsCrossed, MessageCircle, CheckCircle, Mail, Home, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Bienvenida() {
  useEffect(() => {
    // Clear diagnostic answers from localStorage
    localStorage.removeItem('respuestasNutriMarvin');
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6">
        <section 
          className="text-center max-w-3xl mx-auto w-full sm:w-[95%] lg:w-[90%] p-8 sm:p-12 lg:p-16 rounded-xl"
          style={{ 
            backgroundColor: '#F8F7F3',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}
        >
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E8F5E9' }}
            >
              <svg 
                className="w-12 h-12" 
                fill="none" 
                stroke="#6B7041" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          {/* Welcome Title */}
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" 
            style={{ color: '#3E3E2E' }}
          >
            ¡Bienvenido al Plan NutriMarvin!
          </h1>

          <p 
            className="text-lg sm:text-xl mb-8" 
            style={{ color: '#6B7041' }}
          >
            Tu suscripción se ha confirmado con éxito
          </p>

          {/* What to Expect */}
          <div 
            className="text-left rounded-lg p-6 sm:p-8 mb-8"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <h2 
              className="text-xl sm:text-2xl font-bold mb-6 text-center" 
              style={{ color: '#3E3E2E' }}
            >
              Qué esperar de tu plan mensual
            </h2>
            
            <ul className="space-y-4" style={{ color: '#4B4B3B' }}>
              <li className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6B7041' }} />
                <div>
                  <strong className="block mb-1">Guías prácticas personalizadas</strong>
                  <span className="text-sm" style={{ color: '#6F6E66' }}>
                    Acceso a contenido educativo según tu patrón funcional
                  </span>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <Target className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6B7041' }} />
                <div>
                  <strong className="block mb-1">Herramientas de seguimiento</strong>
                  <span className="text-sm" style={{ color: '#6F6E66' }}>
                    Recursos para monitorear tu progreso y síntomas
                  </span>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <UtensilsCrossed className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6B7041' }} />
                <div>
                  <strong className="block mb-1">Recetas y planes nutricionales</strong>
                  <span className="text-sm" style={{ color: '#6F6E66' }}>
                    Menús adaptados a tu patrón metabólico
                  </span>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6B7041' }} />
                <div>
                  <strong className="block mb-1">Soporte continuo</strong>
                  <span className="text-sm" style={{ color: '#6F6E66' }}>
                    Acompañamiento mensual para resolver tus dudas
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div 
            className="rounded-lg p-6 mb-8"
            style={{ backgroundColor: '#EFEDE8' }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-5 h-5" style={{ color: '#6B7041' }} />
              <h3 
                className="text-lg font-bold" 
                style={{ color: '#3E3E2E' }}
              >
                Revisa tu correo electrónico
              </h3>
            </div>
            <p className="text-sm sm:text-base" style={{ color: '#6F6E66' }}>
              Te hemos enviado un correo de confirmación con los detalles de tu suscripción 
              y los próximos pasos para acceder a todo el contenido exclusivo.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button
                className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition text-sm sm:text-base flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#6B7041',
                  color: '#FFFFFF'
                }}
                data-testid="button-volver-inicio"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A5F35'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6B7041'}
              >
                <Home className="w-4 h-4" />
                Volver al Inicio
              </button>
            </Link>
            
            <Link href="/guia">
              <button
                className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition text-sm sm:text-base flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#A15C38',
                  color: '#FFFFFF'
                }}
                data-testid="button-ver-guias"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8C4E30'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A15C38'}
              >
                <FileText className="w-4 h-4" />
                Ver Guías
              </button>
            </Link>
          </div>

          {/* Thank You Message */}
          <p 
            className="mt-8 text-sm italic" 
            style={{ color: '#6F6E66' }}
          >
            "Tu cuerpo no está roto, solo está protegiéndose. Ahora comienza tu camino de sanación."
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
