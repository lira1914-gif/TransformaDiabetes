import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';

interface Day5BannerProps {
  daysRemaining: number;
  isActive: boolean;
}

export default function Day5Banner({ daysRemaining, isActive }: Day5BannerProps) {
  const [, setLocation] = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('tm_day5_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('tm_day5_dismissed', 'true');
    setIsDismissed(true);
  };

  const handleActivate = () => {
    sessionStorage.setItem('tm_day5_dismissed', 'true');
    setLocation('/onboarding/checkout');
  };

  // Solo mostrar en el día 5 (cuando quedan 2 días)
  if (daysRemaining !== 2 || isActive || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Card className="border-amber-200 bg-amber-50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-900">
                ¡Solo quedan 2 días de tu prueba gratuita!
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 -mt-1 -mr-2"
              data-testid="button-dismiss-day5-banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-amber-800 mt-2">
            No pierdas tu progreso. Activa tu suscripción ahora para continuar con tu transformación funcional y acceder a todos los módulos educativos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleActivate}
              className="flex-1"
              data-testid="button-activate-from-day5-banner"
            >
              Activar mi acceso continuo ($5 USD/mes)
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="sm:w-auto"
              data-testid="button-remind-later-day5"
            >
              Recordarme después
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
