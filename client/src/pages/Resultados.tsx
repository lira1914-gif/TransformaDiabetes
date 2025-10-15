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
  // Convert answers to array in order (questions 1-15)
  const questionIds = [
    // Step 1: Metabolismo
    "energia_estable", "antojos", "cansancio_comida", "peso", "sueno_horas",
    // Step 2: Digestión
    "evacuaciones", "gases", "apetito_emocional", "digestion_lenta", "agua_alimentos",
    // Step 3: Estrés y Sueño
    "despertar_tension", "sueno_descanso", "cuerpo_estres", "alerta", "calma"
  ];

  // Questions that are negatively phrased (higher value = worse health, need inversion)
  const negativeQuestions = new Set([
    "antojos", "cansancio_comida", "peso", // Step 1
    "gases", "apetito_emocional", "digestion_lenta", // Step 2
    "despertar_tension", "cuerpo_estres", "alerta" // Step 3
  ]);

  let scoreMetabolico = 0;
  let scoreDigestivo = 0;
  let scoreEstres = 0;

  questionIds.forEach((id, i) => {
    let valor = answers[id] || 3; // Default to 3 if missing
    
    // Invert negatively phrased questions (6 - valor converts scale)
    if (negativeQuestions.has(id)) {
      valor = 6 - valor;
    }
    
    if (i < 5) scoreMetabolico += valor;      // questions 1-5
    else if (i < 10) scoreDigestivo += valor; // questions 6-10
    else scoreEstres += valor;                // questions 11-15
  });

  // The pattern with the LOWEST score is the dominant one (area needing most attention)
  const minScore = Math.min(scoreMetabolico, scoreDigestivo, scoreEstres);
  
  console.log("Scores after inversion:", { scoreMetabolico, scoreDigestivo, scoreEstres, minScore });
  
  if (minScore === scoreMetabolico) {
    return {
      patron: "🩸 Patrón Metabólico",
      descripcion: "Tu cuerpo muestra señales de energía irregular o picos de glucosa. Este patrón se asocia con cansancio postcomida, antojos o dificultad para mantener el peso.",
      recomendaciones: [
        "Desayuna con proteína y fibra para evitar picos de azúcar.",
        "Evita comer distraído o en estrés.",
        "Camina 10 minutos después de las comidas para mejorar sensibilidad a la insulina."
      ],
      aspectoPositivo: "Has identificado tus patrones metabólicos. Reconocer estos ciclos es el primer paso hacia la regulación natural de tu glucosa."
    };
  } else if (minScore === scoreDigestivo) {
    return {
      patron: "💩 Patrón Digestivo",
      descripcion: "Tu cuerpo muestra señales de digestión lenta o eliminación irregular. Este patrón suele reflejar sobrecarga intestinal o dificultad para eliminar toxinas.",
      recomendaciones: [
        "Prioriza comidas ricas en vegetales y agua tibia en ayunas.",
        "Evita comer con prisa; mastica conscientemente.",
        "Usa hierbas amargas o té digestivo después de comer."
      ],
      aspectoPositivo: "Has reconocido las señales digestivas de tu cuerpo. Atender tu sistema digestivo es fundamental para la absorción de nutrientes y la regulación metabólica."
    };
  } else {
    return {
      patron: "🌙 Patrón de Estrés y Sueño",
      descripcion: "Tu cuerpo muestra señales de estrés sostenido o sueño superficial. Este patrón impacta directamente la regulación hormonal y la glucosa.",
      recomendaciones: [
        "Evita pantallas 1 hora antes de dormir.",
        "Realiza 3 respiraciones profundas al despertar y antes de dormir.",
        "Incluye fuentes de magnesio o alimentos ricos en triptófano."
      ],
      aspectoPositivo: "Has conectado con el impacto del estrés en tu salud. Gestionar el sueño y la calma es clave para la reversión metabólica."
    };
  }
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
