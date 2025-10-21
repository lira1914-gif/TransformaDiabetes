import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface PatronResult {
  patron: string;
  descripcion: string;
  recomendaciones: string[];
}

interface Answer {
  questionIndex: number;
  answer: string;
}

function interpretarPatronSimple(answers: Answer[]): PatronResult {
  const axisCount: Record<string, number> = {
    "Metabólico": 0,
    "Digestivo": 0,
    "Estrés": 0,
    "Inflamatorio": 0
  };

  answers.forEach(answer => {
    const text = answer.answer.toLowerCase();
    
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
    
    if (text.includes('azúcar') || text.includes('estable')) {
      axisCount["Metabólico"]++;
    } else if (text.includes('antojos') || text.includes('carbohidratos')) {
      axisCount["Metabólico"]++;
    } else if (text.includes('inflamación') || text.includes('digestiva')) {
      axisCount["Digestivo"]++;
    } else if (text.includes('cansado') || text.includes('duerma')) {
      axisCount["Estrés"]++;
    }
    
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

  const sorted = Object.entries(axisCount)
    .sort((a, b) => b[1] - a[1]);

  const topAxis = sorted[0][0];
  const topCount = sorted[0][1];
  const secondAxis = sorted[1][0];
  const secondCount = sorted[1][1];

  // If there's a tie, return combined pattern
  if (topCount === secondCount && topCount > 0) {
    const combinedKey = getCombinedPatternKey(topAxis, secondAxis);
    return loadPatronContent(combinedKey);
  }
  
  return loadPatronContent(topAxis);
}

function getCombinedPatternKey(axis1: string, axis2: string): string {
  const pair = [axis1, axis2].sort().join("-");
  
  const combinedPatterns: Record<string, string> = {
    "Digestivo-Metabólico": "Metabólico-Digestivo",
    "Inflamatorio-Metabólico": "Metabólico-Inflamatorio",
    "Digestivo-Inflamatorio": "Digestivo-Inflamatorio",
    "Estrés-Metabólico": "Metabólico-Estrés",
    "Digestivo-Estrés": "Digestivo-Estrés",
    "Estrés-Inflamatorio": "Estrés-Inflamatorio"
  };
  
  return combinedPatterns[pair] || axis1;
}

function loadPatronContent(axisName: string): PatronResult {
  const patronesContent: Record<string, PatronResult> = {
    "Metabólico": {
      patron: "🩸 Patrón Metabólico",
      descripcion: "Tu cuerpo busca equilibrio. El patrón metabólico indica una sobrecarga de glucosa o estrés energético.",
      recomendaciones: [
        "Reduce azúcares ocultos y alimentos procesados.",
        "Incluye grasa, fibra y proteína en cada comida para estabilizar el azúcar.",
        "Muévete después de comer (10 minutos bastan).",
        "Regula el sueño y el estrés — tu cuerpo no puede sanar en estado de alerta.",
        "Respira profundo antes de comer para activar tu sistema de calma."
      ]
    },
    "Digestivo": {
      patron: "💩 Patrón Digestivo",
      descripcion: "Tu digestión refleja tu capacidad de asimilar la vida. Este patrón indica inflamación o lentitud intestinal.",
      recomendaciones: [
        "Mastica hasta que los alimentos pierdan textura.",
        "Bebe agua tibia con limón al despertar.",
        "Añade alimentos amargos (rúcula, berros, diente de león).",
        "Evita distracciones al comer: el cuerpo digiere en calma.",
        "Prioriza evacuaciones saludables (tipo 3–4 en la escala de Bristol)."
      ]
    },
    "Estrés": {
      patron: "🌙 Patrón de Estrés",
      descripcion: "Tu sistema nervioso está en modo defensa. Este patrón revela agotamiento o exceso de alerta.",
      recomendaciones: [
        "Inicia el día con respiraciones profundas o exposición a la luz natural.",
        "Come en calma; evita pantallas y discusiones al comer.",
        "Evita cafeína en exceso; sustituye por infusiones adaptogénicas.",
        "Camina 10 minutos al aire libre después de trabajar.",
        "Duerme en oscuridad total para regular melatonina y cortisol."
      ]
    },
    "Inflamatorio": {
      patron: "🔥 Patrón Inflamatorio",
      descripcion: "El fuego interno no siempre es visible. Este patrón señala inflamación crónica en tu organismo.",
      recomendaciones: [
        "Elimina gluten, lácteos y azúcar refinada durante 21 días.",
        "Añade antiinflamatorios naturales: cúrcuma, jengibre, omega-3.",
        "Hidrátate con agua natural, no bebidas azucaradas.",
        "Repara tu microbiota con alimentos fermentados reales.",
        "Respira profundo antes de comer para bajar el cortisol inflamatorio."
      ]
    },
    "Metabólico-Digestivo": {
      patron: "🩸 Metabólico–Digestivo",
      descripcion: "Tu glucosa y tu digestión están conectadas. Ambos sistemas piden equilibrio.",
      recomendaciones: [
        "Come proteína y fibra en cada comida para estabilizar glucosa.",
        "Mastica despacio; la digestión comienza en la boca.",
        "Evita comer en estrés: activa tu sistema parasimpático antes de comer.",
        "Añade probióticos naturales (kéfir, chucrut) para tu microbiota.",
        "Duerme 7–8 horas: el sueño repara metabolismo y digestión."
      ]
    },
    "Metabólico-Estrés": {
      patron: "🩸 Metabólico–Estrés",
      descripcion: "El estrés eleva tu glucosa. Tu metabolismo necesita calma.",
      recomendaciones: [
        "Reduce azúcares y carbohidratos refinados que amplifican el estrés.",
        "Come cada 3–4 horas para evitar picos de cortisol por ayuno.",
        "Practica respiración profunda antes de comer.",
        "Evita cafeína en exceso; usa adaptógenos (ashwagandha, rhodiola).",
        "Duerme en oscuridad total para equilibrar insulina y cortisol."
      ]
    },
    "Metabólico-Inflamatorio": {
      patron: "🩸 Metabólico–Inflamatorio",
      descripcion: "La inflamación crónica desregula tu glucosa. Ambos necesitan antiinflamación profunda.",
      recomendaciones: [
        "Elimina azúcares, gluten y aceites vegetales refinados.",
        "Añade grasas antiinflamatorias: aguacate, aceite de oliva, omega-3.",
        "Come alimentos reales, no procesados.",
        "Muévete a diario para reducir inflamación metabólica.",
        "Duerme profundo: la falta de sueño inflama y desregula la glucosa."
      ]
    },
    "Digestivo-Estrés": {
      patron: "💩 Digestivo–Estrés",
      descripcion: "El estrés altera tu digestión. Tu intestino necesita calma.",
      recomendaciones: [
        "Come sentado, sin pantallas, respirando antes de cada bocado.",
        "Mastica hasta que los alimentos pierdan textura.",
        "Añade alimentos amargos para estimular digestión.",
        "Evita comer en modo 'apuro'; activa tu sistema parasimpático.",
        "Duerme profundo: el sueño repara tu intestino."
      ]
    },
    "Digestivo-Inflamatorio": {
      patron: "💩 Digestivo–Inflamatorio",
      descripcion: "Tu intestino está inflamado. Necesita reparación y calma.",
      recomendaciones: [
        "Elimina gluten, lácteos y azúcar refinada durante 21 días.",
        "Añade caldo de huesos para reparar tu mucosa intestinal.",
        "Come probióticos reales (kéfir, chucrut) y prebióticos (alcachofa, ajo).",
        "Mastica despacio para reducir estrés digestivo.",
        "Evita comer en estrés: el cortisol inflama tu intestino."
      ]
    },
    "Estrés-Inflamatorio": {
      patron: "🔥 Estrés–Inflamatorio",
      descripcion: "El estrés crónico inflama todo tu cuerpo. Necesitas calma profunda.",
      recomendaciones: [
        "Practica respiración profunda o meditación diaria.",
        "Elimina alimentos proinflamatorios: azúcar, gluten, aceites refinados.",
        "Añade antiinflamatorios naturales: cúrcuma, jengibre, omega-3.",
        "Camina al aire libre para bajar cortisol.",
        "Duerme en oscuridad total: el sueño apaga la inflamación."
      ]
    }
  };

  return patronesContent[axisName] || patronesContent["Metabólico"];
}

export default function Resultados() {
  const { toast } = useToast();
  const [patron, setPatron] = useState<PatronResult | null>(null);

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

  if (!patron) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando tu resultado...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Main Result Card */}
          <div 
            className="rounded-xl p-6 md:p-8 mb-6"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '1px solid #E6E3D9',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}
          >
            <h1 
              className="text-3xl md:text-4xl font-bold text-center mb-4"
              style={{ color: '#A15C38' }}
              data-testid="text-patron-result"
            >
              🌿 Resultado: {patron.patron}
            </h1>
            
            <p 
              className="text-center text-lg mb-8"
              style={{ color: '#3A3A3A' }}
            >
              {patron.descripcion}
            </p>

            <div className="mb-8">
              <h3 
                className="text-xl md:text-2xl font-bold mb-4"
                style={{ color: '#556B2F' }}
              >
                Tu Guía Funcional Personalizada
              </h3>
              
              <ul className="space-y-3" style={{ lineHeight: 1.7 }}>
                {patron.recomendaciones.map((rec, index) => (
                  <li 
                    key={index}
                    className="text-base"
                    style={{ color: '#3A3A3A' }}
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6" style={{ borderColor: '#E6E3D9' }}>
              <h3 
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ color: '#556B2F' }}
              >
                🌱 Tu siguiente paso
              </h3>
              <p 
                className="text-base mb-6"
                style={{ color: '#3A3A3A', lineHeight: 1.6 }}
              >
                Esta mini guía es solo el inicio. Completa tu evaluación funcional completa y recibe un plan personalizado basado en tu historial, hábitos y análisis.
              </p>
              
              <Link href="/onboarding/bienvenida-trial">
                <Button 
                  size="lg"
                  variant="default"
                  className="w-full sm:w-auto mx-auto block"
                  data-testid="button-start-trial-results"
                  style={{
                    backgroundColor: '#A15C38',
                    color: 'white'
                  }}
                >
                  Comenzar mi prueba gratuita de 7 días
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
