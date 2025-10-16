import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Privacidad() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            className="rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 space-y-6"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6"
              style={{ color: '#556B2F' }}
            >
              Política de Privacidad
            </h1>

            <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
              En <strong>NutriMarvin</strong>, tu confianza es nuestra prioridad. Nos comprometemos a proteger tu información personal y a manejarla con total transparencia y respeto.
            </p>
            
            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                1. Información que recopilamos
              </h2>
              <p className="mb-3 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Podemos recopilar los siguientes datos al interactuar con nuestro sitio o diagnóstico funcional:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                <li>Nombre y dirección de correo electrónico</li>
                <li>Respuestas a cuestionarios de diagnóstico funcional</li>
                <li>Datos opcionales que compartas voluntariamente (por ejemplo, hábitos alimenticios o de sueño)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                2. Uso de la información
              </h2>
              <p className="mb-3 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                La información que recopilamos se utiliza exclusivamente con fines educativos y personalizados, para ofrecerte:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                <li>Resultados de tu diagnóstico funcional</li>
                <li>Contenido adaptado a tus necesidades de bienestar</li>
                <li>Actualizaciones educativas sobre nutrición funcional</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                3. Protección de tus datos
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Tus datos se almacenan mediante protocolos de seguridad y encriptación, y no son compartidos ni vendidos a terceros.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                4. Derechos del usuario
              </h2>
              <p className="mb-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Puedes solicitar en cualquier momento la eliminación de tus datos o dejar de recibir información escribiendo a:
              </p>
              <p className="text-sm sm:text-base">
                <a 
                  href="mailto:privacidad@nutrimarvin.com"
                  className="hover:underline"
                  style={{ color: '#A15C38' }}
                >
                  privacidad@nutrimarvin.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                5. Base legal
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Cumplimos con las regulaciones de privacidad aplicables en EE. UU., Europa (GDPR) y Latinoamérica. Tu información solo se utiliza con tu consentimiento explícito.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                6. Cookies y analítica
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Usamos cookies únicamente para mejorar tu experiencia en el sitio y analizar de forma anónima su funcionamiento. Puedes desactivarlas desde la configuración de tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                7. Cambios a esta política
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Podemos actualizar esta política ocasionalmente para reflejar mejoras en nuestros procesos o cumplimiento normativo. Notificaremos los cambios en esta misma página.
              </p>
            </section>

            <p className="text-center text-xs sm:text-sm mt-8" style={{ color: '#888' }}>
              <strong>Última actualización:</strong> Octubre 2025
            </p>

            <div className="text-center mt-8">
              <Link 
                href="/"
                className="inline-block px-6 py-3 rounded-md text-white font-semibold transition text-sm sm:text-base"
                style={{ backgroundColor: '#A15C38' }}
                data-testid="button-volver-inicio"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8C4E30'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A15C38'}
              >
                ⬅️ Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
