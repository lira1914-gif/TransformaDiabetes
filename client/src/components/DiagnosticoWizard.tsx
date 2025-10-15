import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface Question {
  id: string;
  question: string;
}

const steps = [
  {
    title: "Energía y Metabolismo",
    questions: [
      { id: "energia_estable", question: "¿Sueles sentirte con energía estable durante el día?" },
      { id: "antojos", question: "¿Tienes antojos frecuentes de azúcar o carbohidratos?" },
      { id: "cansancio_comida", question: "¿Notas cansancio después de comer?" },
      { id: "peso", question: "¿Te cuesta bajar de peso o lo recuperas fácilmente?" },
      { id: "sueno_horas", question: "¿Duermes al menos 7 horas la mayoría de las noches?" }
    ]
  },
  {
    title: "Digestión y Eliminación",
    questions: [
      { id: "evacuaciones", question: "¿Tienes evacuaciones diarias sin esfuerzo?" },
      { id: "gases", question: "¿Sueles tener gases, inflamación o sensación de pesadez?" },
      { id: "apetito_animo", question: "¿Tu apetito cambia según tu estado de ánimo?" },
      { id: "digestion_lenta", question: "¿Sientes que tu digestión es lenta o irregular?" },
      { id: "agua_alimentos", question: "¿Consumes agua suficiente y alimentos naturales cada día?" }
    ]
  },
  {
    title: "Estrés e Inflamación",
    questions: [
      { id: "despertar_tension", question: "¿Sueles despertar con tensión o preocupación?" },
      { id: "sueno_descanso", question: "¿Duermes bien y te levantas descansado?" },
      { id: "cuerpo_estres", question: "¿Tu piel, articulaciones o digestión cambian cuando estás estresado?" },
      { id: "alerta", question: "¿Sientes que tu cuerpo está en alerta o que \"no logra relajarse\"?" }
    ]
  }
];

const scaleOptions = [
  { value: 1, emoji: "😴", label: "Muy bajo" },
  { value: 2, emoji: "😐", label: "Bajo" },
  { value: 3, emoji: "🙂", label: "Promedio" },
  { value: 4, emoji: "😊", label: "Bueno" },
  { value: 5, emoji: "🔥", label: "Excelente" }
];

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
        {currentStep.questions.map((question, index) => (
          <div key={question.id} className="space-y-4">
            <p className="text-base md:text-lg font-medium" style={{ color: '#3A3A35' }}>
              {index + 1}. {question.question}
            </p>
            
            {/* Likert Scale */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {scaleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className="flex flex-col items-center p-3 md:p-4 rounded-xl transition-all duration-200 hover:scale-105 min-w-[70px] md:min-w-[80px]"
                  style={{
                    backgroundColor: answers[question.id] === option.value ? '#F9F7F2' : '#FAFAF8',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: answers[question.id] === option.value ? '#6B7041' : '#E8E6DB'
                  }}
                  data-testid={`scale-${question.id}-${option.value}`}
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs text-center" style={{ color: '#7A7A6F' }}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

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
