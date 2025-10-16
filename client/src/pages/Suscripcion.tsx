import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";

export default function Suscripcion() {
  const [, setLocation] = useLocation();

  const handleSubscribe = () => {
    // TODO: Integrar Paddle cuando esté listo
    alert("Paddle se integrará próximamente");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4"
              style={{ color: '#5E6647' }}
            >
              🌿 Tu transformación funcional comienza aquí
            </h1>
            <p 
              className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#6F6E66' }}
            >
              Acompañamiento humano + ciencia funcional para recuperar tu energía, estabilizar tu glucosa y reconectar con tu cuerpo.
              <br />
              <span className="italic">Tu cuerpo no está roto — solo está protegiéndose.</span>
            </p>
          </div>

          {/* HERO IMAGE */}
          <div className="text-center my-8">
            <img 
              src="https://images.unsplash.com/photo-1556228578-4cdd6d0a6d2b?auto=format&fit=crop&w=800&q=80"
              alt="Persona relajada revisando su progreso funcional"
              className="max-w-full mx-auto rounded-xl shadow-md"
              style={{ maxWidth: '90%' }}
            />
          </div>

          {/* SECTION TITLE */}
          <h2 
            className="text-2xl sm:text-3xl font-serif font-semibold text-center mb-8"
            style={{ color: '#5E6647' }}
          >
            Suscripción NutriMarvin Funcional
          </h2>

          {/* GRID: BENEFICIOS + CÓMO FUNCIONA */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-10">
            
            {/* Beneficios */}
            <section 
              className="rounded-xl p-6 sm:p-8"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E3D9'
              }}
            >
              <h3 
                className="text-xl sm:text-2xl font-semibold mb-4"
                style={{ color: '#5E6647' }}
              >
                💚 Qué recibes por $5/mes
              </h3>
              <ul 
                className="space-y-3 text-sm sm:text-base"
                style={{ color: '#3A3A3A', lineHeight: '1.7' }}
              >
                <li>✓ Acceso a <strong>10 mini guías funcionales</strong> ampliadas.</li>
                <li>✓ Recomendaciones prácticas para <strong>equilibrar tu glucosa</strong> y tu energía.</li>
                <li>✓ Opción de enviar tus <strong>análisis de sangre</strong> para revisión personalizada.</li>
                <li>✓ Microhábitos semanales para mejorar digestión, estrés y descanso.</li>
                <li>✓ Contenido educativo sobre nutrición funcional y hormonas.</li>
              </ul>
            </section>

            {/* Cómo funciona */}
            <section 
              className="rounded-xl p-6 sm:p-8"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E3D9'
              }}
            >
              <h3 
                className="text-xl sm:text-2xl font-semibold mb-4"
                style={{ color: '#5E6647' }}
              >
                🧭 Cómo funciona
              </h3>
              <ol 
                className="space-y-3 text-sm sm:text-base list-decimal list-inside"
                style={{ color: '#3A3A3A', lineHeight: '1.7' }}
              >
                <li>Suscríbete para obtener acceso seguro y exclusivo.</li>
                <li>Completa tu <strong>historial funcional</strong> (alimentación, sueño, síntomas, hábitos).</li>
                <li>Registra tus comidas y sensaciones durante los <strong>primeros 5 días</strong>.</li>
                <li>Recibe tus recomendaciones iniciales + plan de ajustes personalizados.</li>
                <li>Accede a la comunidad y herramientas de seguimiento.</li>
              </ol>
            </section>
          </div>

          {/* CTA */}
          <div className="text-center mb-8">
            <button
              onClick={handleSubscribe}
              className="px-8 py-4 rounded-lg font-bold text-white text-base sm:text-lg transition-opacity hover:opacity-90 active:opacity-95"
              style={{ backgroundColor: '#A15C38' }}
              data-testid="button-subscribe-page"
            >
              💳 Unirme por $5 USD/mes
            </button>
            
            <p 
              className="mt-3 text-sm sm:text-base"
              style={{ color: '#6F6E66' }}
            >
              Cancela en cualquier momento. Sin permanencia.
            </p>
          </div>

          {/* TRUST SECTION */}
          <div className="text-center space-y-2">
            <p 
              className="text-sm sm:text-base"
              style={{ color: '#6F6E66' }}
            >
              Más de 300 personas ya han iniciado su camino funcional con NutriMarvin.
            </p>
            <p 
              className="text-xs sm:text-sm"
              style={{ color: '#A6A28B' }}
            >
              Este programa es educativo y no sustituye el consejo médico profesional.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
