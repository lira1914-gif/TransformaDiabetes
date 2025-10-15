import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Resultados() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      <main className="flex-1 py-12 px-6">
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4" style={{ color: '#6B7041' }}>
            Tu Patrón Funcional Predominante
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-base md:text-lg" style={{ color: '#6B635A' }}>
            Basado en tus respuestas, tu cuerpo muestra un patrón principal que refleja
            cómo está manejando la energía, la digestión y el descanso. 
            Recuerda: no hay nada "malo", solo señales que te ayudan a entenderte mejor.
          </p>

          <div 
            className="rounded-lg shadow-md p-6 mb-6 max-w-2xl mx-auto text-left"
            style={{ backgroundColor: '#F7F5F0' }}
          >
            <h3 className="font-bold mb-2" style={{ color: '#6B7041' }}>
              🔍 Área de oportunidad
            </h3>
            <p style={{ color: '#4A4A4A' }}>
              Tu cuerpo está pidiendo apoyo en su regulación <strong>metabólica o digestiva</strong>. 
              Esto puede reflejarse en energía irregular, digestión lenta o sueño interrumpido.
            </p>
          </div>

          <div 
            className="rounded-lg shadow-md p-6 mb-6 max-w-2xl mx-auto text-left"
            style={{ backgroundColor: '#F7F5F0' }}
          >
            <h3 className="font-bold mb-2" style={{ color: '#6B7041' }}>
              🌿 Aspecto positivo
            </h3>
            <p style={{ color: '#4A4A4A' }}>
              Has reconocido las señales y estás tomando acción. Ese es el paso más importante 
              hacia la reversión.
            </p>
          </div>

          <div 
            className="rounded-lg shadow-md p-6 mb-6 max-w-2xl mx-auto text-left"
            style={{ backgroundColor: '#F7F5F0' }}
          >
            <h3 className="font-bold mb-2" style={{ color: '#6B7041' }}>
              💪 Primeros pasos funcionales
            </h3>
            <ul className="list-disc pl-6 space-y-2" style={{ color: '#4A4A4A' }}>
              <li>Prioriza comidas reales con proteína y fibra en cada tiempo.</li>
              <li>Procura dormir antes de las 11 p. m. para regular tus hormonas.</li>
              <li>Haz pausas conscientes de respiración o caminatas ligeras.</li>
            </ul>
          </div>

          <div className="mt-8">
            <Link 
              href="/guia"
              className="inline-block px-6 py-3 rounded-md text-white font-medium transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#6B7041' }}
              data-testid="button-descargar-guia"
            >
              Descargar mi Guía Funcional
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
