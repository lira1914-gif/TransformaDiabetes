import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface Question {
  id: string;
  question: string;
  type: "radio" | "text" | "number";
  options?: { value: string; label: string }[];
}

const questions: Question[] = [
  // Metabolismo (Preguntas 1-5)
  {
    id: "energia",
    question: "¿Cómo describirías tus niveles de energía durante el día?",
    type: "radio",
    options: [
      { value: "baja", label: "Constantemente cansado/a, especialmente después de comer" },
      { value: "irregular", label: "Tengo picos y caídas de energía" },
      { value: "estable", label: "Energía estable y consistente" }
    ]
  },
  {
    id: "antojos",
    question: "¿Experimentas antojos de dulces o carbohidratos?",
    type: "radio",
    options: [
      { value: "frecuentes", label: "Sí, varias veces al día" },
      { value: "ocasionales", label: "A veces, especialmente por la tarde" },
      { value: "raros", label: "Casi nunca" }
    ]
  },
  {
    id: "glucosa",
    question: "¿Has notado síntomas de glucosa elevada? (sed excesiva, visión borrosa, micción frecuente)",
    type: "radio",
    options: [
      { value: "si", label: "Sí, con frecuencia" },
      { value: "ocasional", label: "Ocasionalmente" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "peso_abdominal",
    question: "¿Has acumulado grasa en la zona abdominal?",
    type: "radio",
    options: [
      { value: "si", label: "Sí, notablemente" },
      { value: "algo", label: "Un poco" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "hambre",
    question: "¿Cuánto tiempo puedes pasar sin comer antes de sentir hambre intensa?",
    type: "radio",
    options: [
      { value: "2horas", label: "2-3 horas o menos" },
      { value: "4horas", label: "4-5 horas" },
      { value: "6horas", label: "6+ horas sin problema" }
    ]
  },
  
  // Digestivo (Preguntas 6-10)
  {
    id: "digestion",
    question: "¿Cómo describirías tu digestión después de las comidas?",
    type: "radio",
    options: [
      { value: "pesada", label: "Pesada, con hinchazón o gases" },
      { value: "irregular", label: "A veces bien, a veces mal" },
      { value: "normal", label: "Ligera y sin molestias" }
    ]
  },
  {
    id: "evacuaciones",
    question: "¿Cómo son tus evacuaciones intestinales?",
    type: "radio",
    options: [
      { value: "irregulares", label: "Irregulares (estreñimiento o diarrea)" },
      { value: "ocasional", label: "Mayormente regulares" },
      { value: "regulares", label: "Regulares y sin esfuerzo" }
    ]
  },
  {
    id: "reflujo",
    question: "¿Experimentas acidez o reflujo?",
    type: "radio",
    options: [
      { value: "frecuente", label: "Sí, con frecuencia" },
      { value: "ocasional", label: "Ocasionalmente" },
      { value: "nunca", label: "Nunca" }
    ]
  },
  {
    id: "alimentos",
    question: "¿Has notado que ciertos alimentos te caen mal?",
    type: "radio",
    options: [
      { value: "varios", label: "Sí, varios alimentos" },
      { value: "algunos", label: "Solo algunos" },
      { value: "ninguno", label: "No he notado ninguno" }
    ]
  },
  {
    id: "saciedad",
    question: "¿Te sientes satisfecho/a después de comer?",
    type: "radio",
    options: [
      { value: "nunca", label: "No, siempre quiero seguir comiendo" },
      { value: "veces", label: "A veces sí, a veces no" },
      { value: "siempre", label: "Sí, me siento satisfecho/a" }
    ]
  },
  
  // Inflamatorio (Preguntas 11-14)
  {
    id: "dolor",
    question: "¿Experimentas dolor en articulaciones o músculos?",
    type: "radio",
    options: [
      { value: "frecuente", label: "Sí, frecuentemente" },
      { value: "ocasional", label: "Ocasionalmente" },
      { value: "nunca", label: "Raramente o nunca" }
    ]
  },
  {
    id: "piel",
    question: "¿Tienes problemas de piel? (acné, eczema, sequedad)",
    type: "radio",
    options: [
      { value: "si", label: "Sí, regularmente" },
      { value: "ocasional", label: "Ocasionalmente" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "sueno",
    question: "¿Cómo duermes por las noches?",
    type: "radio",
    options: [
      { value: "mal", label: "Mal, me despierto varias veces" },
      { value: "irregular", label: "Variable, algunos días bien" },
      { value: "bien", label: "Bien, descanso profundamente" }
    ]
  },
  {
    id: "recuperacion",
    question: "¿Qué tan rápido te recuperas de enfermedades o heridas?",
    type: "radio",
    options: [
      { value: "lento", label: "Lento, tardo más de lo normal" },
      { value: "normal", label: "Normal" },
      { value: "rapido", label: "Rápido" }
    ]
  }
];

export default function DiagnosticoWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [, setLocation] = useLocation();

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLocation("/resultados");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const isAnswered = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== "";

  // Determine section
  const getSection = () => {
    if (currentStep < 5) return { name: "Metabolismo", subtitle: "Preguntas sobre tu energía, glucosa y hábitos alimentarios" };
    if (currentStep < 10) return { name: "Digestivo", subtitle: "Preguntas sobre tu digestión y absorción de nutrientes" };
    return { name: "Inflamatorio", subtitle: "Preguntas sobre inflamación y recuperación" };
  };

  const section = getSection();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center mb-6">
        <p className="text-sm font-medium" style={{ color: '#C47A53' }}>
          Paso {Math.floor(currentStep / 5) + 1} — {section.name}
        </p>
        <p className="text-sm mt-1" style={{ color: '#7A7A6F' }}>
          {section.subtitle}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm" style={{ color: '#7A7A6F' }}>
          <span>Pregunta {currentStep + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <Progress value={progress} className="h-2" style={{ backgroundColor: '#E8E6DB' }}>
          <div className="h-full transition-all" style={{ backgroundColor: '#6B7041', width: `${progress}%` }} />
        </Progress>
      </div>

      {/* Question Card */}
      <div 
        className="rounded-xl p-8"
        style={{ 
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
        }}
      >
        <h2 className="text-2xl font-serif font-semibold mb-6" style={{ color: '#6B7041' }}>
          {currentQuestion.question}
        </h2>
        
        <div className="space-y-6">
          {currentQuestion.type === "text" && (
            <Input
              type="text"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Escribe tu respuesta"
              className="text-lg"
              data-testid={`input-${currentQuestion.id}`}
            />
          )}

          {currentQuestion.type === "number" && (
            <Input
              type="number"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Escribe tu respuesta"
              className="text-lg"
              data-testid={`input-${currentQuestion.id}`}
            />
          )}

          {currentQuestion.type === "radio" && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={handleAnswer}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer"
                    style={{ 
                      borderColor: answers[currentQuestion.id] === option.value ? '#6B7041' : '#E8E6DB',
                      backgroundColor: answers[currentQuestion.id] === option.value ? '#F9F7F2' : '#FFFFFF'
                    }}
                    onClick={() => handleAnswer(option.value)}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                      data-testid={`radio-${option.value}`}
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer text-base"
                      style={{ color: '#3A3A35' }}
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="rounded-xl"
              data-testid="button-anterior"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#6B7041' }}
              data-testid="button-siguiente"
            >
              {currentStep === questions.length - 1 ? "Ver Resultados" : "Siguiente"}
              {currentStep !== questions.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-xs text-center pt-4" style={{ color: '#999999' }}>
        Esta herramienta es educativa y no sustituye la orientación médica profesional.
      </p>
    </div>
  );
}
