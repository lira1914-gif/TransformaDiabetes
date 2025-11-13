import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Terminos() {
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
              Términos de Servicio
            </h1>

            <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
              Bienvenido a <strong>TransformaDiabetes</strong>. Al utilizar nuestro sitio web y servicios, aceptas los siguientes términos y condiciones. Por favor léelos con atención.
            </p>
            
            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                1. Aceptación de términos
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Al acceder o utilizar TransformaDiabetes, confirmas que has leído, comprendido y aceptado estos términos. Si no estás de acuerdo, no utilices nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                2. Naturaleza educativa del servicio
              </h2>
              <p className="mb-3 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                TransformaDiabetes ofrece contenido educativo sobre nutrición funcional y reversión de diabetes tipo 2. Nuestro diagnóstico funcional y recomendaciones:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                <li><strong>No constituyen asesoramiento médico</strong></li>
                <li>No reemplazan la consulta con profesionales de la salud</li>
                <li>Son orientativos y basados en principios de medicina funcional</li>
                <li>Requieren validación personalizada con tu médico tratante</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                3. Responsabilidad del usuario
              </h2>
              <p className="mb-3 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Al utilizar TransformaDiabetes, tú eres responsable de:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                <li>Consultar a tu médico antes de implementar cambios en tu alimentación o tratamiento</li>
                <li>Proporcionar información precisa en el diagnóstico funcional</li>
                <li>No suspender medicación prescrita sin supervisión médica</li>
                <li>Utilizar el servicio de forma ética y legal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                4. Suscripción y pagos
              </h2>
              <p className="mb-3 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Al suscribirte a TransformaDiabetes por $5 USD al mes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                <li>Aceptas el cargo recurrente mensual procesado por Paddle</li>
                <li>Obtienes acceso a contenido educativo premium y guías funcionales</li>
                <li>Puedes cancelar tu suscripción en cualquier momento desde tu perfil</li>
                <li>Los pagos se procesan de forma segura a través de Paddle (Merchant of Record)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                5. Propiedad intelectual
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Todo el contenido de TransformaDiabetes (textos, guías, diagnósticos, diseños) es propiedad exclusiva de TransformaDiabetes y está protegido por leyes de propiedad intelectual. No puedes reproducir, distribuir o modificar el contenido sin autorización expresa.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                6. Limitación de responsabilidad
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                TransformaDiabetes no se hace responsable por decisiones tomadas basándose únicamente en nuestro contenido. No garantizamos resultados específicos de salud ni reemplazo de tratamientos médicos. Cualquier implementación de nuestras recomendaciones es bajo tu propia responsabilidad.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                7. Modificaciones al servicio
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Nos reservamos el derecho de modificar, suspender o descontinuar cualquier aspecto del servicio en cualquier momento. Te notificaremos cambios significativos a través del correo electrónico registrado.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                8. Terminación del servicio
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Podemos suspender o cancelar tu acceso si detectamos uso indebido, violación de estos términos, o actividad fraudulenta.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                9. Ley aplicable
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Estos términos se rigen por las leyes internacionales de comercio electrónico y protección al consumidor. Cualquier disputa se resolverá mediante arbitraje.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                10. Contacto
              </h2>
              <p className="mb-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Para consultas sobre estos términos, contáctanos en:
              </p>
              <p className="text-sm sm:text-base">
                <a 
                  href="mailto:soporte@transformadiabetes.com"
                  className="hover:underline"
                  style={{ color: '#A15C38' }}
                >
                  soporte@transformadiabetes.com
                </a>
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
                 Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
