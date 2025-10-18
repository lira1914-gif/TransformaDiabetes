import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Registro5Dias from '@/components/Registro5Dias';

export default function Registro() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario esté suscrito
    const subscribed = localStorage.getItem('tm_subscribed_at');
    if (!subscribed) {
      setLocation('/');
      return;
    }
  }, [setLocation]);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#FAF8F4' }}>
      <div className="wrap" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Registro5Dias />
      </div>
    </div>
  );
}
