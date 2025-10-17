import { useEffect } from 'react';
import { useLocation } from 'wouter';
import BloqueMotivacionalRotatorio from '@/components/BloqueMotivacionalRotatorio';

export default function Motivacion() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya completado bienvenida
    const bienvenidaDone = localStorage.getItem('tm_bienvenida_done');
    if (!bienvenidaDone) {
      // Si no completó bienvenida, redirigir allí
      const subscribed = localStorage.getItem('tm_subscribed_at');
      if (subscribed) {
        setLocation('/onboarding/bienvenida');
      } else {
        setLocation('/');
      }
      return;
    }
  }, [setLocation]);

  const handleContinuar = () => {
    // Marcar motivación como completada
    localStorage.setItem('tm_motivacion_done', 'true');
    setLocation('/onboarding/mes1');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <BloqueMotivacionalRotatorio onComenzar={handleContinuar} />
    </div>
  );
}
