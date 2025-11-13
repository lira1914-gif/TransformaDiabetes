import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Day6TrialModalProps {
  daysRemaining: number;
  hasAccess: boolean;
  isActive: boolean;
}

export default function Day6TrialModal({ daysRemaining, hasAccess, isActive }: Day6TrialModalProps) {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDaySix = daysRemaining === 1;
    const shouldShow = isDaySix && hasAccess && !isActive;
    
    const hasSeenDay6Modal = sessionStorage.getItem('tm_day6_modal_seen');
    
    if (shouldShow && !hasSeenDay6Modal) {
      setIsOpen(true);
      sessionStorage.setItem('tm_day6_modal_seen', 'true');
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
              <Sparkles className="w-8 h-8" style={{ color: '#6B7041' }} />
            </div>
          </div>
          
          <AlertDialogHeader>
            <AlertDialogTitle 
              className="text-2xl sm:text-3xl text-center font-bold leading-tight font-serif"
              style={{ color: '#556B2F' }}
            >
               Has completado tu prueba funcional gratuita
            </AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        {/* Contenido principal */}
        <div className="px-6 pb-6">
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-base leading-relaxed" style={{ color: '#3A3A3A' }}>
              <p className="text-center">
                Durante estos 7 días diste un paso importante hacia tu equilibrio metabólico.
              </p>

              <p className="text-center">
                <strong>Tu cuerpo comenzó a responder</strong> — estás entendiendo mejor tus señales 
                y lo que necesita para sanar desde la raíz.
              </p>

              <p className="text-center">
                A partir de aquí, puedes continuar con el <strong>Módulo 1: Empieza desde la raíz</strong>, 
                donde aprenderás cómo mantener tus niveles de glucosa estables, reducir la inflamación 
                y fortalecer tu energía día a día.
              </p>

              {/* Mensaje motivacional */}
              <div 
                className="rounded-lg p-4 my-5"
                style={{ 
                  backgroundColor: 'rgba(107, 112, 65, 0.08)',
                  border: '2px solid rgba(107, 112, 65, 0.2)'
                }}
              >
                <p className="text-center font-semibold" style={{ color: '#6B7041' }}>
                   No pierdas tu avance — tu cuerpo ya empezó a transformarse
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
              data-testid="button-continue-trial-day6"
            >
              <span className="flex items-center justify-center gap-2">
                 Continuar mi transformación por $5 USD/mes
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
