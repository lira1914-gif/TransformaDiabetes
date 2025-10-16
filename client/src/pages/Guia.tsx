import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Guia() {
  const [, setLocation] = useLocation();

  const handleSubscribe = () => {
    setLocation("/resultados");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div 
          className="max-w-4xl mx-auto px-4 sm:px-6"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E6E3D9',
            padding: '2rem',
            margin: '2rem auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
          }}
        >
          <h2 
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: '#556B2F' }}
          >
            🌱 Mini Guía Funcional: Revertir la Resistencia a la Insulina
          </h2>

          {/* Entendiendo tu metabolismo */}
          <section className="mb-8">
            <h3 
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ color: '#3A3A3A' }}
            >
              🔎 Entendiendo tu metabolismo
            </h3>
            <p 
              className="text-base leading-relaxed"
              style={{ color: '#6F6E66' }}
            >
              Tu cuerpo busca equilibrio, no castigo. La resistencia a la insulina no aparece de la nada; es una señal de que tus células están saturadas de energía y necesitan volver a escuchar la señal de la insulina. Este proceso puede revertirse con cambios sostenibles en tu alimentación, descanso y movimiento. El objetivo no es "controlar" la glucosa, sino enseñarle a tu cuerpo a confiar nuevamente en su propio equilibrio.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #E6E3D9', margin: '2rem 0' }} />

          {/* Lo que bloquea tu metabolismo */}
          <section className="mb-8">
            <h3 
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ color: '#3A3A3A' }}
            >
              🚫 Lo que bloquea tu metabolismo
            </h3>
            <ul className="space-y-3">
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Azúcar y harinas refinadas:</strong> elevan picos de glucosa y hacen que tu cuerpo libere más insulina.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Comer tarde o saltarte comidas:</strong> confunde tu reloj metabólico y altera tus hormonas del apetito.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Estrés crónico:</strong> el cortisol elevado aumenta la glucosa en sangre y dificulta la pérdida de grasa.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Falta de sueño:</strong> reduce tu sensibilidad a la insulina y favorece el aumento de peso.
              </li>
            </ul>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #E6E3D9', margin: '2rem 0' }} />

          {/* Lo que ayuda a revertirla */}
          <section className="mb-8">
            <h3 
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ color: '#3A3A3A' }}
            >
              ✅ Lo que ayuda a revertirla
            </h3>
            <ul className="space-y-3">
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Incluye grasa, fibra y proteína en cada comida:</strong> esta combinación estabiliza la glucosa, reduce antojos y prolonga tu energía.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Desayuna con proteína y fibra:</strong> huevos, aguacate, semillas o yogurt natural sin azúcar.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Evita azúcares ocultos:</strong> revisa etiquetas; el jarabe de maíz, maltosa y dextrosa actúan igual que el azúcar.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Camina 10–15 minutos después de comer:</strong> ayuda a tus músculos a usar la glucosa en lugar de almacenarla.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Prioriza alimentos reales:</strong> vegetales, grasas buenas y proteína limpia son tu mejor "medicina".
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Reduce la cafeína y el alcohol:</strong> permiten que tu hígado recupere su función de equilibrio glucémico.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Regula el estrés:</strong> la respiración consciente, los descansos breves y el sueño profundo son herramientas metabólicas, no lujos.
              </li>
            </ul>

            <div 
              className="mt-6 p-4 rounded-lg italic"
              style={{ 
                backgroundColor: '#F8F7F3',
                borderLeft: '4px solid #A15C38',
                color: '#6F6E66'
              }}
            >
              💫 Tu cuerpo no puede sanar en estado de alerta. Dale permiso para descansar y reparar.
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #E6E3D9', margin: '2rem 0' }} />

          {/* Tips funcionales extra */}
          <section className="mb-8">
            <h3 
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ color: '#3A3A3A' }}
            >
              🌿 Tips funcionales extra
            </h3>
            <ul className="space-y-3">
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Suplementos clave:</strong> magnesio, inositol, cromo y omega-3 pueden apoyar tu sensibilidad a la insulina.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Descansa antes de las 11 p.m.:</strong> durante ese horario tu cuerpo regula cortisol y glucosa.
              </li>
              <li style={{ color: '#6F6E66' }}>
                <strong style={{ color: '#3A3A3A' }}>Hidratación inteligente:</strong> agua, infusiones o agua con limón — evita refrescos, incluso "sin azúcar".
              </li>
            </ul>

            <div 
              className="mt-6 p-4 rounded-lg italic text-center"
              style={{ 
                backgroundColor: '#F8F7F3',
                borderLeft: '4px solid #A15C38',
                color: '#6F6E66'
              }}
            >
              "No se trata de controlar tu azúcar, sino de enseñarle a tu cuerpo a confiar otra vez."
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #E6E3D9', margin: '2rem 0' }} />

          {/* Da tu siguiente paso */}
          <section className="mb-6">
            <h3 
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ color: '#3A3A3A' }}
            >
              🚀 Da tu siguiente paso
            </h3>
            <p 
              className="text-base leading-relaxed mb-4"
              style={{ color: '#6F6E66' }}
            >
              Esta mini guía es solo el inicio. Puedo ayudarte a crear un plan personalizado basado en tus hábitos, síntomas y análisis de sangre. Juntos podemos revertir la resistencia a la insulina desde la raíz.
            </p>

            <p 
              className="font-semibold mb-2"
              style={{ color: '#3A3A3A' }}
            >
              Incluye:
            </p>
            <ul className="space-y-2 mb-4">
              <li style={{ color: '#6F6E66' }}>✓ Evaluación funcional completa y revisión de tus hábitos</li>
              <li style={{ color: '#6F6E66' }}>✓ Revisión e interpretación de tus análisis de sangre</li>
              <li style={{ color: '#6F6E66' }}>✓ Plan de alimentación y estilo de vida individualizado</li>
              <li style={{ color: '#6F6E66' }}>✓ Suplementación y seguimiento mensual</li>
            </ul>

            <p 
              className="font-semibold mb-4"
              style={{ color: '#3A3A3A' }}
            >
              💲 Inversión: $5/mes con acceso completo a guías, recetas y acompañamiento funcional.
            </p>

            <button
              onClick={handleSubscribe}
              className="w-full md:w-auto px-6 py-3 rounded-lg font-bold text-white transition-all"
              style={{ backgroundColor: '#A15C38' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8C4E30'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A15C38'}
              data-testid="button-suscribirme"
            >
              Suscribirme al Plan NutriMarvin
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
