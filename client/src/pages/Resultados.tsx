import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PatronResult {
  patron: string;
  descripcion: string;
  recomendaciones: string[];
  aspectoPositivo: string;
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

  const threshold = 1; // Tighter threshold for combined patterns
  const lowest = scores[0].value;
  
  // Find all axes within threshold of the lowest
  const tiedAxes = scores.filter(s => Math.abs(s.value - lowest) <= threshold);
  
  let patronKey = "";
  
  if (tiedAxes.length >= 2) {
    // Combined pattern - use first two tied axes
    const axis1 = tiedAxes[0].name;
    const axis2 = tiedAxes[1].name;
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
    "Digestivo-Metabólico": "🩸 Patrón Metabólico–Digestivo",
    "Inflamatorio-Metabólico": "🩸 Patrón Metabólico–Inflamatorio",
    "Digestivo-Inflamatorio": "💩 Patrón Digestivo–Inflamatorio",
    "Estrés-Metabólico": "🌙 Patrón Estrés–Metabólico",
    "Digestivo-Estrés": "🌙 Patrón Estrés–Digestivo",
    "Estrés-Inflamatorio": "🔥 Patrón Inflamatorio–Energético"
  };
  
  return combinedPatterns[pair] || getSinglePatternKey(axis1);
}

function getSinglePatternKey(axisName: string): string {
  switch(axisName) {
    case "Metabólico":
      return "🩸 Patrón Metabólico — Glucosa en Alerta Silenciosa";
    case "Digestivo":
      return "💩 Patrón Digestivo–Estreñimiento Silencioso";
    case "Estrés":
      return "🌙 Patrón Estrés–Energético";
    case "Inflamatorio":
      return "🔥 Patrón Inflamatorio–Digestivo";
    default:
      return "🩸 Patrón Metabólico — Glucosa en Alerta Silenciosa";
  }
}

function loadPatronContent(patronKey: string): PatronResult {
  // This will be replaced with actual file loading logic
  // For now, return a placeholder structure
  const patronesContent: Record<string, PatronResult> = {
    "🩸 Patrón Metabólico — Glucosa en Alerta Silenciosa": {
      patron: "🩸 Patrón Metabólico — Glucosa en Alerta Silenciosa",
      descripcion: "Tu cuerpo ajusta su energía para protegerte del exceso. Los picos de glucosa o bajones de energía no son errores; son adaptaciones a un entorno exigente. El objetivo no es controlar, sino regular desde la raíz.",
      recomendaciones: [
        "REMOVE — Reduce ultraprocesados y periodos largos sin comer.",
        "REPLACE — Combina proteína + fibra + grasa saludable en cada comida.",
        "REPAIR — Añade magnesio, zinc y caldos naturales para soporte celular.",
        "REBALANCE — Cena temprano y camina 10 minutos postcomida.",
        "RESTORE — Duerme 7–8 horas; el descanso regula tu glucosa.",
        "REFLECT — Observa tu energía sin juicio: el cuerpo busca equilibrio."
      ],
      aspectoPositivo: "🌿 Tu glucosa no sube para dañarte, sino para protegerte del exceso de demanda."
    },
    "🩸 Patrón Metabólico–Digestivo": {
      patron: "🩸 Patrón Metabólico–Digestivo",
      descripcion: "La digestión tensa o lenta hace trabajar de más a la insulina. Cuando comes con prisa o bajo estrés, la glucosa puede elevarse aunque evites el azúcar. Calmar el intestino estabiliza tu metabolismo.",
      recomendaciones: [
        "REMOVE — Evita combinaciones pesadas (harinas + grasas + azúcar).",
        "REPLACE — Fibra soluble y amargos (rúcula, berros, apio).",
        "REPAIR — Caldos, grasas buenas y masticar 20 veces por bocado.",
        "REBALANCE — Come sentado, sin pantallas ni prisa.",
        "RESTORE — Camina 5–10 minutos tras comer para activar el flujo.",
        "REFLECT — La digestión regula más que la dieta: regula tu entorno interno."
      ],
      aspectoPositivo: "🩸 Una digestión lenta puede elevar la glucosa incluso sin comer azúcar."
    },
    "🩸 Patrón Metabólico–Inflamatorio": {
      patron: "🩸 Patrón Metabólico–Inflamatorio",
      descripcion: "La inflamación activa disminuye la eficiencia de la insulina. Tu cuerpo conserva energía para reparar tejidos; no es flojera, es protección. Bajar la carga inflamatoria estabiliza la glucosa.",
      recomendaciones: [
        "REMOVE — Disminuye azúcar, harinas y aceites refinados.",
        "REPLACE — Integra cúrcuma, jengibre y omega-3.",
        "REPAIR — Prioriza sueño antes de las 11 p. m. para reparación celular.",
        "REBALANCE — Pausas respiratorias de 2–3 minutos, 3 veces al día.",
        "RESTORE — Movimiento suave diario para drenaje linfático.",
        "REFLECT — La inflamación es lenguaje, no castigo."
      ],
      aspectoPositivo: "🔥 El cuerpo no te sabotea, te está priorizando."
    },
    "💩 Patrón Digestivo–Estreñimiento Silencioso": {
      patron: "💩 Patrón Digestivo–Estreñimiento Silencioso",
      descripcion: "Retener es una forma de protección cuando el terreno está sobrecargado. Fluir a diario reduce inflamación y estabiliza el metabolismo.",
      recomendaciones: [
        "REMOVE — Evita cenas pesadas y exceso de café.",
        "REPLACE — Agua, magnesio natural y vegetales cocidos.",
        "REPAIR — Fibra soluble (chía, linaza, avena cocida).",
        "REBALANCE — Rutina de evacuación diaria en calma.",
        "RESTORE — Caminar, estirarte y respirar activa el intestino.",
        "REFLECT — ¿Qué estás reteniendo además de desechos?"
      ],
      aspectoPositivo: "💩 Si no fluyes, acumulas; y si acumulas, el cuerpo se protege."
    },
    "💩 Patrón Digestivo–Inflamatorio": {
      patron: "💩 Patrón Digestivo–Inflamatorio",
      descripcion: "El intestino inflamado mantiene el cuerpo en modo defensa. Retirar irritantes y dar calma al sistema digestivo baja la carga inflamatoria y favorece la glucosa estable.",
      recomendaciones: [
        "REMOVE — Elimina ultraprocesados, alcohol y fritos por 30 días.",
        "REPLACE — Infusiones suaves (manzanilla, hinojo, menta).",
        "REPAIR — Caldos, gelatinas naturales y alimentos templados.",
        "REBALANCE — Ayuno nocturno de ~12 h (si no hay hipoglucemia).",
        "RESTORE — Respiración diafragmática antes de comer.",
        "REFLECT — Tu cuerpo pide alivio, no presión."
      ],
      aspectoPositivo: "🍵 Tu cuerpo no pide control, pide alivio."
    },
    "🌙 Patrón Estrés–Metabólico": {
      patron: "🌙 Patrón Estrés–Metabólico",
      descripcion: "El estrés eleva el cortisol y altera tu glucosa. No es flojera ni falta de voluntad: es fisiología en modo defensa. Bajar la carga simpática estabiliza el azúcar.",
      recomendaciones: [
        "REMOVE — Reduce cafeína y pantallas nocturnas.",
        "REPLACE — Cenas templadas y livianas (sopas, caldos).",
        "REPAIR — Magnesio por la tarde y luz natural al despertar.",
        "REBALANCE — Respiración 4-7-8 al acostarte.",
        "RESTORE — Pausas de 2 minutos, 3 veces al día.",
        "REFLECT — No puedes sanar en el mismo estado que te enfermó."
      ],
      aspectoPositivo: "🌙 El descanso es requisito metabólico, no lujo."
    },
    "🌙 Patrón Estrés–Digestivo": {
      patron: "🌙 Patrón Estrés–Digestivo",
      descripcion: "El intestino refleja tu nivel de calma. Estrés y prisa detienen el flujo digestivo y elevan la glucosa. Comer en calma reactiva el nervio vago.",
      recomendaciones: [
        "REMOVE — Evita comer de pie o con pantalla.",
        "REPLACE — Infusiones suaves y masticación consciente.",
        "REPAIR — Pausas de respiración antes de cada comida.",
        "REBALANCE — Horarios estables para comer.",
        "RESTORE — Gratitud breve antes de masticar (activa parasimpático).",
        "REFLECT — El cuerpo solo digiere en calma."
      ],
      aspectoPositivo: "🌾 Alimentarte en calma es terapia metabólica."
    },
    "🌙 Patrón Estrés–Energético": {
      patron: "🌙 Patrón Estrés–Energético",
      descripcion: "Tu energía está dirigida a sostener la alerta, no la vitalidad. Bajar la hipervigilancia libera energía para reparar y digerir.",
      recomendaciones: [
        "REMOVE — Evita noticias/inputs estresantes por la noche.",
        "REPLACE — Agua con minerales naturales (sal marina) en el día.",
        "REPAIR — Rutinas cortas de respiración o caminatas sin pantalla.",
        "REBALANCE — Límite de multitarea: bloques de enfoque + pausas.",
        "RESTORE — Micro-siestas de 10–20 minutos si lo permite tu día.",
        "REFLECT — La energía regresa cuando el cuerpo confía."
      ],
      aspectoPositivo: "🌤️ El cuerpo baja la velocidad para protegerte."
    },
    "🔥 Patrón Inflamatorio–Digestivo": {
      patron: "🔥 Patrón Inflamatorio–Digestivo",
      descripcion: "Tu intestino es el centro de la inflamación actual. Retirar irritantes y nutrir la mucosa reduce la alarma y estabiliza el metabolismo.",
      recomendaciones: [
        "REMOVE — Azúcar, ultraprocesados y alcohol.",
        "REPLACE — Antiinflamatorios naturales (cúrcuma, frutos rojos).",
        "REPAIR — Caldos, gelatinas naturales y descanso nocturno.",
        "REBALANCE — Paseos suaves diarios; evita sobreentrenar.",
        "RESTORE — Hidratación constante durante el día.",
        "REFLECT — Tu cuerpo busca reparar, no castigarte."
      ],
      aspectoPositivo: "🔥 La inflamación es un intento de reparación."
    },
    "🔥 Patrón Inflamatorio–Energético": {
      patron: "🔥 Patrón Inflamatorio–Energético",
      descripcion: "El cuerpo está cansado de sostener una inflamación prolongada. Ahorra energía para protegerte. Bajar la demanda y priorizar descanso lo devuelve a la reparación.",
      recomendaciones: [
        "REMOVE — Excesos de entrenamiento o jornadas extendidas.",
        "REPLACE — Comidas sencillas y templadas; hidrátate bien.",
        "REPAIR — Sueño profundo y luz tenue por la noche.",
        "REBALANCE — Rutinas suaves (estiramientos, caminatas).",
        "RESTORE — 3 pausas conscientes al día para bajar el eje HPA.",
        "REFLECT — El descanso también es medicina."
      ],
      aspectoPositivo: "💤 El cuerpo cura cuando descansa."
    },
    "🩸 Patrón Metabólico–Hormonal": {
      patron: "🩸 Patrón Metabólico–Hormonal",
      descripcion: "Tu cuerpo ajusta energía y ritmo hormonal. Cambios en apetito, ánimo o sueño son señales de ajuste, no de falla. Regular ritmos ayuda a estabilizar la glucosa.",
      recomendaciones: [
        "REMOVE — Evita ayunos prolongados si hay ansiedad o irritabilidad.",
        "REPLACE — Grasas buenas (aguacate, semillas, aceite de oliva).",
        "REPAIR — Exposición a luz matinal para sincronizar ritmos.",
        "REBALANCE — Come en horarios constantes (3–4 h).",
        "RESTORE — Bajar intensidad de entrenamiento si duermes mal.",
        "REFLECT — Tu energía no se pierde; se redistribuye."
      ],
      aspectoPositivo: "💫 El cuerpo prioriza seguridad antes que productividad."
    },
    "💩 Patrón Digestivo–Metabólico": {
      patron: "💩 Patrón Digestivo–Metabólico",
      descripcion: "Cuando el intestino se enlentece, la insulina también. La evacuación regular y la masticación consciente mejoran la sensibilidad a la insulina y la energía.",
      recomendaciones: [
        "REMOVE — Evita comer bajo estrés o prisa.",
        "REPLACE — Amargos naturales (rúcula, menta, diente de león).",
        "REPAIR — Grasas buenas y caldos minerales para mucosa intestinal.",
        "REBALANCE — Horario fijo para comidas y evacuación.",
        "RESTORE — Hidratación constante; agua tibia al despertar.",
        "REFLECT — La calma digestiva precede al equilibrio metabólico."
      ],
      aspectoPositivo: "🌱 La digestión tranquila es tu primer regulador de glucosa."
    },
    "💩 Patrón Digestivo–Detox Lento": {
      patron: "💩 Patrón Digestivo–Detox Lento",
      descripcion: "El hígado, intestino y piel limpian más lento bajo carga. No es debilidad: es falta de soporte. Facilitar el drenaje reduce glucosa e inflamación.",
      recomendaciones: [
        "REMOVE — Alcohol, frituras y exceso de proteína procesada.",
        "REPLACE — Verduras amargas y jugos verdes sin fruta.",
        "REPAIR — Caldos, electrolitos naturales y descanso profundo.",
        "REBALANCE — Cena liviana antes de las 8 p. m.",
        "RESTORE — Sudoración suave (caminata, baño tibio).",
        "REFLECT — Tu cuerpo limpia cuando se siente seguro."
      ],
      aspectoPositivo: "🌿 El detox real es diario, no extremo."
    },
    "🌙 Patrón Estrés–Hormonal": {
      patron: "🌙 Patrón Estrés–Hormonal",
      descripcion: "El cuerpo prioriza supervivencia: altera ritmos hormonales para protegerte. Asentar el sistema nervioso devuelve la regularidad y mejora la glucosa.",
      recomendaciones: [
        "REMOVE — Disminuye entrenamiento intenso si duermes mal.",
        "REPLACE — Comidas cálidas y regulares; evita saltarte comidas.",
        "REPAIR — Exposición matutina al sol para sincronizar ritmos.",
        "REBALANCE — Rutina nocturna sin pantallas la última hora.",
        "RESTORE — Dormir más horas el fin de semana para recuperar.",
        "REFLECT — Tu cuerpo no está roto, está priorizando seguridad."
      ],
      aspectoPositivo: "💫 La calma organiza tus hormonas."
    },
    "🔥 Patrón Inflamatorio–Metabólico": {
      patron: "🔥 Patrón Inflamatorio–Metabólico",
      descripcion: "Inflamación y glucosa se retroalimentan. Reducir picos y bajar la carga inflamatoria devuelve la sensibilidad a la insulina.",
      recomendaciones: [
        "REMOVE — Harinas refinadas y snacks frecuentes.",
        "REPLACE — Omega-3, verduras de raíz y proteínas limpias.",
        "REPAIR — Dormir 7–8 h; acostarte antes de las 11 p. m.",
        "REBALANCE — Ventanas de comida estables (evita picoteo).",
        "RESTORE — Movimiento suave y constante (no extenuante).",
        "REFLECT — El cuerpo conserva energía para cuidarte."
      ],
      aspectoPositivo: "🌿 Regular no es restringir: es darle ritmo al cuerpo."
    },
    "🔥 Patrón Inflamatorio–Estreñimiento Silencioso": {
      patron: "🔥 Patrón Inflamatorio–Estreñimiento Silencioso",
      descripcion: "Cuando el cuerpo no elimina, la inflamación aumenta. No es descuido: es un freno protector. Recuperar el flujo reduce la carga inflamatoria y estabiliza la glucosa.",
      recomendaciones: [
        "REMOVE — Exceso de lácteos, fritos y comidas nocturnas tardías.",
        "REPLACE — Fibra soluble (chía/linaza), agua tibia y amargos.",
        "REPAIR — Caldos y grasas buenas para la mucosa.",
        "REBALANCE — Horario diario para evacuar sin prisa.",
        "RESTORE — Caminar y estirarte después de las comidas.",
        "REFLECT — Soltar es parte de sanar."
      ],
      aspectoPositivo: "💧 El cuerpo no acumula por error: se protege mientras te pide ayuda."
    }
  };

  return patronesContent[patronKey] || patronesContent["🩸 Patrón Metabólico — Glucosa en Alerta Silenciosa"];
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
