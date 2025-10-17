export default function InformeFuncional() {
  return (
    <section 
      id="informe-inicial" 
      style={{
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
  );
}
