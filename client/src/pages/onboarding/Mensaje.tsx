import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Mensaje() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya completado el intake
    const intakeDone = localStorage.getItem('tm_intake_done');
    
    if (!intakeDone) {
      setLocation('/onboarding/bienvenida');
      return;
    }
  }, [setLocation]);

  const handleContinuar = () => {
    // Marcar mensaje como visto
    localStorage.setItem('tm_mensaje_done', 'true');
    // Navegar al registro de 5 días
    setLocation('/onboarding/registro');
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        background: '#FAF8F4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          background: '#fffdf8',
          border: '1px solid #E6E3D9',
          borderRadius: '12px',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
          animation: 'fadeInUp 1.2s ease forwards'
        }}
      >
        <h1 style={{ 
          color: '#30452b', 
          textAlign: 'center', 
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          💬 Tu mensaje funcional del día
        </h1>

        <div style={{ 
          background: 'rgba(163,109,79,0.1)', 
          padding: '1.5rem', 
          borderRadius: '10px', 
          margin: '2rem 0',
          borderLeft: '4px solid #a36d4f'
        }}>
          <p style={{ 
            color: '#3a3a3a', 
            lineHeight: 1.7,
            fontSize: '1.05rem',
            margin: 0,
            fontStyle: 'italic'
          }}>
            "Observa sin juzgar. Tu cuerpo está intentando comunicarse contigo todos los días. 
            Estos 5 días de registro son tu oportunidad para escucharlo sin filtros ni expectativas."
          </p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ 
            color: '#30452b', 
            fontSize: '1.2rem',
            marginBottom: '1rem'
          }}>
            🌿 ¿Qué vamos a observar?
          </h3>
          <ul style={{ 
            color: '#3a3a3a', 
            lineHeight: 1.8,
            fontSize: '1rem',
            marginLeft: '1.5rem'
          }}>
            <li><strong>Alimentación:</strong> Qué comes, cuándo y cómo te sientes después.</li>
            <li><strong>Energía:</strong> Cómo fluctúa durante el día, cuándo sientes cansancio.</li>
            <li><strong>Sueño:</strong> Calidad, duración y sensación al despertar.</li>
            <li><strong>Digestión:</strong> Evacuaciones, gases, inflamación abdominal.</li>
            <li><strong>Estado emocional:</strong> Ansiedad, calma, estrés percibido.</li>
          </ul>
        </div>

        <div style={{ 
          background: 'rgba(85,107,47,0.08)', 
          padding: '1.2rem', 
          borderRadius: '10px', 
          margin: '2rem 0',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#556B2F', 
            fontSize: '1rem',
            fontWeight: 600,
            margin: 0
          }}>
            💡 Recuerda: No cambies nada durante estos 5 días. Solo observa.
          </p>
        </div>

        <button 
          onClick={handleContinuar}
          data-testid="button-continuar-mensaje"
          style={{
            display: 'block',
            margin: '2rem auto 0',
            background: '#a36d4f',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#8f5b3f'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#a36d4f'}
        >
          Empezar mi registro de 5 días →
        </button>
      </div>
    </div>
  );
}
