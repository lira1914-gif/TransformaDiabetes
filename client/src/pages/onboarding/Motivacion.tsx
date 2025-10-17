import { useEffect } from 'react';
import { useLocation } from 'wouter';
import BloqueMotivacionalRotatorio from '@/components/BloqueMotivacionalRotatorio';

export default function Motivacion() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya pasado por bienvenida
    const subscribed = localStorage.getItem('tm_subscribed_at');
    if (!subscribed) {
      setLocation('/');
      return;
    }
  }, [setLocation]);

  const handleContinuar = () => {
    setLocation('/onboarding/mes1');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <BloqueMotivacionalRotatorio onComenzar={handleContinuar} />
    </div>
  );
}
