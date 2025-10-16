import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PatronResult {
  patron: string;
  descripcion: string;
  recomendaciones: string[];
  fraseMotivacional: string;
}

function interpretarPatron(answers: Record<string, number>): PatronResult {
  // Declarative question → axis mapping with weights
  const questionAxisMap: Record<string, { axis: string[], invert: boolean }> = {
    // Metabólico questions
    "energia_estable": { axis: ["Metabólico"], invert: false },
    "antojos": { axis: ["Metabólico"], invert: true },
    "cansancio_comida": { axis: ["Metabólico", "Inflamatorio"], invert: true },
    "peso": { axis: ["Metabólico", "Inflamatorio"], invert: true },
    "sueno_horas": { axis: ["Metabólico", "Estrés"], invert: false },
    
    // Digestivo questions
    "evacuaciones": { axis: ["Digestivo"], invert: false },
    "gases": { axis: ["Digestivo", "Inflamatorio"], invert: true },
    "apetito_emocional": { axis: ["Digestivo", "Estrés"], invert: true },
    "digestion_lenta": { axis: ["Digestivo"], invert: true },
    "agua_alimentos": { axis: ["Digestivo"], invert: false },
    
    // Estrés questions
    "despertar_tension": { axis: ["Estrés"], invert: true },
    "sueno_descanso": { axis: ["Estrés"], invert: false },
    "cuerpo_estres": { axis: ["Estrés", "Inflamatorio"], invert: true },
    "alerta": { axis: ["Estrés"], invert: true },
    "calma": { axis: ["Estrés"], invert: false }
  };

  // Initialize axis accumulators
  const axisScores: Record<string, { sum: number, count: number }> = {
    "Metabólico": { sum: 0, count: 0 },
    "Digestivo": { sum: 0, count: 0 },
    "Estrés": { sum: 0, count: 0 },
    "Inflamatorio": { sum: 0, count: 0 }
  };

  // Process each question
  Object.keys(questionAxisMap).forEach((questionId) => {
    const config = questionAxisMap[questionId];
    const rawValue = answers[questionId] ?? 3; // Default to midpoint if missing
    
    let valor = rawValue;
    if (config.invert) {
      valor = 6 - rawValue;
    }
    
    // Add to each relevant axis
    config.axis.forEach(axisName => {
      axisScores[axisName].sum += valor;
      axisScores[axisName].count += 1;
    });
  });

  // Calculate normalized averages
  const scoreMetabolico = axisScores["Metabólico"].count > 0 
    ? Math.round(axisScores["Metabólico"].sum / axisScores["Metabólico"].count) 
    : 3;
  const scoreDigestivo = axisScores["Digestivo"].count > 0 
    ? Math.round(axisScores["Digestivo"].sum / axisScores["Digestivo"].count) 
    : 3;
  const scoreEstres = axisScores["Estrés"].count > 0 
    ? Math.round(axisScores["Estrés"].sum / axisScores["Estrés"].count) 
    : 3;
  const scoreInflamatorio = axisScores["Inflamatorio"].count > 0 
    ? Math.round(axisScores["Inflamatorio"].sum / axisScores["Inflamatorio"].count) 
    : 3;

  console.log("Scores after inversion:", { scoreMetabolico, scoreDigestivo, scoreEstres, scoreInflamatorio });

  // Sort axes by score (lowest = needs most attention)
  const scores = [
    { name: "Metabólico", value: scoreMetabolico },
    { name: "Digestivo", value: scoreDigestivo },
    { name: "Estrés", value: scoreEstres },
    { name: "Inflamatorio", value: scoreInflamatorio }
  ].sort((a, b) => a.value - b.value);

  const threshold = 2; // Threshold for combined patterns (matches user specification)
  const lowest = scores[0].value;
  const secondLowest = scores[1].value;
  
  // Check if two axes are within threshold (combined pattern)
  const isCombined = Math.abs(lowest - secondLowest) <= threshold;
  
  let patronKey = "";
  
  if (isCombined) {
    // Combined pattern - use first two lowest axes
    const axis1 = scores[0].name;
    const axis2 = scores[1].name;
    patronKey = getCombinedPatternKey(axis1, axis2);
  } else {
    // Single dominant pattern
    patronKey = getSinglePatternKey(scores[0].name);
  }

  console.log("Patrón detectado:", patronKey);
  return loadPatronContent(patronKey);
}

function getCombinedPatternKey(axis1: string, axis2: string): string {
  // Normalize order for lookup
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
        "5️⃣ Cierra el día con una pausa de gratitud o journaling."
      ],
      fraseMotivacional: 'Tu cuerpo no te sabotea, te está protegiendo.'
    },
    "🔥 Inflamatorio": {
      patron: "🔥 Inflamatorio",
      descripcion: "Tu cuerpo está tratando de reparar algo. Este patrón muestra inflamación crónica o sobrecarga inmunológica.",
      recomendaciones: [
        "1️⃣ Reduce ultraprocesados y aceites refinados.",
        "2️⃣ Aumenta consumo de omega-3, cúrcuma y vegetales coloridos.",
        "3️⃣ Duerme 7–8 horas continuas.",
        "4️⃣ Practica pausas conscientes durante el día.",
        "5️⃣ Revisa tu digestión: si no eliminas, no reparas."
      ],
      fraseMotivacional: 'La inflamación no es el problema. Es tu cuerpo pidiendo calma.'
    },
    "🩸 Metabólico–Digestivo": {
      patron: "🩸 Metabólico–Digestivo",
      descripcion: "Cuando el metabolismo y la digestión se enlazan, hay resistencia a la insulina y estreñimiento funcional.",
      recomendaciones: [
        "1️⃣ Reduce azúcares y mejora evacuaciones.",
        "2️⃣ Incluye fibra natural, magnesio y amargos digestivos.",
        "3️⃣ Camina tras las comidas para activar la motilidad intestinal.",
        "4️⃣ Cena temprano y duerme antes de las 11 p.m.",
        "5️⃣ Usa respiraciones profundas antes de comer."
      ],
      fraseMotivacional: 'Sin digestión no hay glucosa estable.'
    },
    "🩸 Metabólico–Estrés": {
      patron: "🩸 Metabólico–Estrés",
      descripcion: "El exceso de alerta eleva tu azúcar incluso sin comer. Aquí el cuerpo prioriza sobrevivir, no sanar.",
      recomendaciones: [
        "1️⃣ Baja la carga digital 2 h antes de dormir.",
        "2️⃣ Incluye comidas con grasa y proteína para estabilidad.",
        "3️⃣ Haz pausas activas cada 2 h para regular cortisol.",
        "4️⃣ Evita ayunos prolongados sin descanso suficiente.",
        "5️⃣ Prioriza calma antes que productividad."
      ],
      fraseMotivacional: 'Tu cuerpo no necesita control, necesita descanso.'
    },
    "🩸 Metabólico–Inflamatorio": {
      patron: "🩸 Metabólico–Inflamatorio",
      descripcion: "Cuando hay glucosa alta y dolor articular o hinchazón, hay inflamación por resistencia a la insulina.",
      recomendaciones: [
        "1️⃣ Reduce panes, frituras y azúcar líquida.",
        "2️⃣ Aumenta verduras, omega-3 y agua.",
        "3️⃣ Descansa más: el cuerpo repara dormido.",
        "4️⃣ Muévete suave, no en exceso.",
        "5️⃣ Revisa tu digestión diaria."
      ],
      fraseMotivacional: 'La inflamación y el azúcar hablan el mismo idioma.'
    },
    "💩 Digestivo–Estrés": {
      patron: "💩 Digestivo–Estrés",
      descripcion: "El intestino y el sistema nervioso están conectados. Este patrón refleja ansiedad digestiva o nudo abdominal.",
      recomendaciones: [
        "1️⃣ Evita comer apurado o en conflicto.",
        "2️⃣ Añade alimentos cocidos y caldos digestivos.",
        "3️⃣ Usa pausas de respiración 3 min antes de comer.",
        "4️⃣ Evita cafeína con el estómago vacío.",
        "5️⃣ Prioriza conexión social y descanso."
      ],
      fraseMotivacional: 'Tu intestino escucha tus pensamientos.'
    },
    "💩 Digestivo–Inflamatorio": {
      patron: "💩 Digestivo–Inflamatorio",
      descripcion: "Si hay hinchazón, gases y cansancio, el cuerpo acumula residuos no eliminados.",
      recomendaciones: [
        "1️⃣ Revisa tu evacuación diaria (tipo 3–4 Bristol).",
        "2️⃣ Reduce gluten, lácteos y ultraprocesados.",
        "3️⃣ Añade probióticos naturales (chucrut, kéfir).",
        "4️⃣ Bebe agua tibia durante el día.",
        "5️⃣ Duerme bien para regenerar el intestino."
      ],
      fraseMotivacional: 'El intestino inflamado es un cuerpo en alerta.'
    },
    "🔥 Estrés–Inflamatorio": {
      patron: "🔥 Estrés–Inflamatorio",
      descripcion: "El estrés perpetúa la inflamación y agota las glándulas suprarrenales.",
      recomendaciones: [
        "1️⃣ Evita multitarea, crea rutinas simples.",
        "2️⃣ Consume alimentos antiinflamatorios.",
        "3️⃣ Practica respiración o caminata diaria.",
        "4️⃣ Evita pantallas 1 h antes de dormir.",
        "5️⃣ Suplementa magnesio o infusiones relajantes."
      ],
      fraseMotivacional: 'La calma también es medicina.'
    }
  };

  return patronesContent[patronKey] || patronesContent["🩸 Metabólico"];
}

export default function Resultados() {
  const [, setLocation] = useLocation();
  const [resultado, setResultado] = useState<PatronResult | null>(null);

  useEffect(() => {
    // Get answers from localStorage
    const storedAnswers = localStorage.getItem('respuestasNutriMarvin');
    
    if (!storedAnswers) {
      // Redirect to diagnostico if no answers found
      setLocation("/diagnostico");
      return;
    }

    try {
      const answers = JSON.parse(storedAnswers);
      const patron = interpretarPatron(answers);
      setResultado(patron);
      console.log("Patrón interpretado:", patron);
    } catch (error) {
      console.error("Error parsing answers:", error);
      setLocation("/diagnostico");
    }
  }, [setLocation]);

  if (!resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F2' }}>
        <p style={{ color: '#6B7041' }}>Cargando resultados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      <main className="flex-1 py-12 px-6">
        <section className="text-center max-w-4xl mx-auto">
          <h2 
            id="tituloPatron" 
            className="text-2xl font-semibold mb-4" 
            style={{ color: '#6B7041' }}
          >
            {resultado.patron}
          </h2>
          
          <p 
            id="descripcionPatron" 
            className="max-w-2xl mx-auto mb-8" 
            style={{ color: '#6B635A' }}
          >
            {resultado.descripcion}
          </p>

          <div 
            className="rounded-lg shadow-md p-6 max-w-2xl mx-auto text-left"
            style={{ backgroundColor: '#F7F5F0' }}
          >
            <h3 className="font-bold mb-2" style={{ color: '#6B7041' }}>
              🌿 Recomendaciones Iniciales
            </h3>
            <ul id="recomendaciones" className="list-disc pl-6 space-y-2" style={{ color: '#4A4A4A' }}>
              {resultado.recomendaciones.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 max-w-2xl mx-auto">
            <p 
              id="fraseMotivacional" 
              className="text-center italic text-lg"
              style={{ color: '#C77851' }}
            >
              💬 "{resultado.fraseMotivacional}"
            </p>
          </div>

          {resultado && resultado.patron && (
            <div id="bloqueGuia" className="mt-8">
              <Link 
                href="/guia"
                className="inline-block px-6 py-3 rounded-md text-white font-medium transition"
                style={{ backgroundColor: '#6B7041' }}
                data-testid="button-descargar-guia"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#596036'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6B7041'}
              >
                Descargar mi Guía Funcional
              </Link>
            </div>
          )}

          {/* Subscription CTA */}
          <div className="mt-12 max-w-2xl mx-auto rounded-lg shadow-md p-8" style={{ backgroundColor: '#F7F5F0' }}>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#6B7041' }}>
              Suscríbete a NutriMarvin Funcional
            </h3>
            <p className="mb-6" style={{ color: '#6B635A' }}>
              Accede a técnicas guiadas, recetas funcionales y seguimiento mensual por solo $5.
            </p>
            <button
              className="px-6 py-3 rounded-md text-white font-medium transition"
              style={{ backgroundColor: '#C77851' }}
              data-testid="button-suscribirse"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B3663F'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C77851'}
            >
              Suscribirme ahora
            </button>
          </div>

          {/* Privacy Footer */}
          <div className="mt-12 max-w-2xl mx-auto text-center p-6 rounded-lg" style={{ backgroundColor: '#E8E4DC' }}>
            <p className="font-bold mb-2" style={{ color: '#6B7041' }}>
              Privacidad y Confidencialidad
            </p>
            <p className="text-sm" style={{ color: '#6B635A' }}>
              La información que compartes en NutriMarvin es confidencial.
              <br />
              No vendemos ni compartimos tus datos. Usamos protocolos seguros para proteger tu información.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
