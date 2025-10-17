import { useEffect } from 'react';
import { useLocation } from 'wouter';
import InformeFuncional from '@/components/InformeFuncional';

export default function Informe() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya completado todos los pasos previos
    const subscribed = localStorage.getItem('tm_subscribed_at');
    const bienvenidaDone = localStorage.getItem('tm_bienvenida_done');
    const motivacionDone = localStorage.getItem('tm_motivacion_done');
    const informeReady = localStorage.getItem('tm_informe_ready') === 'true';
    const diasRegistrados = parseInt(localStorage.getItem('tm_registro_dias') || '0');
    
    // Validar flujo completo
    if (!subscribed) {
      setLocation('/');
      return;
    }
    if (!bienvenidaDone) {
      setLocation('/onboarding/bienvenida');
      return;
    }
    if (!motivacionDone) {
      setLocation('/onboarding/motivacion');
      return;
    }
    if (diasRegistrados < 5) {
      setLocation('/onboarding/registro');
      return;
    }
    if (!informeReady) {
      setLocation('/onboarding/mes1');
      return;
    }
  }, [setLocation]);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <InformeFuncional />
    </div>
  );
}
