import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { TrialStatus, IntakeForm } from '@/types/trial';
import InformeFuncional from '@/components/InformeFuncional';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Day8Banner from '@/components/Day8Banner';
import Day7Banner from '@/components/Day7Banner';
import Day5Banner from '@/components/Day5Banner';
import ArchivedAccountPage from '@/pages/ArchivedAccountPage';

export default function Informe() {
  const [, setLocation] = useLocation();
  const userId = localStorage.getItem('tm_user_id');

  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });

  // Obtener intake form para nombre del usuario
  const { data: intakeForm } = useQuery<IntakeForm>({
    queryKey: ['/api/intake-form', userId],
    enabled: !!userId,
  });

  useEffect(() => {
    if (!trialStatus) return;
    
    // No redirigir si está en día 11+ (se mostrará ArchivedAccountPage)
    if (trialStatus.daysSinceStart >= 11 && !trialStatus.isActive) {
      return;
    }
    
    if (!trialStatus.hasAccess && !trialStatus.isActive) {
      const subscribed = localStorage.getItem('tm_subscribed_at');
      if (!subscribed) {
        setLocation('/');
        return;
      }
    }
  }, [setLocation, trialStatus]);

  // Mostrar pantalla de cuenta archivada si el trial expiró hace más de 3 días (día 11+)
  // y el usuario no tiene suscripción activa
  const showArchivedPage = trialStatus && 
    trialStatus.daysSinceStart >= 11 && 
    !trialStatus.isActive && 
    !trialStatus.isTrialing;

  if (showArchivedPage) {
    return <ArchivedAccountPage userName={intakeForm?.nombre} />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      
      {/* Banner del Día 8+ */}
      {trialStatus && (
        <Day8Banner
          daysRemaining={trialStatus.daysRemaining}
          isActive={trialStatus.isActive}
        />
      )}

      {/* Banner del Día 7 */}
      {trialStatus && (
        <Day7Banner
          daysRemaining={trialStatus.daysRemaining}
          isActive={trialStatus.isActive}
        />
      )}

      {/* Banner del Día 5 */}
      {trialStatus && (
        <Day5Banner
          daysRemaining={trialStatus.daysRemaining}
          isActive={trialStatus.isActive}
        />
      )}
      
      <div style={{ padding: '2rem 0' }}>
        {trialStatus && trialStatus.daysRemaining === 0 && !trialStatus.isActive && (
          <div className="container max-w-4xl mx-auto px-4 mb-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Lock className="h-5 w-5" />
                  Modo lectura: Tu prueba gratuita ha finalizado (Día 7)
                </CardTitle>
                <CardDescription className="text-orange-800">
                  Puedes ver este primer informe, pero necesitas activar tu suscripción para acceder a más contenido personalizado, chat guiado y continuar tu transformación
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
        <InformeFuncional readOnly={trialStatus ? (trialStatus.daysRemaining === 0 && !trialStatus.isActive) : false} />
      </div>
    </div>
  );
}
