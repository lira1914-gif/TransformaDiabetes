import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Mes1Tracker from '@/components/Mes1Tracker';

export default function Mes1() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya completado motivación
    const motivacionDone = localStorage.getItem('tm_motivacion_done');
    if (!motivacionDone) {
      // Si no completó motivación, redirigir allí
      const bienvenidaDone = localStorage.getItem('tm_bienvenida_done');
      if (bienvenidaDone) {
        setLocation('/onboarding/motivacion');
      } else {
        const subscribed = localStorage.getItem('tm_subscribed_at');
        if (subscribed) {
          setLocation('/onboarding/bienvenida');
        } else {
          setLocation('/');
        }
      }
      return;
    }
  }, [setLocation]);

  const handleIrRegistro = () => {
    setLocation('/onboarding/registro');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <Mes1Tracker onIrRegistro={handleIrRegistro} />
    </div>
  );
}
