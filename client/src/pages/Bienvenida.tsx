import { useEffect } from "react";
import { Link } from "wouter";
import { BookOpen, Target, UtensilsCrossed, MessageCircle, CheckCircle, Mail, Home, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Bienvenida() {
  useEffect(() => {
    // Clear diagnostic answers from localStorage
    localStorage.removeItem('respuestasTransformaDiabetes');
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
            ¡Bienvenido al Plan TransformaDiabetes!
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
              className="text-xl sm:text-2xl font-bold mb-4 text-center" 
              style={{ color: '#3E3E2E' }}
            >
              Tu espacio personalizado de salud
            </h2>
            
            <p className="text-center mb-6 text-sm sm:text-base" style={{ color: '#6F6E66' }}>
              A partir de ahora tendrás acceso a herramientas personalizadas para comprender y 
              revertir la resistencia a la insulina desde la raíz.
            </p>
            
            <ul className="space-y-4" style={{ color: '#4B4B3B' }}>
              <li className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6B7041' }} />
                <div>
                  <strong className="block mb-1">Recomendaciones de nutrición funcional individualizadas</strong>
                  <span className="text-sm" style={{ color: '#6F6E66' }}>
                    Guías prácticas adaptadas a tu patrón metabólico específico
                  </span>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <Target className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6B7041' }} />
                <div>
                  <strong className="block mb-1">Interpretación de análisis de sangre</strong>
                  <span className="text-sm" style={{ color: '#6F6E66' }}>
                    Comprende tus valores de A1C, colesterol, triglicéridos y más
                  </span>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <UtensilsCrossed className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6B7041' }} />
                <div>
                  <strong className="block mb-1">Planes nutricionales y suplementación personalizada</strong>
                  <span className="text-sm" style={{ color: '#6F6E66' }}>
                    Recetas, menús y guía de suplementos adaptados a ti
                  </span>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#6B7041' }} />
                <div>
                  <strong className="block mb-1">Seguimiento de progreso y soporte continuo</strong>
                  <span className="text-sm" style={{ color: '#6F6E66' }}>
                    Monitorea síntomas, energía y recibe acompañamiento mensual
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

          {/* Primary CTA */}
          <div className="mb-6">
            <Link href="/perfil">
              <button
                className="w-full sm:w-auto px-10 py-4 rounded-lg font-bold transition text-base sm:text-lg flex items-center justify-center gap-2 mx-auto"
                style={{ 
                  backgroundColor: '#A15C38',
                  color: '#FFFFFF'
                }}
                data-testid="button-completar-perfil"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8C4E30'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A15C38'}
              >
                <Target className="w-5 h-5" />
                Completar mi perfil de salud
              </button>
            </Link>
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/analisis">
              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#6B7041',
                  border: '2px solid #6B7041'
                }}
                data-testid="button-analisis-sangre"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#6B7041';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6B7041';
                }}
              >
                <FileText className="w-4 h-4" />
                Interpretar análisis de sangre
              </button>
            </Link>
            
            <Link href="/">
              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#6B7041',
                  border: '2px solid #6B7041'
                }}
                data-testid="button-volver-inicio"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#6B7041';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6B7041';
                }}
              >
                <Home className="w-4 h-4" />
                Volver al Inicio
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
