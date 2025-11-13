import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Calendar, TrendingUp, Target } from "lucide-react";
import { UserProgress } from "@/types/trial";

interface ProgressDashboardProps {
  userId: string;
}

export default function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const { data: progress, isLoading } = useQuery<UserProgress>({
    queryKey: ['/api/user-progress', userId],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 animate-pulse">
          <div className="h-20 bg-muted rounded" />
        </Card>
        <Card className="p-4 animate-pulse">
          <div className="h-20 bg-muted rounded" />
        </Card>
        <Card className="p-4 animate-pulse">
          <div className="h-20 bg-muted rounded" />
        </Card>
      </div>
    );
  }

  if (!progress) return null;

  const { chatStats, trialProgress, suggestedActions } = progress;

  return (
    <div className="space-y-6 mb-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Racha Actual */}
        <Card className="p-4 hover-elevate" data-testid="card-streak">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Racha Actual</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary" data-testid="text-streak-count">
                  {chatStats.currentStreak}
                </span>
                <span className="text-sm text-muted-foreground">
                  {chatStats.currentStreak === 1 ? 'día' : 'días'}
                </span>
              </div>
            </div>
            <Flame className={`w-8 h-8 ${chatStats.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </div>
        </Card>

        {/* Días Activos */}
        <Card className="p-4 hover-elevate" data-testid="card-active-days">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Días Activos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" data-testid="text-active-days">
                  {chatStats.totalActiveDays}
                </span>
                <span className="text-sm text-muted-foreground">
                  de {trialProgress.daysCompleted + trialProgress.daysRemaining}
                </span>
              </div>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        {/* Total Mensajes */}
        <Card className="p-4 hover-elevate" data-testid="card-total-messages">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Consultas Totales</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" data-testid="text-total-messages">
                  {chatStats.totalMessages}
                </span>
                <span className="text-sm text-muted-foreground">mensajes</span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Progreso del Trial */}
      <Card className="p-6" data-testid="card-trial-progress">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Progreso del Trial</h3>
          </div>
          <span className="text-sm font-medium" data-testid="text-trial-percentage">
            {trialProgress.percentComplete}%
          </span>
        </div>
        <Progress value={trialProgress.percentComplete} className="h-3 mb-2" data-testid="progress-trial" />
        <p className="text-sm text-muted-foreground">
          Día {trialProgress.daysCompleted} de {trialProgress.daysCompleted + trialProgress.daysRemaining}
          {trialProgress.daysRemaining > 0 && (
            <span className="ml-1">
              • {trialProgress.daysRemaining} {trialProgress.daysRemaining === 1 ? 'día restante' : 'días restantes'}
            </span>
          )}
        </p>
      </Card>

      {/* Próximos Pasos */}
      {suggestedActions.length > 0 && (
        <Card className="p-6" data-testid="card-suggested-actions">
          <h3 className="font-semibold mb-3">Próximos Pasos</h3>
          <ul className="space-y-2">
            {suggestedActions.map((action, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm"
                data-testid={`text-action-${index}`}
              >
                <span className="text-primary mt-0.5">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
