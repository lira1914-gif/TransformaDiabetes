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
  {
    id: "nombre",
    question: "¿Cómo te llamas?",
    type: "text"
  },
  {
    id: "diagnosticado",
    question: "¿Has sido diagnosticado con Diabetes Tipo 2?",
    type: "radio",
    options: [
      { value: "si", label: "Sí, tengo diagnóstico confirmado" },
      { value: "prediabetes", label: "Me han dicho que tengo prediabetes" },
      { value: "no", label: "No, pero tengo factores de riesgo" }
    ]
  },
  {
    id: "medicamentos",
    question: "¿Actualmente tomas medicamentos para la diabetes?",
    type: "radio",
    options: [
      { value: "si", label: "Sí, tomo medicamentos" },
      { value: "insulina", label: "Sí, uso insulina" },
      { value: "no", label: "No tomo medicamentos" }
    ]
  },
  {
    id: "alimentacion",
    question: "¿Cómo describirías tu alimentación actual?",
    type: "radio",
    options: [
      { value: "procesada", label: "Alta en alimentos procesados y azúcares" },
      { value: "mixta", label: "Mezcla de alimentos procesados y naturales" },
      { value: "saludable", label: "Principalmente alimentos naturales y sin procesar" }
    ]
  },
  {
    id: "ejercicio",
    question: "¿Con qué frecuencia realizas actividad física?",
    type: "radio",
    options: [
      { value: "sedentario", label: "Muy poco o nada" },
      { value: "ocasional", label: "1-2 veces por semana" },
      { value: "regular", label: "3 o más veces por semana" }
    ]
  },
  {
    id: "peso",
    question: "¿Has experimentado cambios de peso en los últimos 6 meses?",
    type: "radio",
    options: [
      { value: "aumento", label: "He ganado peso" },
      { value: "estable", label: "Mi peso se ha mantenido estable" },
      { value: "perdida", label: "He perdido peso" }
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pregunta {currentStep + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <Progress value={progress} className="h-2 [&>div]:bg-terracota" />
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
                    className="flex items-center space-x-3 p-4 rounded-lg border hover-elevate cursor-pointer"
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
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              data-testid="button-anterior"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button
              variant="default"
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1"
              data-testid="button-siguiente"
            >
              {currentStep === questions.length - 1 ? "Ver Resultados" : "Siguiente"}
              {currentStep !== questions.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
