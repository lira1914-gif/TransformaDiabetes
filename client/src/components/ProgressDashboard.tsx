import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Calendar, TrendingUp, Target, AlertCircle } from "lucide-react";
import { UserProgress, TrialStatus } from "@/types/trial";
import { useState, useEffect } from "react";

interface ProgressDashboardProps {
  userId: string;
}

export default function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const { data: progress, isLoading } = useQuery<UserProgress>({
    queryKey: ['/api/user-progress', userId],
    enabled: !!userId,
  });

  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });

  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!trialStatus?.startDate || !trialStatus.isTrialing || trialStatus.subscriptionStatus === 'active') return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const startDate = new Date(trialStatus.startDate);
      // Trial es de 7 días desde startDate
      const expiryDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [trialStatus]);

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

      {/* Countdown Visual con Urgencia - Solo si quedan 3 días o menos y no está suscrito */}
      {timeRemaining && trialStatus?.subscriptionStatus !== 'active' && timeRemaining.days <= 3 && (
        <Card 
          className="p-6 border-2" 
          style={{
            borderColor: timeRemaining.days === 0 ? '#dc2626' : timeRemaining.days === 1 ? '#ea580c' : '#f59e0b',
            backgroundColor: timeRemaining.days === 0 ? '#fef2f2' : timeRemaining.days === 1 ? '#fff7ed' : '#fffbeb'
          }}
          data-testid="card-countdown"
        >
          <div className="flex items-start gap-3">
            <AlertCircle 
              className="w-6 h-6 flex-shrink-0 mt-1" 
              style={{
                color: timeRemaining.days === 0 ? '#dc2626' : timeRemaining.days === 1 ? '#ea580c' : '#f59e0b'
              }}
            />
            <div className="flex-1">
              <h3 
                className="font-bold text-lg mb-2"
                style={{
                  color: timeRemaining.days === 0 ? '#991b1b' : timeRemaining.days === 1 ? '#9a3412' : '#92400e'
                }}
              >
                {timeRemaining.days === 0 
                  ? '¡Última oportunidad!' 
                  : timeRemaining.days === 1 
                  ? '¡Último día de prueba gratuita!' 
                  : 'Tu prueba gratuita está por terminar'}
              </h3>
              
              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold"
                    style={{
                      color: timeRemaining.days === 0 ? '#dc2626' : timeRemaining.days === 1 ? '#ea580c' : '#f59e0b'
                    }}
                    data-testid="countdown-days"
                  >
                    {timeRemaining.days}
                  </div>
                  <div className="text-xs text-muted-foreground">Días</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold"
                    style={{
                      color: timeRemaining.days === 0 ? '#dc2626' : timeRemaining.days === 1 ? '#ea580c' : '#f59e0b'
                    }}
                    data-testid="countdown-hours"
                  >
                    {String(timeRemaining.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground">Horas</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold"
                    style={{
                      color: timeRemaining.days === 0 ? '#dc2626' : timeRemaining.days === 1 ? '#ea580c' : '#f59e0b'
                    }}
                    data-testid="countdown-minutes"
                  >
                    {String(timeRemaining.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground">Minutos</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold"
                    style={{
                      color: timeRemaining.days === 0 ? '#dc2626' : timeRemaining.days === 1 ? '#ea580c' : '#f59e0b'
                    }}
                    data-testid="countdown-seconds"
                  >
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground">Segundos</div>
                </div>
              </div>

              <p className="text-sm mb-3" style={{ color: '#525252' }}>
                {timeRemaining.days === 0 
                  ? 'Tu acceso al chat funcional y módulos expirará hoy. Suscríbete ahora por solo $5/mes para continuar tu transformación.'
                  : timeRemaining.days === 1
                  ? 'Mañana perderás acceso al chat ilimitado y tus módulos progresivos. ¡No pierdas tu progreso!'
                  : 'Quedan solo ' + timeRemaining.days + ' días para aprovechar todo el contenido. Continúa tu proceso por $5/mes.'}
              </p>

              <a
                href="/onboarding/checkout"
                className="inline-block px-5 py-2.5 rounded-md text-white font-semibold text-center w-full transition-all hover:opacity-90"
                style={{
                  backgroundColor: timeRemaining.days === 0 ? '#dc2626' : timeRemaining.days === 1 ? '#ea580c' : '#4a5d23',
                  textDecoration: 'none'
                }}
                data-testid="button-subscribe-countdown"
              >
                {timeRemaining.days === 0 
                  ? 'Suscribirme Ahora - $5/mes' 
                  : 'Continuar mi Transformación - $5/mes'}
              </a>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Cancela cuando quieras, sin permanencia
              </p>
            </div>
          </div>
        </Card>
      )}

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
