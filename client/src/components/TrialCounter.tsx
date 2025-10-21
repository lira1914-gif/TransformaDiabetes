import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { TrialStatus } from "@/types/trial";

export default function TrialCounter() {
  const userId = localStorage.getItem('tm_user_id');
  const intakeDone = localStorage.getItem('tm_intake_done');
  const trialStart = localStorage.getItem('tm_trial_start');
  
  // No mostrar el contador si no ha completado el intake
  if (!intakeDone) {
    return null;
  }

  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId && !!intakeDone,
    refetchInterval: 60000, // Refrescar cada minuto
  });

  // Calcular días restantes usando localStorage como backup
  let daysRemaining = 0;
  let isActive = false;
  
  if (trialStatus) {
    daysRemaining = trialStatus.daysRemaining;
    isActive = trialStatus.isActive;
    
    // No mostrar si ya es suscriptor activo
    if (isActive) {
      return null;
    }
    
    // No mostrar si el trial ya expiró completamente
    if (trialStatus.trialExpired && !trialStatus.hasAccess) {
      return null;
    }
  } else if (trialStart) {
    // Validar y calcular días restantes desde localStorage
    const TRIAL_DAYS = 7;
    const startDate = parseInt(trialStart);
    
    // Validar que sea un número válido
    if (isNaN(startDate) || startDate <= 0) {
      // Datos inválidos, no mostrar
      return null;
    }
    
    const now = Date.now();
    const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, Math.min(TRIAL_DAYS, TRIAL_DAYS - daysSinceStart));
    
    // No mostrar si ya expiró
    if (daysRemaining === 0) {
      return null;
    }
  } else {
    // No hay datos suficientes
    return null;
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        backgroundColor: daysRemaining <= 2 ? 'rgba(234, 88, 12, 0.1)' : 'rgba(107, 112, 65, 0.1)',
        borderColor: daysRemaining <= 2 ? '#ea580c' : '#6B7041',
      }}
      data-testid="trial-counter"
    >
      <Clock
        className="w-4 h-4"
        style={{ 
          color: daysRemaining <= 2 ? '#ea580c' : '#6B7041' 
        }}
      />
      <span
        className="text-sm font-semibold"
        style={{ 
          color: daysRemaining <= 2 ? '#ea580c' : '#6B7041' 
        }}
      >
        Te quedan {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}
      </span>
    </div>
  );
}
