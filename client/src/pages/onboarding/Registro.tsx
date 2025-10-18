import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Registro5Dias from '@/components/Registro5Dias';

export default function Registro() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log('🔵 Registro.tsx montado');
    console.log('tm_subscribed_at:', localStorage.getItem('tm_subscribed_at'));
    console.log('registro5dias:', localStorage.getItem('registro5dias'));
    console.log('tm_registro_dias:', localStorage.getItem('tm_registro_dias'));
    
    // Verificar que el usuario esté suscrito
    const subscribed = localStorage.getItem('tm_subscribed_at');
    if (!subscribed) {
      console.log('❌ No suscrito, redirigiendo a /');
      setLocation('/');
      return;
    }
    console.log('✅ Usuario suscrito, mostrando registro');
  }, [setLocation]);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#FAF8F4' }}>
      <div className="wrap" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Registro5Dias />
      </div>
    </div>
  );
}
