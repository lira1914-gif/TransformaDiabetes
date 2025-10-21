import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sprout, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Day7TrialModalProps {
  daysRemaining: number;
  hasAccess: boolean;
  isActive: boolean;
}

export default function Day7TrialModal({ daysRemaining, hasAccess, isActive }: Day7TrialModalProps) {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDaysSeven = daysRemaining === 0;
    const shouldShow = isDaysSeven && hasAccess && !isActive;
    
    const hasSeenDay7Modal = sessionStorage.getItem('tm_day7_modal_seen');
    
    if (shouldShow && !hasSeenDay7Modal) {
      setIsOpen(true);
      sessionStorage.setItem('tm_day7_modal_seen', 'true');
    }
  }, [daysRemaining, hasAccess, isActive]);

  const handleContinue = () => {
    setIsOpen(false);
    setLocation('/onboarding/checkout');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent 
        className="max-w-lg sm:max-w-xl"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid #6B7041',
          borderRadius: '16px',
          padding: '0'
        }}
      >
        {/* Header con gradiente suave */}
        <div 
          className="rounded-t-2xl px-6 pt-8 pb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(107, 112, 65, 0.08) 0%, rgba(161, 92, 56, 0.06) 100%)'
          }}
        >
          <div className="flex justify-center mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(107, 112, 65, 0.15)' }}
            >
              <Sprout className="w-8 h-8" style={{ color: '#6B7041' }} />
            </div>
          </div>
          
          <AlertDialogHeader>
            <AlertDialogTitle 
              className="text-2xl sm:text-3xl text-center font-bold leading-tight font-serif"
              style={{ color: '#556B2F' }}
            >
              🌱 Tu prueba gratuita ha finalizado, pero tu proceso apenas comienza
            </AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        {/* Contenido principal */}
        <div className="px-6 pb-6">
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: '#3A3A3A' }}>
              <p className="text-center">
                Has dado pasos importantes para reconectar con tu cuerpo, observar tus señales 
                y entender cómo se comporta tu metabolismo.
              </p>

              <p className="text-center">
                Ahora es momento de dar el siguiente paso: continuar con tu plan funcional guiado, 
                donde aprenderás a equilibrar tu glucosa, reducir la inflamación y mantener tu 
                energía estable día a día.
              </p>

              {/* Mensaje de bloqueo */}
              <div 
                className="rounded-lg p-4 my-5"
                style={{ 
                  backgroundColor: 'rgba(161, 92, 56, 0.08)',
                  border: '2px solid rgba(161, 92, 56, 0.2)'
                }}
              >
                <p className="text-center font-semibold" style={{ color: '#A15C38' }}>
                  🔒 El chat funcional y los módulos están reservados para miembros activos del programa
                </p>
              </div>

              <p className="text-center">
                👉 Activa tu suscripción por <strong>$5 USD/mes</strong> y sigue avanzando con tu 
                guía personalizada, sesiones educativas y acompañamiento continuo.
              </p>
            </div>
          </AlertDialogDescription>

          {/* Botón principal y texto secundario */}
          <AlertDialogFooter className="flex-col gap-3 mt-6">
            <AlertDialogAction
              onClick={handleContinue}
              className="w-full py-3 text-base font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{ 
                backgroundColor: '#A15C38',
                color: '#FFFFFF',
              }}
              data-testid="button-continue-trial-day7"
            >
              <span className="flex items-center justify-center gap-2">
                Continuar con mi transformación funcional
                <ArrowRight className="w-4 h-4" />
              </span>
            </AlertDialogAction>
            
            {/* Texto de transparencia */}
            <p 
              className="text-xs text-center px-2"
              style={{ color: '#9A9A8A' }}
            >
              Podrás cancelar en cualquier momento desde tu panel de usuario.
            </p>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
