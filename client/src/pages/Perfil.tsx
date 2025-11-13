import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Day7TrialModal from "@/components/Day7TrialModal";
import Day6TrialModal from "@/components/Day6TrialModal";
import Day8Banner from "@/components/Day8Banner";
import Day7Banner from "@/components/Day7Banner";
import { TrialStatus, IntakeForm } from "@/types/trial";
import ArchivedAccountPage from "@/pages/ArchivedAccountPage";
import ProgressDashboard from "@/components/ProgressDashboard";
import OnboardingChecklist from "@/components/OnboardingChecklist";

export default function Perfil() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  
  const userId = localStorage.getItem('tm_user_id');

  // Protección: redirigir si no hay userId
  useEffect(() => {
    if (!userId) {
      setLocation('/onboarding/bienvenida-trial');
    }
  }, [userId, setLocation]);

  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });

  const { data: intakeForm } = useQuery<IntakeForm>({
    queryKey: ['/api/intake-form', userId],
    enabled: !!userId,
  });

  useEffect(() => {
    const checkPortalReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fromPortal = urlParams.get('from');
      const previousStatus = urlParams.get('prevStatus');
      
      if (fromPortal === 'portal') {
        try {
          const response = await fetch(`/api/users/id/${userId}`);
          const user = await response.json();
          
          const currentStatus = user.subscriptionStatus;
          
          if (currentStatus === 'canceled' || currentStatus === 'cancelled') {
            window.history.replaceState({}, '', '/perfil');
            setLocation('/cancelacion-confirmada');
            return;
          }
          
          if (previousStatus === 'canceled' && currentStatus === 'active') {
            try {
              await apiRequest('POST', '/api/notify-reactivation', { userId });
              console.log('✅ Email de reactivación enviado');
            } catch (error) {
              console.error('Error enviando email de reactivación:', error);
            }
            
            window.history.replaceState({}, '', '/perfil');
            setLocation('/reactivacion-confirmada');
            return;
          }
          
          if (fromPortal === 'portal') {
            window.history.replaceState({}, '', '/perfil');
          }
        } catch (error) {
          console.error('Error verificando estado de suscripción:', error);
        }
      }
    };
    
    checkPortalReturn();
  }, [userId, setLocation]);

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true);
    
    try {
      const userResponse = await fetch(`/api/users/id/${userId}`);
      const userData = await userResponse.json();
      const currentStatus = userData.subscriptionStatus || 'unknown';
      
      const response = await apiRequest('POST', '/api/create-portal-session', { userId, currentStatus });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió URL del portal");
      }
    } catch (error: any) {
      console.error("Error abriendo portal:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo abrir el portal de gestión. Intenta nuevamente.",
        variant: "destructive",
      });
      setIsLoadingPortal(false);
    }
  };

  // Mostrar pantalla de cuenta archivada si el trial expiró (día 8+) y no es suscriptor
  const showArchivedPage = trialStatus && 
    trialStatus.daysSinceStart >= 8 && 
    !trialStatus.isActive && 
    !trialStatus.isTrialing;

  if (showArchivedPage) {
    return <ArchivedAccountPage userName={intakeForm?.nombre} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      
      {trialStatus && (
        <Day7TrialModal
          daysRemaining={trialStatus.daysRemaining}
          hasAccess={trialStatus.hasAccess}
          isActive={trialStatus.isActive}
        />
      )}

      {trialStatus && (
        <Day6TrialModal
          daysRemaining={trialStatus.daysRemaining}
          hasAccess={trialStatus.hasAccess}
          isActive={trialStatus.isActive}
        />
      )}

      {trialStatus && (
        <Day8Banner
          daysRemaining={trialStatus.daysRemaining}
          isActive={trialStatus.isActive}
        />
      )}

      {trialStatus && (
        <Day7Banner
          daysRemaining={trialStatus.daysRemaining}
          isActive={trialStatus.isActive}
        />
      )}
      
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 
              className="text-3xl sm:text-4xl font-bold mb-3" 
              style={{ color: '#3E3E2E' }}
            >
              Gestión de Cuenta
            </h1>
            <p className="text-base sm:text-lg mb-4" style={{ color: '#6F6E66' }}>
              Administra tu suscripción y acceso a TransformaDiabetes
            </p>
          </div>

          {/* Dashboard de Progreso */}
          {userId && <ProgressDashboard userId={userId} />}

          {/* Checklist de Onboarding */}
          {userId && <OnboardingChecklist userId={userId} />}

          <div className="text-center">
            {trialStatus?.isTrialing && trialStatus?.daysRemaining > 0 && (
              <div className="max-w-2xl mx-auto mb-8">
                <div 
                  className="rounded-xl p-6 text-center"
                  style={{ 
                    backgroundColor: '#F0F7E6',
                    border: '2px solid #6B7041',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-6 h-6" style={{ color: '#6B7041' }} />
                    <h3 className="text-xl font-bold" style={{ color: '#3E3E2E' }}>
                      🕓 Te quedan {trialStatus.daysRemaining} {trialStatus.daysRemaining === 1 ? 'día' : 'días'} de tu acceso gratuito
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: '#6F6E66' }}>
                    Estás explorando TransformaDiabetes sin costo. Después de tu periodo gratuito, tu suscripción se activará automáticamente por $5 USD/mes.
                  </p>
                </div>
              </div>
            )}

            {trialStatus?.trialExpired && !trialStatus?.isActive && (
              <div className="max-w-2xl mx-auto mb-8">
                <div 
                  className="rounded-xl p-8 text-center"
                  style={{ 
                    backgroundColor: '#FFF9E6',
                    border: '2px solid #FFB74D',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#3E3E2E' }}>
                    🌿 Tu periodo gratuito ha finalizado
                  </h3>
                  <p className="text-base mb-6 leading-relaxed" style={{ color: '#6F6E66' }}>
                    Para continuar recibiendo tus reportes personalizados y soporte funcional, activa tu suscripción por $5 USD/mes.
                  </p>
                  <button
                    onClick={() => setLocation('/onboarding/checkout')}
                    className="px-8 py-3 rounded-lg font-semibold text-lg transition"
                    style={{ 
                      backgroundColor: '#A15C38',
                      color: '#FFFFFF',
                      border: 'none'
                    }}
                    data-testid="button-activate-subscription"
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Activar suscripción
                  </button>
                  <p className="text-xs mt-3" style={{ color: '#9A998C' }}>
                    Solo $5 USD/mes • Cancela cuando quieras
                  </p>
                </div>
              </div>
            )}

            <div className="max-w-2xl mx-auto mb-8">
              <div 
                className="rounded-xl p-8 text-left"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E6E3D9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <h2 
                  className="text-2xl font-bold mb-4" 
                  style={{ color: '#3E3E2E' }}
                >
                  Gestiona tu suscripción
                </h2>
                
                <p className="text-base mb-6 leading-relaxed" style={{ color: '#6F6E66' }}>
                  Tu proceso con TransformaDiabetes está diseñado para acompañarte paso a paso, sin compromisos ni presiones.
                  Puedes actualizar tu método de pago o cancelar tu suscripción en cualquier momento, de forma segura, a través de nuestro portal de Stripe.
                </p>

                <div className="mb-6 pl-4 border-l-2" style={{ borderColor: '#6B7041' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#3E3E2E' }}>
                    🔒 Seguridad y transparencia:
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6F6E66' }}>
                    El manejo de tus pagos y cancelaciones se realiza directamente con Stripe, una de las plataformas más seguras del mundo.
                    Nosotros no almacenamos datos de tus tarjetas ni realizamos cargos fuera de tu control.
                  </p>
                </div>

                <div className="mb-6">
                  <button
                    onClick={handleManageSubscription}
                    disabled={isLoadingPortal}
                    className="w-full px-6 py-3 rounded-lg font-semibold transition text-base disabled:opacity-50"
                    style={{ 
                      backgroundColor: '#6B7041',
                      color: '#FFFFFF',
                      border: 'none'
                    }}
                    data-testid="button-manage-subscription"
                    onMouseEnter={(e) => !isLoadingPortal && (e.currentTarget.style.backgroundColor = '#5A5E35')}
                    onMouseLeave={(e) => !isLoadingPortal && (e.currentTarget.style.backgroundColor = '#6B7041')}
                  >
                    {isLoadingPortal ? "Abriendo portal seguro..." : "👉 Gestionar mi suscripción"}
                  </button>
                  <p className="text-xs mt-2 text-center" style={{ color: '#9A998C' }}>
                    (Este botón abrirá una nueva ventana segura de Stripe.)
                  </p>
                </div>

                <div 
                  className="rounded-lg p-4 mb-4"
                  style={{ backgroundColor: '#F9F7F2', border: '1px solid #E6E3D9' }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: '#3E3E2E' }}>
                    Nota importante:
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6F6E66' }}>
                    Al cancelar, conservarás el acceso a tu módulo actual hasta el final del periodo que ya pagaste.
                    Podrás reactivar tu suscripción en cualquier momento si deseas continuar con tu proceso funcional.
                  </p>
                </div>

                <p className="text-base text-center italic font-medium" style={{ color: '#6B7041' }}>
                  Tu cuerpo no está roto, está buscando equilibrio.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
