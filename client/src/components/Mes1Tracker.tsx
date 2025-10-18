import { useState, useEffect, forwardRef } from "react";
import { useLocation } from "wouter";

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
    const [, setLocation] = useLocation();
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

      // Verificar si el informe ya fue generado
      const informeReady = localStorage.getItem('tm_informe_ready') === 'true';
      if (informeReady) {
        setMostrarInforme(true);
        setInformeVisible(true);
      }

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
      // Marcar que el informe está listo
      localStorage.setItem('tm_informe_ready', 'true');
      // Redirigir a la página del informe
      setLocation('/onboarding/informe-inicial');
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

        {/* Informe Inicial - Semana 1 */}
        {mostrarInforme && (
          <section 
            id="informe-inicial" 
            style={{
              opacity: informeVisible ? 1 : 0,
              transform: informeVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity .6s ease, transform .6s ease',
              maxWidth: '850px',
              margin: '28px auto',
              padding: '1.8rem',
              background: '#FFFFFF',
              border: '1px solid #E6E3D9',
              borderRadius: '14px',
              boxShadow: '0 6px 18px rgba(0,0,0,.04)'
            }}
            data-testid="informe-inicial"
          >
            <h2 style={{ 
              color: '#556B2F', 
              textAlign: 'center', 
              marginTop: 0 
            }}>
              🌱 Tu Informe Funcional — Semana 1
            </h2>
            <p style={{ 
              color: '#6F6E66', 
              textAlign: 'center', 
              maxWidth: '680px', 
              margin: '0 auto 1.5rem' 
            }}>
              Este es un resumen de los primeros 5 días de tu registro.  
              A partir de tus observaciones, el sistema detecta señales de tu cuerpo y te ofrece pasos funcionales para comenzar desde la raíz.
            </p>

            <div style={{ 
              borderTop: '1px solid #E6E3D9', 
              margin: '1.25rem 0' 
            }}></div>

            <h3 style={{ 
              color: '#A15C38', 
              marginBottom: '.5rem' 
            }}>
              🧠 Tu patrón funcional predominante:
            </h3>
            <p style={{ 
              marginTop: 0, 
              color: '#3A3A3A', 
              lineHeight: 1.6 
            }}>
              Tu registro muestra variaciones en energía, digestión y descanso que sugieren un patrón <strong>metabólico adaptativo</strong>.  
              Tu cuerpo no está roto — está intentando protegerte del exceso de carga (glucosa, estrés o inflamación).
            </p>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ 
                color: '#A15C38', 
                marginBottom: '.5rem' 
              }}>
                💡 Tus primeros pasos funcionales
              </h3>
              <ol style={{ 
                color: '#3A3A3A', 
                lineHeight: 1.8, 
                marginTop: 0 
              }}>
                <li><strong>Equilibra tus comidas:</strong> incluye grasa, fibra y proteína en cada plato. Esto estabiliza tu azúcar y tu energía.</li>
                <li><strong>Elimina lo que inflama:</strong> evita azúcares, ultraprocesados, aceites refinados y harinas blancas.</li>
                <li><strong>Prioriza tu digestión:</strong> mastica despacio, respira antes de comer y busca evacuar a diario.</li>
                <li><strong>Regula el estrés:</strong> tu cuerpo no puede sanar en estado de alerta. Practica respiración 4–7–8 o pausas conscientes.</li>
                <li><strong>Duerme y repara:</strong> apaga pantallas 1 hora antes de dormir, evita comer pesado y mantén un horario constante.</li>
                <li><strong>Muévete suave:</strong> 10–20 minutos después de comer mejora tu sensibilidad a la insulina.</li>
              </ol>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ 
                color: '#A15C38', 
                marginBottom: '.5rem' 
              }}>
                🌿 Recomendaciones complementarias
              </h3>
              <ul style={{ 
                color: '#3A3A3A', 
                lineHeight: 1.7, 
                marginTop: 0 
              }}>
                <li><strong>Apoya tu hígado:</strong> masaje suave con aceite de ricino (si no hay heridas en la piel) o infusiones de diente de león.</li>
                <li><strong>Estimula tu linfa:</strong> cepillado seco 5 min antes de la ducha.</li>
                <li><strong>Evita microplásticos:</strong> guarda tus alimentos en vidrio y evita calentar plástico.</li>
                <li><strong>Come natural:</strong> alimentos reales, orgánicos y coloridos — tus mitocondrias lo agradecen.</li>
              </ul>
            </div>

            <div style={{ 
              marginTop: '1.75rem', 
              background: '#FAF8F4', 
              borderRadius: '10px', 
              padding: '1.25rem', 
              border: '1px solid #E6E3D9' 
            }}>
              <p style={{ margin: 0, color: '#3A3A3A' }}>
                💬 <em>"Sanar no es controlar, es comprender el mensaje de tu cuerpo."</em><br />
                Esta primera semana se trata de <strong>observar sin juzgar</strong>.  
                La próxima etapa incluirá ajustes alimenticios más específicos y el inicio del diario funcional guiado por IA.
              </p>
            </div>

            <div style={{ 
              marginTop: '2rem', 
              textAlign: 'center' 
            }}>
              <button 
                id="btnContinuarMes2"
                data-testid="button-continuar-mes2"
                style={{
                  background: '#A15C38',
                  color: '#fff',
                  padding: '.9rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#8A4D2F'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#A15C38'}
                onClick={() => alert('Mes 2 próximamente - funcionalidad en desarrollo')}
              >
                Continuar al Mes 2 — Ajusta y experimenta
              </button>
            </div>
          </section>
        )}
      </>
    );
  }
);

Mes1Tracker.displayName = "Mes1Tracker";

export default Mes1Tracker;
