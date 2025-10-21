import { useLocation } from "wouter";
import { Sprout, ArrowRight, X } from "lucide-react";
import { useState } from "react";

interface Day7BannerProps {
  daysRemaining: number;
  isActive: boolean;
}

export default function Day7Banner({ daysRemaining, isActive }: Day7BannerProps) {
  const [, setLocation] = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);

  // Solo mostrar en día 7 (daysRemaining === 0) y sin suscripción activa
  const shouldShow = daysRemaining === 0 && !isActive && !isDismissed;

  if (!shouldShow) return null;

  return (
    <div 
      className="relative mx-4 my-4 rounded-lg border-2 p-6 shadow-md"
      style={{ 
        backgroundColor: '#FFFEF9',
        borderColor: '#6B7041',
      }}
    >
      {/* Botón de cerrar */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Cerrar banner"
        data-testid="button-dismiss-day7-banner"
      >
        <X className="w-4 h-4" style={{ color: '#6B7041' }} />
      </button>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Icono */}
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(107, 112, 65, 0.15)' }}
        >
          <Sprout className="w-6 h-6" style={{ color: '#6B7041' }} />
        </div>

        {/* Contenido */}
        <div className="flex-1 space-y-3">
          <h3 
            className="text-lg sm:text-xl font-bold font-serif"
            style={{ color: '#556B2F' }}
          >
            🌿 Tu prueba termina hoy
          </h3>
          
          <div className="space-y-2 text-sm sm:text-base leading-relaxed" style={{ color: '#3A3A3A' }}>
            <p>
              Has llegado al final de tus <strong>7 días de transformación funcional gratuita</strong>.
            </p>
            <p>
              Tu cuerpo ya te dio señales claras de que puede mejorar — ahora es momento de continuar ese proceso con acompañamiento constante.
            </p>
            <p className="font-medium" style={{ color: '#6B7041' }}>
              Recuerda: no se trata de controlar el azúcar, sino de entender tu cuerpo para revertir la resistencia a la insulina desde la raíz.
            </p>
            <p>
              💚 <strong>Activa tu suscripción hoy</strong> y sigue con el <strong>Módulo 1: Empieza desde la raíz</strong>.<br/>
              Tu cuerpo ya empezó a responder, no lo detengas ahora.
            </p>
          </div>

          {/* Botón CTA */}
          <button
            onClick={() => setLocation('/onboarding/checkout')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
            style={{ 
              backgroundColor: '#6B7041',
              color: '#FFFFFF',
            }}
            data-testid="button-continue-day7-banner"
          >
            🟩 Continuar mi transformación ($5 USD/mes)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
