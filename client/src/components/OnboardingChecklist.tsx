import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { OnboardingProgress } from "@/types/trial";

interface OnboardingChecklistProps {
  userId: string;
}

export default function OnboardingChecklist({ userId }: OnboardingChecklistProps) {
  const { data: progress, isLoading } = useQuery<OnboardingProgress>({
    queryKey: ['/api/onboarding-progress', userId],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse" data-testid="card-onboarding-loading">
        <div className="h-32 bg-muted rounded" />
      </Card>
    );
  }

  if (!progress || progress.isComplete) {
    return null;
  }

  return (
    <Card className="p-6 mb-6" data-testid="card-onboarding-checklist">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Completa tu Configuración</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {progress.completedSteps} de {progress.totalSteps} pasos completados
        </p>
        <Progress 
          value={progress.percentComplete} 
          className="h-2" 
          data-testid="progress-onboarding"
        />
      </div>

      <div className="space-y-3">
        {progress.steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition ${
              step.completed
                ? 'bg-muted/50'
                : step.isPrimaryCTA
                ? 'bg-primary/5 border-2 border-primary'
                : 'hover-elevate'
            }`}
            data-testid={`step-${step.id}`}
          >
            <div className="mt-0.5">
              {step.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  step.completed
                    ? 'text-muted-foreground line-through'
                    : step.isPrimaryCTA
                    ? 'text-primary font-semibold'
                    : ''
                }`}
              >
                {step.title}
              </p>
              {step.completedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Completado el {new Date(step.completedAt).toLocaleDateString('es-MX')}
                </p>
              )}
            </div>
            {!step.completed && (
              <Link href={step.link}>
                <button
                  className="flex items-center gap-1 text-sm font-medium text-primary hover-elevate px-3 py-1 rounded"
                  data-testid={`button-goto-${step.id}`}
                >
                  {step.isPrimaryCTA ? 'Empezar' : 'Ir'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>

      {progress.nextStep && progress.nextStep.isPrimaryCTA && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Siguiente paso recomendado:
          </p>
          <Link href={progress.nextStep.link}>
            <button
              className="w-full bg-primary text-primary-foreground hover-elevate active-elevate-2 rounded-lg py-2 font-medium"
              data-testid="button-primary-cta"
            >
              {progress.nextStep.title}
            </button>
          </Link>
        </div>
      )}
    </Card>
  );
}
