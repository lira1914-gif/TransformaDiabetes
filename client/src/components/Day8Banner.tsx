import { useLocation } from "wouter";
import { Lock, ArrowRight, X } from "lucide-react";
import { useState } from "react";

interface Day8BannerProps {
  daysRemaining: number;
  isActive: boolean;
}

export default function Day8Banner({ daysRemaining, isActive }: Day8BannerProps) {
  const [, setLocation] = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);

  // Solo mostrar DESPUÉS del día 7 (daysRemaining < 0) sin suscripción activa
  // Esto es día 8+, no día 7 (el día 7 tiene su propio banner y modal)
  const shouldShow = daysRemaining < 0 && !isActive && !isDismissed;

  if (!shouldShow) return null;

  return (
    <div 
      className="relative mx-4 my-4 rounded-lg border-2 p-6 shadow-lg"
      style={{ 
        backgroundColor: '#FFFEF9',
        borderColor: '#A15C38',
      }}
    >
      {/* Botón de cerrar */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Cerrar banner"
        data-testid="button-dismiss-day8-banner"
      >
        <X className="w-4 h-4" style={{ color: '#A15C38' }} />
      </button>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Icono */}
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(161, 92, 56, 0.15)' }}
        >
          <Lock className="w-6 h-6" style={{ color: '#A15C38' }} />
        </div>

        {/* Contenido */}
        <div className="flex-1 space-y-3">
          <h3 
            className="text-lg sm:text-xl font-bold font-serif"
            style={{ color: '#A15C38' }}
          >
            ⏳ Tu acceso gratuito ha finalizado
          </h3>
          
          <div className="space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: '#3A3A3A' }}>
            <p>
              Gracias por probar la experiencia funcional de <strong>Marvin Lira Nutrición Funcional</strong> 🌿
            </p>
            <p>
              Durante estos días diste el primer paso para entender cómo tu cuerpo puede recuperar su equilibrio y energía.
            </p>
            <p>
              <strong>Ahora tu acceso ha finalizado</strong>, pero puedes retomarlo en cualquier momento.
            </p>
            
            <div className="my-4">
              <p className="font-semibold mb-2" style={{ color: '#6B7041' }}>
                Al suscribirte, desbloquearás nuevamente:
              </p>
              <ul className="space-y-1 ml-4">
                <li>✅ Tu panel funcional completo</li>
                <li>✅ El chat interactivo con IA</li>
                <li>✅ Los módulos mensuales de transformación</li>
                <li>✅ Y acceso continuo a tus reportes personalizados</li>
              </ul>
            </div>

            <p className="font-semibold" style={{ color: '#6B7041' }}>
              💚 Tu cuerpo ya comenzó a mejorar — no detengas ese proceso.
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
            data-testid="button-reactivate-day8-banner"
          >
            🟩 Reactivar mi acceso ($5 USD/mes)
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Nota final */}
          <p className="text-xs mt-3" style={{ color: '#9A9A8A' }}>
            Este programa es educativo y no reemplaza orientación médica.
          </p>
        </div>
      </div>
    </div>
  );
}
