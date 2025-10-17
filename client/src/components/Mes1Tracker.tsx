import { useState, useEffect, forwardRef } from "react";

const tips = [
  "Incluye grasa + fibra + proteína en cada comida para estabilizar el azúcar.",
  "Respira 5 veces lento antes de comer: baja el cortisol y mejora tu digestión.",
  "Muévete 10 minutos después de comer: ayuda a tu glucosa a mantenerse estable.",
  "Hidrátate: tu hígado y tu intestino trabajan mejor con agua suficiente.",
  "Duerme 7–8h: el descanso es tu medicina nocturna."
];

interface Mes1TrackerProps {
  onIrRegistro: () => void;
}

const Mes1Tracker = forwardRef<HTMLElement, Mes1TrackerProps>(
  ({ onIrRegistro }, ref) => {
    const [diasRegistro, setDiasRegistro] = useState(0);
    const [diasSuscripcion, setDiasSuscripcion] = useState(0);
    const [tipDelDia, setTipDelDia] = useState("");
    const [mostrarInforme, setMostrarInforme] = useState(false);
    const [informeVisible, setInformeVisible] = useState(false);

    useEffect(() => {
      // Inicializar fecha de suscripción si no existe
      if (!localStorage.getItem('tm_subscribed_at')) {
        localStorage.setItem('tm_subscribed_at', String(Date.now()));
      }

      // Calcular días desde suscripción
      const t0 = Number(localStorage.getItem('tm_subscribed_at') || Date.now());
      const dias = Math.max(0, Math.floor((Date.now() - t0) / (1000 * 60 * 60 * 24)));
      setDiasSuscripcion(dias);

      // Seleccionar tip aleatorio
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setTipDelDia(randomTip);

      // Chequear progreso del registro
      const checkProgreso = () => {
        const registroData = localStorage.getItem('registro5dias');
        if (registroData) {
          try {
            const data = JSON.parse(registroData);
            const totalDias = Math.min(5, data.length || 0);
            setDiasRegistro(totalDias);
            localStorage.setItem('tm_registro_dias', String(totalDias));
          } catch (e) {
            setDiasRegistro(0);
          }
        }
      };

      checkProgreso();
      const interval = setInterval(checkProgreso, 1500);

      return () => clearInterval(interval);
    }, []);

    const handleGenerarInforme = () => {
      setMostrarInforme(true);
      setTimeout(() => {
        setInformeVisible(true);
        const target = document.getElementById('informe-inicial');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    };

    return (
      <>
        <section 
          ref={ref}
          id="mes1" 
          style={{
            background: '#FAF8F4',
            padding: '2.5rem 1.25rem',
            border: '1px solid #E6E3D9',
            borderRadius: '12px',
            margin: '28px auto',
            maxWidth: '850px',
            animation: 'fadeInUp 1.2s ease forwards'
          }}
          data-testid="mes1-tracker"
        >
          <h2 style={{ 
            color: '#556B2F', 
            textAlign: 'center', 
            margin: '0 0 .5rem' 
          }}>
            Mes 1 — Observa y comprende tu cuerpo
          </h2>
          <p style={{ 
            color: '#6F6E66', 
            textAlign: 'center', 
            margin: '.25rem 0 1.25rem' 
          }}>
            Establece tu línea base: registra 5 días de <strong>comidas, sueño y evacuación</strong>. No busques perfección — busca patrones.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <span 
              style={{
                background: '#fff',
                border: '1px solid #E6E3D9',
                borderRadius: '999px',
                padding: '.4rem .8rem',
                color: '#3A3A3A'
              }}
              data-testid="mes1-progreso"
            >
              Progreso diario: {diasRegistro}/5 días
            </span>
            <span 
              style={{
                background: '#fff',
                border: '1px solid #E6E3D9',
                borderRadius: '999px',
                padding: '.4rem .8rem',
                color: '#3A3A3A'
              }}
              data-testid="mes1-dias-suscripcion"
            >
              Día {diasSuscripcion} desde tu suscripción
            </span>
          </div>

          <div style={{
            display: 'grid',
            gap: '.75rem',
            maxWidth: '720px',
            margin: '0 auto 1rem'
          }}>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E6E3D9',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              <strong style={{ color: '#A15C38' }}>Objetivo del mes:</strong>
              <ul style={{ 
                margin: '.5rem 0 0 1rem', 
                lineHeight: 1.7 
              }}>
                <li>Observar tu energía y digestión sin juzgarte.</li>
                <li>Identificar alimentos y horarios que te estabilizan.</li>
                <li>Priorizar descanso: <em>"tu cuerpo no puede sanar en estado de alerta"</em>.</li>
              </ul>
            </div>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E6E3D9',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              <strong style={{ color: '#A15C38' }}>Sugerencia diaria:</strong>
              <div 
                style={{ 
                  marginTop: '.5rem', 
                  color: '#3A3A3A' 
                }}
                data-testid="mes1-tip"
              >
                {tipDelDia}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '1rem',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={onIrRegistro}
              data-testid="button-ir-registro-mes1"
              style={{
                background: '#A15C38',
                color: '#fff',
                padding: '.9rem 1.2rem',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#8A4D2F'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#A15C38'}
            >
              Ir a mi registro de 5 días
            </button>
            {diasRegistro >= 5 && (
              <button 
                onClick={handleGenerarInforme}
                data-testid="button-generar-informe"
                style={{
                  background: '#556B2F',
                  color: '#fff',
                  padding: '.9rem 1.2rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#4A5C26'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#556B2F'}
              >
                Generar mi informe inicial
              </button>
            )}
          </div>
        </section>

        {/* Informe Inicial (placeholder) */}
        {mostrarInforme && (
          <section 
            id="informe-inicial" 
            style={{
              opacity: informeVisible ? 1 : 0,
              transform: informeVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity .6s ease, transform .6s ease',
              maxWidth: '850px',
              margin: '24px auto',
              padding: '1.25rem',
              background: '#FFFFFF',
              border: '1px solid #E6E3D9',
              borderRadius: '12px'
            }}
            data-testid="informe-inicial"
          >
            <h3 style={{ color: '#556B2F', marginTop: 0 }}>
              Informe inicial — en preparación
            </h3>
            <p style={{ color: '#6F6E66' }}>
              Cuando completes tus 5 días, aquí verás tu <strong>resumen funcional</strong> y tus <strong>primeros pasos</strong>.
            </p>
          </section>
        )}
      </>
    );
  }
);

Mes1Tracker.displayName = "Mes1Tracker";

export default Mes1Tracker;
