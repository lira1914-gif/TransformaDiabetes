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
              className="text-2xl sm:text-3xl text-center font-bold leading-tight"
              style={{ color: '#3E3E2E' }}
            >
              Tu cuerpo está respondiendo…
            </AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        {/* Contenido principal */}
        <div className="px-6 pb-6">
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: '#6F6E66' }}>
              <p className="text-center">
                Has dado los primeros pasos hacia el equilibrio.
                Este espacio fue solo una muestra de lo que puedes lograr cuando empiezas a entender las señales de tu cuerpo desde la raíz.
              </p>

              {/* Mensaje clave con icono */}
              <div 
                className="rounded-lg p-4 my-5"
                style={{ 
                  backgroundColor: 'rgba(107, 112, 65, 0.08)',
                  border: '1px solid rgba(107, 112, 65, 0.2)'
                }}
              >
                <p className="text-center font-medium" style={{ color: '#3E3E2E' }}>
                  🌱 Si sentiste cambios — más claridad, energía o calma — no los detengas.
                </p>
              </div>

              <p className="text-center">
                Activa tu suscripción y continúa con tus próximos módulos funcionales, 
                reportes personalizados y acceso al chat guiado.
              </p>

              {/* Recordatorio empático */}
              <div className="pt-2">
                <p 
                  className="text-center italic text-lg font-medium"
                  style={{ color: '#6B7041' }}
                >
                  Recuerda: tu cuerpo no está roto, solo necesita apoyo.
                </p>
              </div>
            </div>
          </AlertDialogDescription>

          {/* Botón principal y texto secundario */}
          <AlertDialogFooter className="flex-col gap-3 mt-6">
            <AlertDialogAction
              onClick={handleContinue}
              className="w-full py-3 text-base font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
              style={{ 
                backgroundColor: '#6B7041',
                color: '#FFFFFF',
              }}
              data-testid="button-continue-trial-day7"
            >
              <span className="flex items-center justify-center gap-2">
                Continuar mi proceso por $5/mes
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
