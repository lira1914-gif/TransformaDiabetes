import { useEffect, useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';

interface PatronResult {
  patron: string;
  descripcion: string;
  recomendaciones: string[];
  fraseMotivacional: string;
}

interface Answer {
  questionIndex: number;
  answer: string;
}

function interpretarPatronSimple(answers: Answer[]): PatronResult {
  // Map answers to axes
  const axisCount: Record<string, number> = {
    "Metabólico": 0,
    "Digestivo": 0,
    "Estrés": 0,
    "Inflamatorio": 0
  };

  answers.forEach(answer => {
    const text = answer.answer.toLowerCase();
    
    // Pregunta 1: ¿Qué área de tu salud te preocupa más?
    if (text.includes('glucosa') || text.includes('insulina')) {
      axisCount["Metabólico"]++;
    } else if (text.includes('digestión') || text.includes('inflamación')) {
      axisCount["Digestivo"]++;
      axisCount["Inflamatorio"]++;
    } else if (text.includes('hormonas') || text.includes('peso')) {
      axisCount["Metabólico"]++;
    } else if (text.includes('estrés') || text.includes('sueño')) {
      axisCount["Estrés"]++;
    }
    
    // Pregunta 2: ¿Qué describe mejor tu estado actual?
    if (text.includes('azúcar') || text.includes('estable')) {
      axisCount["Metabólico"]++;
    } else if (text.includes('antojos') || text.includes('carbohidratos')) {
      axisCount["Metabólico"]++;
    } else if (text.includes('inflamación') || text.includes('digestiva')) {
      axisCount["Digestivo"]++;
    } else if (text.includes('cansado') || text.includes('duerma')) {
      axisCount["Estrés"]++;
    }
    
    // Pregunta 3: ¿Qué te gustaría lograr?
    if (text.includes('controlar') || text.includes('azúcar')) {
      axisCount["Metabólico"]++;
    } else if (text.includes('revertir') || text.includes('diabetes')) {
      axisCount["Metabólico"]++;
    } else if (text.includes('inflamación') || text.includes('cansancio')) {
      axisCount["Inflamatorio"]++;
    } else if (text.includes('energía') || text.includes('hormonal')) {
      axisCount["Estrés"]++;
    }
  });

  console.log("Axis counts:", axisCount);

  // Sort by count
  const sorted = Object.entries(axisCount)
    .sort((a, b) => b[1] - a[1]);

  const topAxis = sorted[0][0];
  const topCount = sorted[0][1];
  const secondAxis = sorted[1][0];
  const secondCount = sorted[1][1];

  // If there's a tie or close match, create combined pattern
  if (topCount === secondCount && topCount > 0) {
    const patronKey = getCombinedPatternKey(topAxis, secondAxis);
    return loadPatronContent(patronKey);
  } else {
    const patronKey = getSinglePatternKey(topAxis);
    return loadPatronContent(patronKey);
  }
}

function getCombinedPatternKey(axis1: string, axis2: string): string {
  const pair = [axis1, axis2].sort().join("-");
  
  const combinedPatterns: Record<string, string> = {
    "Digestivo-Metabólico": "🩸 Metabólico–Digestivo",
    "Inflamatorio-Metabólico": "🩸 Metabólico–Inflamatorio",
    "Digestivo-Inflamatorio": "💩 Digestivo–Inflamatorio",
    "Estrés-Metabólico": "🩸 Metabólico–Estrés",
    "Digestivo-Estrés": "💩 Digestivo–Estrés",
    "Estrés-Inflamatorio": "🔥 Estrés–Inflamatorio"
  };
  
  return combinedPatterns[pair] || getSinglePatternKey(axis1);
}

function getSinglePatternKey(axisName: string): string {
  switch(axisName) {
    case "Metabólico":
      return "🩸 Metabólico";
    case "Digestivo":
      return "💩 Digestivo";
    case "Estrés":
      return "🌙 Estrés";
    case "Inflamatorio":
      return "🔥 Inflamatorio";
    default:
      return "🩸 Metabólico";
  }
}

function loadPatronContent(patronKey: string): PatronResult {
  const patronesContent: Record<string, PatronResult> = {
    "🩸 Metabólico": {
      patron: "🩸 Metabólico",
      descripcion: "Tu cuerpo busca equilibrio. El patrón metabólico indica una sobrecarga de glucosa o estrés energético.",
      recomendaciones: [
        "1️⃣ Reduce azúcares ocultos y alimentos procesados.",
        "2️⃣ Prioriza proteínas limpias y grasas saludables.",
        "3️⃣ Regula tu sueño para mejorar la sensibilidad a la insulina.",
        "4️⃣ Muévete a diario, incluso 10 minutos después de comer.",
        "5️⃣ Respira profundo antes de comer: baja el cortisol."
      ],
      fraseMotivacional: 'No se trata de controlar tu glucosa, sino de enseñarle a tu cuerpo a confiar nuevamente.'
    },
    "💩 Digestivo": {
      patron: "💩 Digestivo",
      descripcion: "Tu digestión refleja tu capacidad de asimilar la vida. Este patrón indica inflamación o lentitud intestinal.",
      recomendaciones: [
        "1️⃣ Mastica hasta que los alimentos pierdan textura.",
        "2️⃣ Bebe agua tibia con limón al despertar.",
        "3️⃣ Añade alimentos amargos (rúcula, berros, diente de león).",
        "4️⃣ Evita distracciones al comer: el cuerpo digiere en calma.",
        "5️⃣ Prioriza evacuaciones tipo 3–4 en la escala de Bristol."
      ],
      fraseMotivacional: 'Si fluyes, equilibras. Si equilibras, sanas.'
    },
    "🌙 Estrés": {
      patron: "🌙 Estrés",
      descripcion: "Tu sistema nervioso está en modo defensa. Este patrón revela agotamiento o exceso de alerta.",
      recomendaciones: [
        "1️⃣ Inicia el día con respiraciones profundas o exposición a la luz natural.",
        "2️⃣ Come en calma; evita pantallas y discusiones al comer.",
        "3️⃣ Evita cafeína en exceso; sustituye por infusiones adaptogénicas.",
        "4️⃣ Camina 10 minutos al aire libre después de trabajar.",
        "5️⃣ Duerme en oscuridad total para regular melatonina y cortisol."
      ],
      fraseMotivacional: 'El estrés crónico no es una debilidad; es tu cuerpo tratando de sobrevivir. Enséñale a descansar.'
    },
    "🔥 Inflamatorio": {
      patron: "🔥 Inflamatorio",
      descripcion: "El fuego interno no siempre es visible. Este patrón señala inflamación crónica en tu organismo.",
      recomendaciones: [
        "1️⃣ Elimina gluten, lácteos y azúcar refinada durante 21 días.",
        "2️⃣ Añade antiinflamatorios naturales: cúrcuma, jengibre, omega-3.",
        "3️⃣ Hidrátate con agua natural, no bebidas azucaradas.",
        "4️⃣ Repara tu microbiota con alimentos fermentados reales.",
        "5️⃣ Respira profundo antes de comer para bajar el cortisol inflamatorio."
      ],
      fraseMotivacional: 'La inflamación es una señal de alarma, no una sentencia. Escucha y actúa.'
    },
    "🩸 Metabólico–Digestivo": {
      patron: "🩸 Metabólico–Digestivo",
      descripcion: "Tu glucosa y tu digestión están conectadas. Ambos sistemas piden equilibrio.",
      recomendaciones: [
        "1️⃣ Come proteína y fibra en cada comida para estabilizar glucosa.",
        "2️⃣ Mastica despacio; la digestión comienza en la boca.",
        "3️⃣ Evita comer en estrés: activa tu sistema parasimpático antes de comer.",
        "4️⃣ Añade probióticos naturales (kéfir, chucrut) para tu microbiota.",
        "5️⃣ Duerme 7–8 horas: el sueño repara metabolismo y digestión."
      ],
      fraseMotivacional: 'Tu digestión y tu glucosa están hablando. Escúchalas juntas.'
    },
    "🩸 Metabólico–Estrés": {
      patron: "🩸 Metabólico–Estrés",
      descripcion: "El estrés eleva tu glucosa. Tu metabolismo necesita calma.",
      recomendaciones: [
        "1️⃣ Reduce azúcares y carbohidratos refinados que amplifican el estrés.",
        "2️⃣ Come cada 3–4 horas para evitar picos de cortisol por ayuno.",
        "3️⃣ Practica respiración profunda antes de comer.",
        "4️⃣ Evita cafeína en exceso; usa adaptógenos (ashwagandha, rhodiola).",
        "5️⃣ Duerme en oscuridad total para equilibrar insulina y cortisol."
      ],
      fraseMotivacional: 'El estrés eleva tu glucosa. Calmar tu mente es sanar tu metabolismo.'
    },
    "🩸 Metabólico–Inflamatorio": {
      patron: "🩸 Metabólico–Inflamatorio",
      descripcion: "La inflamación crónica desregula tu glucosa. Ambos necesitan antiinflamación profunda.",
      recomendaciones: [
        "1️⃣ Elimina azúcares, gluten y aceites vegetales refinados.",
        "2️⃣ Añade grasas antiinflamatorias: aguacate, aceite de oliva, omega-3.",
        "3️⃣ Come alimentos reales, no procesados.",
        "4️⃣ Muévete a diario para reducir inflamación metabólica.",
        "5️⃣ Duerme profundo: la falta de sueño inflama y desregula la glucosa."
      ],
      fraseMotivacional: 'La inflamación y la glucosa están conectadas. Sanar una es sanar la otra.'
    },
    "💩 Digestivo–Estrés": {
      patron: "💩 Digestivo–Estrés",
      descripcion: "El estrés altera tu digestión. Tu intestino necesita calma.",
      recomendaciones: [
        "1️⃣ Come sentado, sin pantallas, respirando antes de cada bocado.",
        "2️⃣ Mastica hasta que los alimentos pierdan textura.",
        "3️⃣ Añade alimentos amargos para estimular digestión.",
        "4️⃣ Evita comer en modo 'apuro'; activa tu sistema parasimpático.",
        "5️⃣ Duerme profundo: el sueño repara tu intestino."
      ],
      fraseMotivacional: 'Un intestino estresado no digiere. Calma tu mente, sana tu digestión.'
    },
    "💩 Digestivo–Inflamatorio": {
      patron: "💩 Digestivo–Inflamatorio",
      descripcion: "Tu intestino está inflamado. Necesita reparación y calma.",
      recomendaciones: [
        "1️⃣ Elimina gluten, lácteos y azúcar refinada durante 21 días.",
        "2️⃣ Añade caldo de huesos para reparar tu mucosa intestinal.",
        "3️⃣ Come probióticos reales (kéfir, chucrut) y prebióticos (alcachofa, ajo).",
        "4️⃣ Mastica despacio para reducir estrés digestivo.",
        "5️⃣ Evita comer en estrés: el cortisol inflama tu intestino."
      ],
      fraseMotivacional: 'Un intestino inflamado no nutre. Repáralo con paciencia.'
    },
    "🔥 Estrés–Inflamatorio": {
      patron: "🔥 Estrés–Inflamatorio",
      descripcion: "El estrés crónico inflama todo tu cuerpo. Necesitas calma profunda.",
      recomendaciones: [
        "1️⃣ Practica respiración profunda o meditación diaria.",
        "2️⃣ Elimina alimentos proinflamatorios: azúcar, gluten, aceites refinados.",
        "3️⃣ Añade antiinflamatorios naturales: cúrcuma, jengibre, omega-3.",
        "4️⃣ Camina al aire libre para bajar cortisol.",
        "5️⃣ Duerme en oscuridad total: el sueño apaga la inflamación."
      ],
      fraseMotivacional: 'El estrés inflama. La calma repara. Elige calma.'
    }
  };

  return patronesContent[patronKey] || patronesContent["🩸 Metabólico"];
}

export default function Resultados() {
  const { toast } = useToast();
  const [patron, setPatron] = useState<PatronResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const answersData = localStorage.getItem('NM_diagnostico_simple');
    
    if (answersData) {
      try {
        const answers: Answer[] = JSON.parse(answersData);
        const result = interpretarPatronSimple(answers);
        setPatron(result);
      } catch (e) {
        console.error('Error parsing answers:', e);
        toast({
          title: "Error",
          description: "No se pudieron cargar tus respuestas. Por favor, completa el diagnóstico nuevamente.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Sin diagnóstico",
        description: "Por favor, completa el diagnóstico primero.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleSubscribe = async () => {
    setLoading(true);

    const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    
    if (!stripePublicKey) {
      toast({
        title: "Configuración pendiente",
        description: "La suscripción aún no está disponible. Por favor, contacta al administrador.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const stripe = await loadStripe(stripePublicKey);
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || 'Error creating checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error en suscripción",
        description: error instanceof Error ? error.message : "No se pudo procesar la suscripción. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!patron) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F7F3' }}>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p style={{ color: '#6F6E66' }}>Cargando tu resultado...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F7F3' }}>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Main container */}
          <div 
            className="rounded-xl p-6 md:p-8"
            style={{ 
              backgroundColor: '#FAF8F4',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}
          >
            {/* Title */}
            <h2 
              className="text-2xl md:text-3xl font-bold text-center mb-6"
              style={{ color: '#556B2F' }}
            >
              Tu Patrón Funcional Detectado
            </h2>

            {/* Pattern name */}
            <div className="text-center mb-6">
              <h3 
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: '#3A3A3A' }}
              >
                {patron.patron}
              </h3>
              <p 
                className="text-base md:text-lg"
                style={{ color: '#6F6E66' }}
              >
                {patron.descripcion}
              </p>
            </div>

            {/* Guide section */}
            <div 
              className="rounded-lg p-6 mb-6"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <h3 
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ color: '#556B2F' }}
              >
                Tu Guía Funcional Personalizada
              </h3>
              <p 
                className="mb-4 text-sm md:text-base"
                style={{ color: '#6F6E66' }}
              >
                Basado en tus respuestas, esta guía está diseñada para ayudarte a entender cómo tu cuerpo se protege...
              </p>

              {/* Recommendations */}
              <div className="space-y-2 mb-4">
                {patron.recomendaciones.map((rec, index) => (
                  <p 
                    key={index}
                    className="text-sm md:text-base"
                    style={{ color: '#3A3A3A' }}
                  >
                    {rec}
                  </p>
                ))}
              </div>

              {/* Motivational quote */}
              <div 
                className="mt-6 p-4 rounded-lg italic text-center"
                style={{ 
                  backgroundColor: '#F8F7F3',
                  borderLeft: '4px solid #A15C38'
                }}
              >
                <p style={{ color: '#6F6E66' }}>
                  💬 "{patron.fraseMotivacional}"
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div 
              className="rounded-lg p-6 text-center"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E3D9'
              }}
            >
              <h4 
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ color: '#556B2F' }}
              >
                Tu siguiente paso
              </h4>
              <p 
                className="mb-4 text-sm md:text-base"
                style={{ color: '#6F6E66' }}
              >
                Profundiza en tu transformación funcional con herramientas, planes nutricionales y seguimiento personalizado.
              </p>
              
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-white transition-all mb-3"
                style={{ 
                  backgroundColor: loading ? '#D1B9A8' : '#A15C38',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#8C4E30';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#A15C38';
                  }
                }}
                data-testid="button-suscribirse"
              >
                {loading ? 'Procesando...' : 'Suscríbete al Plan NutriMarvin ($5/mes)'}
              </button>

              <p 
                className="text-xs"
                style={{ color: '#A6A28B' }}
              >
                Cancela en cualquier momento. Tu información es 100% confidencial.
              </p>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link 
              href="/"
              className="text-sm underline"
              style={{ color: '#A15C38' }}
              data-testid="link-volver-inicio"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
