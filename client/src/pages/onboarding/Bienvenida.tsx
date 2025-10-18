import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Bienvenida() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Verificar que el usuario haya pagado
    const subscribed = localStorage.getItem('tm_subscribed_at');
    if (!subscribed) {
      setLocation('/');
      return;
    }
  }, [setLocation]);

  const handleContinuar = () => {
    // Marcar bienvenida como completada
    localStorage.setItem('tm_bienvenida_done', 'true');
    setLocation('/onboarding/registro');
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        background: 'rgba(250,248,244,0.9) url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60") center/cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid #E6E3D9',
          borderRadius: '12px',
          padding: '3rem 2rem',
          boxShadow: '0 8px 22px rgba(0,0,0,0.05)',
          animation: 'fadeInUp 1.2s ease forwards'
        }}
      >
        <h1 style={{ color: '#556B2F', textAlign: 'center', fontSize: '2.5rem' }}>
          ✨ Bienvenido a TransformaDiabetes Funcional
        </h1>
        <h2 style={{ color: '#A15C38', textAlign: 'center', fontSize: '1.5rem', marginTop: '0.5rem' }}>
          Tu camino hacia el equilibrio comienza hoy
        </h2>
        <p style={{ color: '#3A3A3A', textAlign: 'center', maxWidth: '650px', margin: '1.5rem auto', lineHeight: 1.6, fontSize: '1.1rem' }}>
          Gracias por unirte a la suscripción funcional. Aquí aprenderás a escuchar a tu cuerpo, paso a paso, 
          desde un enfoque humano y basado en fisiología funcional.
        </p>

        <div style={{ 
          background: 'rgba(161,92,56,0.1)', 
          padding: '1rem', 
          borderRadius: '8px', 
          color: '#A15C38', 
          fontWeight: 600, 
          margin: '2rem auto', 
          maxWidth: '600px',
          textAlign: 'center',
          fontSize: '1.05rem'
        }}>
          💡 Tu primer paso: Registrar tus primeros 5 días de alimentación, sueño y digestión.
        </div>

        <div style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ color: '#556B2F', fontSize: '1.3rem' }}>📋 ¿Qué incluye tu suscripción?</h3>
          <ul style={{ color: '#3A3A3A', lineHeight: 1.8, fontSize: '1.05rem' }}>
            <li>Análisis funcional de tu historial médico y hábitos.</li>
            <li>Interpretación personalizada de tus resultados y síntomas.</li>
            <li>Recomendaciones iniciales de alimentación y estilo de vida.</li>
            <li>Seguimiento semanal y actualización de tus avances.</li>
            <li>Evaluación de suplementos según tu caso, con precauciones y disclaimers.</li>
            <li>Revisión de análisis de sangre y contexto clínico general.</li>
          </ul>

          <h3 style={{ color: '#556B2F', fontSize: '1.3rem', marginTop: '2rem' }}>🧠 Antes de iniciar</h3>
          <p style={{ color: '#3A3A3A', lineHeight: 1.6, fontSize: '1.05rem' }}>
            Durante los próximos 5 días, anota lo que comes, cómo duermes y cómo evacúas.  
            No cambies nada aún — queremos conocer cómo responde tu cuerpo tal como está hoy.
          </p>
          <p style={{ color: '#3A3A3A', lineHeight: 1.6, fontSize: '1.05rem' }}>
            Este registro será la base para tus recomendaciones personalizadas.
          </p>
          
          <button 
            onClick={handleContinuar}
            data-testid="button-continuar-bienvenida"
            style={{
              display: 'block',
              margin: '2rem auto',
              background: '#556B2F',
              color: '#fff',
              padding: '1rem 2.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1.1rem',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(85,107,47,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4A5C26';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#556B2F';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Empezar mi registro funcional →
          </button>
        </div>

        <div 
          data-testid="motivational-phrase"
          style={{ 
            marginTop: '2rem', 
            padding: '1.2rem', 
            background: 'rgba(85,107,47,0.08)', 
            borderRadius: '10px', 
            textAlign: 'center', 
            color: '#556B2F', 
            fontStyle: 'italic', 
            fontWeight: 500,
            lineHeight: 1.6,
            fontSize: '1.05rem'
          }}
        >
          🌿 "Tu cuerpo no está roto, solo está protegiéndose.
          <br />
          Vamos a enseñarle cómo sentirse seguro otra vez." 🌿
        </div>
      </div>
    </div>
  );
}
