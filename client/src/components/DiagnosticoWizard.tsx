import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

type ScaleType = "frecuencia" | "intensidad" | "calidad" | "acuerdo";

interface Question {
  id: string;
  question: string;
  scaleType: ScaleType;
}

const steps = [
  {
    title: "Energía y Metabolismo",
    questions: [
      { id: "energia_estable", question: "¿Sueles sentirte con energía estable durante el día?", scaleType: "calidad" as ScaleType },
      { id: "antojos", question: "¿Tienes antojos frecuentes de azúcar o carbohidratos?", scaleType: "frecuencia" as ScaleType },
      { id: "cansancio_comida", question: "¿Notas cansancio o sueño después de comer?", scaleType: "frecuencia" as ScaleType },
      { id: "peso", question: "¿Te cuesta bajar de peso o mantenerlo estable?", scaleType: "acuerdo" as ScaleType },
      { id: "sueno_horas", question: "¿Duermes al menos 7 horas la mayoría de las noches?", scaleType: "frecuencia" as ScaleType }
    ]
  },
  {
    title: "Digestión y Eliminación",
    questions: [
      { id: "evacuaciones", question: "¿Tienes evacuaciones diarias y sin esfuerzo?", scaleType: "frecuencia" as ScaleType },
      { id: "gases", question: "¿Sueles tener gases, inflamación o sensación de pesadez?", scaleType: "frecuencia" as ScaleType },
      { id: "apetito_emocional", question: "¿Tu apetito cambia según tu estado emocional?", scaleType: "frecuencia" as ScaleType },
      { id: "digestion_lenta", question: "¿Sientes que tu digestión es lenta o irregular?", scaleType: "acuerdo" as ScaleType },
      { id: "agua_alimentos", question: "¿Consumes suficiente agua y alimentos naturales cada día?", scaleType: "frecuencia" as ScaleType }
    ]
  },
  {
    title: "Estrés y Sueño",
    questions: [
      { id: "despertar_tension", question: "¿Sueles despertar con tensión o pensamientos acelerados?", scaleType: "frecuencia" as ScaleType },
      { id: "sueno_descanso", question: "¿Duermes bien y te levantas descansado/a?", scaleType: "calidad" as ScaleType },
      { id: "cuerpo_estres", question: "¿Notas que tu digestión o tu piel cambian cuando estás estresado/a?", scaleType: "acuerdo" as ScaleType },
      { id: "alerta", question: "¿Sientes que tu cuerpo está en alerta o que te cuesta relajarte?", scaleType: "frecuencia" as ScaleType },
      { id: "calma", question: "¿Tienes momentos de calma o respiración consciente durante el día?", scaleType: "frecuencia" as ScaleType }
    ]
  }
];

const scaleLabels: Record<ScaleType, string[]> = {
  frecuencia: ["Nunca", "A veces", "La mayoría de los días", "Casi siempre", "Siempre"],
  intensidad: ["Muy leve", "Leve", "Moderada", "Alta", "Muy alta"],
  calidad: ["Muy baja", "Baja", "Promedio", "Buena", "Excelente"],
  acuerdo: ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]
};

export default function DiagnosticoWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [, setLocation] = useLocation();

  const currentStep = steps[currentStepIndex];
  const totalQuestions = steps.reduce((sum, step) => sum + step.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Save answers to localStorage and navigate to results
      localStorage.setItem('respuestasNutriMarvin', JSON.stringify(answers));
      setLocation("/resultados");
    }
  };

  const allCurrentQuestionsAnswered = currentStep.questions.every(
    q => answers[q.id] !== undefined
  );

  return (
    <div className="space-y-6 max-w-[700px] mx-auto">
      {/* Step Header */}
      <div className="text-center mb-6">
        <p className="text-sm font-medium" style={{ color: '#C47A53' }}>
          Paso {currentStepIndex + 1} de {steps.length} — {currentStep.title}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm" style={{ color: '#7A7A6F' }}>
          <span>{answeredCount} de {totalQuestions} preguntas</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E6DB' }}>
          <div 
            className="h-full transition-all duration-500" 
            style={{ 
              backgroundColor: '#6B7041', 
              width: `${progress}%` 
            }} 
          />
        </div>
      </div>

      {/* Questions Container */}
      <div 
        className="rounded-xl p-6 md:p-8 space-y-8"
        style={{ 
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
        }}
      >
        {currentStep.questions.map((question, index) => {
          const labels = scaleLabels[question.scaleType];
          return (
            <div key={question.id} className="space-y-4">
              <p className="text-base md:text-lg font-medium" style={{ color: '#3A3A35' }}>
                {index + 1}. {question.question}
              </p>
              
              {/* Scale Options */}
              <div className="flex flex-wrap justify-center gap-2">
                {labels.map((label, idx) => {
                  const value = idx + 1;
                  return (
                    <button
                      key={value}
                      onClick={() => handleAnswer(question.id, value)}
                      className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl transition-all duration-200 hover:scale-105 min-w-[85px] md:min-w-[95px] text-center"
                      style={{
                        backgroundColor: answers[question.id] === value ? '#F9F7F2' : '#FAFAF8',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: answers[question.id] === value ? '#6B7041' : '#E8E6DB'
                      }}
                      data-testid={`scale-${question.id}-${value}`}
                    >
                      <span className="text-xs leading-tight" style={{ color: '#7A7A6F' }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Next Button */}
        <div className="pt-6">
          <Button
            onClick={handleNext}
            disabled={!allCurrentQuestionsAnswered}
            className="w-full rounded-xl font-medium text-white py-6 transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: currentStepIndex === steps.length - 1 ? '#C47A53' : '#6B7041'
            }}
            data-testid="button-siguiente-paso"
          >
            {currentStepIndex === steps.length - 1 ? 'Ver mis resultados' : 'Siguiente'} 
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-xs text-center pt-4" style={{ color: '#999999' }}>
        Este diagnóstico no sustituye orientación médica. Su propósito es educativo y personalizado.
      </p>
    </div>
  );
}
