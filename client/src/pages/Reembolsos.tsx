import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Reembolsos() {
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
              Política de Reembolsos
            </h1>

            <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
              En <strong>TransformaDiabetes</strong>, queremos que estés completamente satisfecho con nuestro servicio. Por eso, ofrecemos una política de reembolsos clara y justa.
            </p>
            
            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                1. Garantía de satisfacción
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Ofrecemos una <strong>garantía de reembolso de 7 días</strong> desde la fecha de tu primera suscripción. Si durante este período decides que TransformaDiabetes no es lo que esperabas, te devolvemos el 100% de tu inversión sin preguntas.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                2. ¿Cuándo puedo solicitar un reembolso?
              </h2>
              <p className="mb-3 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Puedes solicitar un reembolso completo si:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                <li>Estás dentro de los primeros 7 días de tu suscripción inicial</li>
                <li>No has utilizado el servicio de forma fraudulenta o indebida</li>
                <li>Experimentas problemas técnicos que no pudimos resolver</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                3. ¿Cuándo NO aplica el reembolso?
              </h2>
              <p className="mb-3 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                No se otorgarán reembolsos en los siguientes casos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                <li>Han pasado más de 7 días desde tu primer pago</li>
                <li>Solicitas reembolso por renovaciones mensuales posteriores (puedes cancelar en cualquier momento sin costo adicional)</li>
                <li>Ya recibiste un reembolso previamente y te suscribes nuevamente</li>
                <li>Se detecta uso fraudulento, compartir de cuentas o violación de términos de servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                4. Cómo solicitar un reembolso
              </h2>
              <p className="mb-3 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Para solicitar tu reembolso:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                <li>Envía un correo a <a href="mailto:reembolsos@transformadiabetes.com" className="hover:underline" style={{ color: '#A15C38' }}>reembolsos@transformadiabetes.com</a></li>
                <li>Incluye tu nombre completo, correo de registro y razón de la solicitud (opcional)</li>
                <li>Procesaremos tu solicitud en un plazo de 2-3 días hábiles</li>
                <li>El reembolso se reflejará en tu cuenta según los tiempos de tu banco o tarjeta (5-10 días hábiles)</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                5. Cancelación de suscripción
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Si decides que TransformaDiabetes no es para ti después de los 7 días, puedes cancelar tu suscripción en cualquier momento desde tu perfil o escribiendo a soporte. No habrá cargos futuros, pero no se reembolsarán períodos ya facturados.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                6. Procesamiento de reembolsos
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Los reembolsos se procesan a través de <strong>Paddle</strong>, nuestro procesador de pagos. Una vez aprobada tu solicitud, el dinero regresará al método de pago original utilizado en la suscripción.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                7. Excepciones especiales
              </h2>
              <p className="text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Si experimentas una situación excepcional (por ejemplo, problemas graves de salud, dificultades económicas inesperadas), contáctanos directamente. Evaluamos cada caso individualmente con empatía y flexibilidad.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6" style={{ color: '#A15C38' }}>
                8. Contacto
              </h2>
              <p className="mb-2 text-sm sm:text-base" style={{ color: '#3A3A3A' }}>
                Para cualquier duda sobre nuestra política de reembolsos:
              </p>
              <p className="text-sm sm:text-base">
                <a 
                  href="mailto:reembolsos@transformadiabetes.com"
                  className="hover:underline"
                  style={{ color: '#A15C38' }}
                >
                  reembolsos@transformadiabetes.com
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
