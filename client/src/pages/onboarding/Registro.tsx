import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Registro5DiasDetallado from '@/components/Registro5DiasDetallado';

export default function Registro() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log('🔵 Registro.tsx montado');
    
    // Verificar que el usuario haya completado el mensaje
    const mensajeDone = localStorage.getItem('tm_mensaje_done');
    if (!mensajeDone) {
      console.log('❌ Mensaje no completado, redirigiendo');
      setLocation('/onboarding/bienvenida');
      return;
    }
    console.log('✅ Mensaje completado, mostrando registro detallado');
  }, [setLocation]);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF8' }}>
      <Registro5DiasDetallado />
    </div>
  );
}
