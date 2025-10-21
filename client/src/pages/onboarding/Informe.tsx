import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { TrialStatus } from '@/types/trial';
import InformeFuncional from '@/components/InformeFuncional';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function Informe() {
  const [, setLocation] = useLocation();
  const userId = "d48af8be-dabe-4b0e-94cb-48eadfb0fbe8";

  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });

  useEffect(() => {
    const subscribed = localStorage.getItem('tm_subscribed_at');
    const bienvenidaDone = localStorage.getItem('tm_bienvenida_done');
    const motivacionDone = localStorage.getItem('tm_motivacion_done');
    const informeReady = localStorage.getItem('tm_informe_ready') === 'true';
    const diasRegistrados = parseInt(localStorage.getItem('tm_registro_dias') || '0');
    
    if (!subscribed) {
      alert('Necesitas suscribirte primero para acceder al informe funcional.');
      setLocation('/');
      return;
    }
    if (!bienvenidaDone) {
      alert('Debes completar la bienvenida antes de ver tu informe.');
      setLocation('/onboarding/bienvenida');
      return;
    }
    if (!motivacionDone) {
      alert('Debes completar la motivación antes de ver tu informe.');
      setLocation('/onboarding/motivacion');
      return;
    }
    if (diasRegistrados < 5) {
      alert('Aún no has completado tus 5 días de registro funcional. Por favor completa el registro primero.');
      setLocation('/onboarding/registro');
      return;
    }
    if (!informeReady) {
      alert('Debes generar tu informe inicial desde el tablero del Mes 1.');
      setLocation('/onboarding/mes1');
      return;
    }
  }, [setLocation]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '2rem 0' }}>
        {trialStatus?.trialExpired && !trialStatus?.isActive && (
          <div className="container max-w-4xl mx-auto px-4 mb-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Lock className="h-5 w-5" />
                  Modo lectura: Tu prueba gratuita ha finalizado
                </CardTitle>
                <CardDescription className="text-orange-800">
                  Puedes ver este primer informe, pero necesitas activar tu suscripción para acceder a más contenido personalizado y continuar tu transformación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  data-testid="button-activate-from-report"
                  onClick={() => setLocation('/onboarding/checkout')}
                  className="w-full sm:w-auto"
                >
                  Activar suscripción ($5 USD/mes)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        <InformeFuncional readOnly={trialStatus?.trialExpired && !trialStatus?.isActive} />
      </div>
    </div>
  );
}
