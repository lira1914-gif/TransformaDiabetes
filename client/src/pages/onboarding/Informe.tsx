import { useEffect } from 'react';
import { useLocation } from 'wouter';
import InformeFuncional from '@/components/InformeFuncional';

export default function Informe() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya completado todos los pasos previos
    const subscribed = localStorage.getItem('tm_subscribed_at');
    const informeReady = localStorage.getItem('tm_informe_ready') === 'true';
    const diasRegistrados = parseInt(localStorage.getItem('tm_registro_dias') || '0');
    
    if (!subscribed || !informeReady || diasRegistrados < 5) {
      // Si no cumple los requisitos, redirigir al paso correspondiente
      if (!subscribed) {
        setLocation('/');
      } else if (diasRegistrados < 5) {
        setLocation('/onboarding/registro');
      } else {
        setLocation('/onboarding/mes1');
      }
      return;
    }
  }, [setLocation]);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <InformeFuncional />
    </div>
  );
}
