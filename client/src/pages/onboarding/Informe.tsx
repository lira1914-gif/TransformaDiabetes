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
      alert('Necesitas suscribirte primero para acceder al informe funcional.');
      setLocation('/');
      return;
    }
    if (!bienvenidaDone) {
      alert('Debes completar la bienvenida antes de ver tu informe.');
      setLocation('/onboarding/bienvenida');
      return;
    }
    if (!motivacionDone) {
      alert('Debes completar la motivación antes de ver tu informe.');
      setLocation('/onboarding/motivacion');
      return;
    }
    if (diasRegistrados < 5) {
      alert('Aún no has completado tus 5 días de registro funcional. Por favor completa el registro primero.');
      setLocation('/onboarding/registro');
      return;
    }
    if (!informeReady) {
      alert('Debes generar tu informe inicial desde el tablero del Mes 1.');
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
