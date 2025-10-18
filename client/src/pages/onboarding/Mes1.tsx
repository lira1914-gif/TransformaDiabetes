import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Mes1Tracker from '@/components/Mes1Tracker';

export default function Mes1() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya completado el mensaje
    const mensajeDone = localStorage.getItem('tm_mensaje_done');
    if (!mensajeDone) {
      // Si no completó el mensaje, redirigir al inicio del flujo
      const intakeDone = localStorage.getItem('tm_intake_done');
      if (intakeDone) {
        setLocation('/onboarding/mensaje');
      } else {
        setLocation('/onboarding/bienvenida');
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
