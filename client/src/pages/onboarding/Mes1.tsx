import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Mes1Tracker from '@/components/Mes1Tracker';

export default function Mes1() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya pasado por los pasos anteriores
    const subscribed = localStorage.getItem('tm_subscribed_at');
    if (!subscribed) {
      setLocation('/');
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
