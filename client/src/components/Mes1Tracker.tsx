import { useState, useEffect, forwardRef } from "react";
import { useLocation } from "wouter";

interface Mes1TrackerProps {
  onIrRegistro: () => void;
}

const Mes1Tracker = forwardRef<HTMLElement, Mes1TrackerProps>(
  ({ onIrRegistro }, ref) => {
    const [, setLocation] = useLocation();
    const [diasRegistro, setDiasRegistro] = useState(0);
    const [diasSuscripcion, setDiasSuscripcion] = useState(0);

    useEffect(() => {
      // Inicializar fecha de suscripción si no existe
      if (!localStorage.getItem('tm_subscribed_at')) {
        localStorage.setItem('tm_subscribed_at', String(Date.now()));
      }

      // Calcular días desde suscripción
      const t0 = Number(localStorage.getItem('tm_subscribed_at') || Date.now());
      const dias = Math.max(0, Math.floor((Date.now() - t0) / (1000 * 60 * 60 * 24)));
      setDiasSuscripcion(dias);

      // Chequear progreso del registro
      const checkProgreso = () => {
        // Intentar leer de ambas ubicaciones por compatibilidad
        const registroDetallado = localStorage.getItem('registro5dias_detallado');
        const registroSimple = localStorage.getItem('registro5dias');
        const registroData = registroDetallado || registroSimple;
        
        if (registroData) {
          try {
            const data = JSON.parse(registroData);
            const totalDias = Math.min(5, data.length || 0);
            setDiasRegistro(totalDias);
            localStorage.setItem('tm_registro_dias', String(totalDias));
          } catch (e) {
            setDiasRegistro(0);
          }
        } else {
          setDiasRegistro(0);
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

    const limpiarDatosPrueba = () => {
      if (confirm('¿Seguro que deseas borrar TODOS los datos (intake + registro) y empezar completamente de nuevo?')) {
        // Borrar TODO lo relacionado con onboarding
        localStorage.removeItem('registro5dias');
        localStorage.removeItem('tm_registro_dias');
        localStorage.removeItem('tm_registro_completado');
        localStorage.removeItem('tm_intake_done');
        localStorage.removeItem('tm_intake_data');
        localStorage.removeItem('tm_mensaje_done');
        localStorage.removeItem('tm_informe_ready');
        localStorage.removeItem('tm_motivacion_done');
        
        setDiasRegistro(0);
        alert('✅ Todos los datos borrados. Serás redirigido al inicio del onboarding.');
        
        // Redirigir al inicio del onboarding
        window.location.href = '/onboarding/bienvenida';
      }
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
            Mes 1 — Observa a tu cuerpo con curiosidad
          </h2>
          <p style={{ 
            color: '#6F6E66', 
            textAlign: 'center', 
            margin: '.25rem 0 1.25rem',
            lineHeight: 1.7
          }}>
            Durante estos primeros días, solo queremos conocerte mejor.<br/>
            Registra tus comidas, descanso y hábitos sin intentar cambiarlos.<br/>
            Tu cuerpo no está roto: solo está adaptándose, y observarlo es el primer paso para acompañarlo.
          </p>

          {diasRegistro < 5 && (
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
            </div>
          )}

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
                <li>Escuchar las señales de tu energía, digestión y descanso.</li>
                <li>Reconocer qué alimentos y ritmos te estabilizan.</li>
                <li>Recordar que sanar no es controlar: es comprender.</li>
                <li>Dar espacio al descanso: tu cuerpo solo puede sanar cuando se siente seguro.</li>
              </ul>
            </div>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E6E3D9',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              <strong style={{ color: '#A15C38' }}>Sugerencia funcional diaria:</strong>
              <div 
                style={{ 
                  marginTop: '.5rem', 
                  color: '#3A3A3A',
                  lineHeight: 1.7
                }}
                data-testid="mes1-tip"
              >
                Después de comer, camina o muévete suavemente unos minutos.<br/>
                No es ejercicio: es una forma de decirle a tu cuerpo "estás a salvo".
              </div>
            </div>
          </div>

          {diasRegistro >= 5 ? (
            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem'
            }}>
              <p style={{
                color: '#556B2F',
                fontWeight: 600,
                marginBottom: '1rem',
                fontSize: '1rem'
              }}>
                ✨ ¡Excelente! Has completado tu evaluación inicial.
              </p>
              <p style={{
                color: '#6F6E66',
                marginBottom: '1.5rem',
                lineHeight: 1.6
              }}>
                Ahora vamos a analizar toda esta información (formulario + registro de 5 días)<br/>
                para crear tu plan personalizado de la primera semana.
              </p>
              <button 
                onClick={handleGenerarInforme}
                data-testid="button-generar-informe"
                style={{
                  background: '#556B2F',
                  color: '#fff',
                  padding: '1rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#4A5C26'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#556B2F'}
              >
                Generar mi informe inicial
              </button>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem'
            }}>
              <button 
                onClick={onIrRegistro}
                data-testid="button-ir-registro-mes1"
                style={{
                  background: '#A15C38',
                  color: '#fff',
                  padding: '1rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#8A4D2F'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#A15C38'}
              >
                Continuar mi registro de 5 días
              </button>
            </div>
          )}

          {/* Botón temporal para limpiar datos de prueba */}
          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px dashed #E6E3D9' }}>
            <button 
              onClick={limpiarDatosPrueba}
              data-testid="button-limpiar-datos"
              style={{
                background: '#dc2626',
                color: '#fff',
                padding: '.6rem 1rem',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
            >
              🗑️ Borrar datos de prueba
            </button>
            <p style={{ fontSize: '0.8rem', color: '#6F6E66', marginTop: '0.5rem' }}>
              (Solo para desarrollo - Limpia el registro y permite empezar de nuevo)
            </p>
          </div>
        </section>
      </>
    );
  }
);

Mes1Tracker.displayName = "Mes1Tracker";

export default Mes1Tracker;
