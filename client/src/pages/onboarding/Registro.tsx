import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import IntakeForm from '@/components/IntakeForm';
import MensajePostIntake from '@/components/MensajePostIntake';
import Registro5Dias from '@/components/Registro5Dias';
import MensajeFinalRegistro from '@/components/MensajeFinalRegistro';

export default function Registro() {
  const [, setLocation] = useLocation();
  const [showMensajePost, setShowMensajePost] = useState(false);
  const [showRegistro5Dias, setShowRegistro5Dias] = useState(false);
  const [showMensajeFinal, setShowMensajeFinal] = useState(false);

  useEffect(() => {
    // Verificar que el usuario haya completado motivación (paso anterior)
    const motivacionDone = localStorage.getItem('tm_motivacion_done');
    if (!motivacionDone) {
      // Si no completó motivación, redirigir al flujo correcto
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

    // Verificar si ya completó el intake
    const intakeDone = localStorage.getItem('tm_intake_done') === 'true';
    if (intakeDone) {
      setShowMensajePost(true);
      
      // Verificar si ya completó el registro de 5 días
      const diasRegistrados = parseInt(localStorage.getItem('tm_registro_dias') || '0');
      if (diasRegistrados >= 5) {
        setShowMensajeFinal(true);
      }
    }
  }, [setLocation]);

  const handleIntakeComplete = () => {
    setShowMensajePost(true);
  };

  const handleContinuarRegistro = () => {
    setShowRegistro5Dias(true);
  };

  const handleRegistroComplete = () => {
    setShowMensajeFinal(true);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="wrap" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {!showMensajePost ? (
          <IntakeForm onComplete={handleIntakeComplete} />
        ) : !showRegistro5Dias ? (
          <MensajePostIntake onContinue={handleContinuarRegistro} />
        ) : !showMensajeFinal ? (
          <Registro5Dias />
        ) : (
          <MensajeFinalRegistro />
        )}
      </div>
    </div>
  );
}
