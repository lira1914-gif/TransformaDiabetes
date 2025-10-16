import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacidad() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl md:text-4xl font-bold mb-6 text-center"
            style={{ color: '#6B7041' }}
          >
            Política de Privacidad
          </h1>
          
          <div 
            className="rounded-lg shadow-md p-8 space-y-6"
            style={{ backgroundColor: '#F7F5F0' }}
          >
            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#6B7041' }}>
                Privacidad y Confidencialidad
              </h2>
              <p style={{ color: '#6B635A' }}>
                La información que compartes en NutriMarvin es completamente confidencial. 
                Nos tomamos muy en serio la protección de tus datos personales y tu privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#6B7041' }}>
                Uso de la Información
              </h2>
              <p style={{ color: '#6B635A' }}>
                Cualquier respuesta proporcionada en el diagnóstico funcional se usa únicamente 
                para ofrecerte resultados educativos y personalizados dentro de nuestra plataforma. 
                No vendemos, compartimos ni divulgamos tus datos personales a terceros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#6B7041' }}>
                Seguridad de los Datos
              </h2>
              <p style={{ color: '#6B635A' }}>
                Protegemos tu información mediante protocolos seguros de encriptación y almacenamiento. 
                Cumplimos con las regulaciones de privacidad aplicables en EE. UU. y nos comprometemos 
                a mantener tus datos seguros en todo momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#6B7041' }}>
                Tus Derechos
              </h2>
              <p style={{ color: '#6B635A' }}>
                Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento. 
                Si tienes alguna pregunta o inquietud sobre cómo manejamos tus datos, no dudes en contactarnos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#6B7041' }}>
                Carácter Educativo
              </h2>
              <p style={{ color: '#6B635A' }}>
                Esta información es de carácter educativo y no sustituye el consejo médico profesional. 
                Consulta siempre con tu médico antes de realizar cambios en tu tratamiento.
              </p>
            </section>

            <section className="pt-4" style={{ borderTop: '1px solid #E8E4DC' }}>
              <p className="text-sm" style={{ color: '#6B635A' }}>
                <strong>Última actualización:</strong> Octubre 2025
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
