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
      <Card 
        className="shadow-xl"
        style={{
          borderColor: '#D4A373',
          backgroundColor: '#FFFDF8',
          border: '2px solid'
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: '#A15C38' }}
              />
              <CardTitle 
                className="font-serif"
                style={{ color: '#556B2F', fontSize: '1.25rem' }}
              >
                 Tu prueba gratuita está por terminar
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
          
          <div className="mt-4 space-y-3" style={{ color: '#3A3A3A' }}>
            <p className="leading-relaxed">
              Has avanzado increíblemente estos días. Ya diste los primeros pasos para entender 
              cómo responde tu cuerpo y cómo puedes comenzar a revertir la resistencia a la 
              insulina desde la raíz.
            </p>
            
            <p className="leading-relaxed">
              ⏳ <strong>Te quedan 2 días</strong> para seguir explorando el chat funcional y 
              registrar tus progresos.
            </p>
            
            <p className="leading-relaxed">
              Si quieres continuar con tu transformación, acceder al Módulo 1 y mantener tu 
              acompañamiento semanal, activa tu suscripción por solo <strong>$5 USD/mes</strong>.
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleActivate}
              className="flex-1"
              data-testid="button-activate-from-day5-banner"
              style={{
                backgroundColor: '#A15C38',
                color: 'white',
                fontWeight: 600
              }}
            >
              Continuar con mi transformación
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="sm:w-auto"
              data-testid="button-remind-later-day5"
              style={{
                borderColor: '#D4A373',
                color: '#A15C38'
              }}
            >
              Recordarme después
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
