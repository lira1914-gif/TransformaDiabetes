import { useEffect } from 'react';
import { useLocation } from 'wouter';
import IntakeForm from '@/components/IntakeForm';

export default function IntakeFormPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya completado la bienvenida
    const bienvenidaDone = localStorage.getItem('tm_bienvenida_done');
    
    if (!bienvenidaDone) {
      setLocation('/onboarding/bienvenida');
      return;
    }
  }, [setLocation]);

  const handleComplete = () => {
    // El IntakeForm ya guarda los datos y marca tm_intake_done
    // Navegar al mensaje
    setLocation('/onboarding/mensaje');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF8' }}>
      <IntakeForm onComplete={handleComplete} />
    </div>
  );
}
