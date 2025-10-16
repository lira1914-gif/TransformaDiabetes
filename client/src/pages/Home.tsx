import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleSubscribe = () => {
    setLocation('/pre-registro');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          
          {/* HERO SECTION */}
          <section 
            className="rounded-xl p-6 sm:p-8 text-center mb-6"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '1px solid #E6E3D9',
              boxShadow: '0 6px 18px rgba(0,0,0,0.05)'
            }}
          >
            <h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
              style={{ color: '#556B2F' }}
            >
              Suscripción NutriMarvin Funcional
            </h1>
            <p 
              className="text-base sm:text-lg mb-2"
              style={{ color: '#6F6E66' }}
            >
              Acompañamiento humano + ciencia funcional para revertir resistencia a la insulina.
            </p>
            <p 
              className="text-base sm:text-lg italic"
              style={{ color: '#6F6E66' }}
            >
              "Tu cuerpo no está roto — solo está protegiéndose."
            </p>
          </section>

          {/* GRID: BENEFICIOS + CÓMO FUNCIONA */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            
            {/* Beneficios */}
            <section 
              className="rounded-xl p-5 sm:p-6"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E3D9'
              }}
            >
              <h3 
                className="text-lg sm:text-xl font-bold mb-4"
                style={{ color: '#3E3E2E' }}
              >
                Qué recibes por $5/mes
              </h3>
              <ul 
                className="space-y-2 text-sm sm:text-base"
                style={{ color: '#3A3A3A', lineHeight: '1.7' }}
              >
                <li>Acceso a las <strong>16 guías funcionales ampliadas</strong>.</li>
                <li>Planes personalizados: <strong>qué eliminar · qué incluir · qué suplementar</strong>.</li>
                <li>Revisión opcional de tus <strong>análisis de sangre</strong> para identificar desbalances funcionales.</li>
                <li>Microhábitos semanales para reducir inflamación y mejorar tu glucosa.</li>
                <li>Rutinas de digestión, sueño y manejo del estrés.</li>
                <li>Contenido educativo y actualizaciones mensuales.</li>
              </ul>
            </section>

            {/* Cómo funciona */}
            <section 
              className="rounded-xl p-5 sm:p-6"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E3D9'
              }}
            >
              <h3 
                className="text-lg sm:text-xl font-bold mb-4"
                style={{ color: '#3E3E2E' }}
              >
                Cómo funciona
              </h3>
              <ul 
                className="space-y-2 text-sm sm:text-base"
                style={{ color: '#3A3A3A', lineHeight: '1.7' }}
              >
                <li><strong>1)</strong> Suscríbete con tu correo y activa tu acceso seguro.</li>
                <li><strong>2)</strong> Completa tu perfil funcional (historial, síntomas, hábitos).</li>
                <li><strong>3)</strong> Sube tus análisis de sangre (si los tienes) para una revisión detallada.</li>
                <li><strong>4)</strong> Recibe tu plan y actualizaciones directamente desde NutriMarvin.</li>
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={handleSubscribe}
              className="px-8 py-3 rounded-lg font-bold text-white text-base sm:text-lg transition-opacity hover:opacity-95"
              style={{ backgroundColor: '#A15C38' }}
              data-testid="button-subscribe-home"
            >
              Unirme por $5 USD/mes
            </button>
            
            <p 
              className="mt-3 text-sm sm:text-base"
              style={{ color: '#6F6E66' }}
            >
              Cancela en cualquier momento. Sin permanencia.
            </p>
            
            <p 
              className="mt-3 text-xs sm:text-sm"
              style={{ color: '#A6A28B' }}
            >
              Tu información es confidencial y no se comparte con terceros.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
