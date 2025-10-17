import { useState, useEffect, forwardRef } from "react";

// Lista de mensajes motivacionales funcionales
const mensajes = [
  "Tu cuerpo está aprendiendo a confiar nuevamente en ti. Acompáñalo con calma.",
  "No se trata de controlar tus síntomas, sino de entender su mensaje.",
  "Cada célula responde mejor a la calma que al miedo. Respira profundo.",
  "El descanso también es productividad metabólica. Permítete pausar.",
  "La inflamación no es enemiga, es un mensaje. Escúchalo antes de corregirlo.",
  "El equilibrio no se impone, se recupera con paciencia.",
  "Tu digestión refleja tu relación con el tiempo. Mastica lento, vive despacio.",
  "Cada decisión que tomas hoy enseña a tu cuerpo que puede sentirse seguro.",
  "No estás roto, estás en proceso de regulación. Sé paciente contigo.",
  "Dormir bien no es flojera, es fisiología funcional. Cuida tus noches."
];

interface BloqueMotivacionalRotatorioProps {
  onComenzar: () => void;
}

const BloqueMotivacionalRotatorio = forwardRef<HTMLElement, BloqueMotivacionalRotatorioProps>(
  ({ onComenzar }, ref) => {
    const [indice, setIndice] = useState(0);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
      // Cambiar mensaje automáticamente cada 30 segundos
      const intervalo = setInterval(() => {
        // Fade out
        setOpacity(0);
        
        // Después de 1.5 segundos, cambiar mensaje y fade in
        setTimeout(() => {
          setIndice((prevIndice) => (prevIndice + 1) % mensajes.length);
          setOpacity(1);
        }, 1500);
      }, 30000); // 30 segundos

      return () => clearInterval(intervalo);
    }, []);

    return (
      <section 
        ref={ref}
        id="bloque-motivacional-diario" 
        className="motivacional-section"
        style={{
          padding: '50px 25px',
          textAlign: 'center',
          background: '#f8faf7',
          borderRadius: '12px',
          marginTop: '40px',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.5s ease',
          animation: 'fadeInUp 1.2s ease forwards'
        }}
        data-testid="bloque-motivacional"
      >
        <h2 style={{ 
          color: '#587250', 
          fontWeight: 700, 
          marginBottom: '20px',
          fontSize: '1.6em'
        }}>
          🌱 Mensaje Funcional del Día
        </h2>
        
        <p 
          id="mensaje-rotatorio" 
          data-testid="mensaje-rotatorio"
          style={{ 
            fontSize: '1.25em', 
            color: '#3b3b3b', 
            lineHeight: 1.7,
            maxWidth: '680px',
            margin: '1rem auto',
            opacity: opacity,
            transition: 'opacity 1.5s ease'
          }}
        >
          {mensajes[indice]}
        </p>
        
        <p style={{ 
          marginTop: '15px', 
          fontStyle: 'italic', 
          color: '#7d7d7d',
          fontSize: '0.95em',
          marginBottom: '2rem'
        }}>
          Cada día es una oportunidad de escuchar a tu cuerpo con compasión.
        </p>

        <div style={{
          borderTop: '1px solid #e0e0e0',
          paddingTop: '2rem',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ 
            color: '#556B2F',
            marginBottom: '1rem'
          }}>
            🩺 Tu Proceso de Registro Funcional
          </h3>
          <p style={{ 
            maxWidth: '680px', 
            margin: '1rem auto', 
            color: '#3A3A3A', 
            lineHeight: 1.6 
          }}>
            Gracias por unirte a <strong>TransformaDiabetes</strong>.  
            <br />
            A partir de hoy, empezamos a conocer cómo se comporta tu cuerpo desde la raíz.  
            <br /><br />
            🩺 Primero completaremos tu <strong>formulario personal de salud</strong> — esto nos ayudará a entender tu historia, síntomas y hábitos actuales.  
            <br /><br />
            Luego pasaremos al <strong>registro funcional de 5 días</strong>, donde podrás anotar lo que comes, cómo duermes y cómo responde tu cuerpo.
          </p>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#6F6E66', 
            marginTop: '1rem' 
          }}>
            Este proceso es 100% confidencial y educativo. No reemplaza la atención médica profesional.
          </p>
          
          <button 
            onClick={onComenzar}
            data-testid="button-comenzar-formulario"
            style={{
              display: 'block',
              margin: '2rem auto',
              background: '#556B2F',
              color: '#fff',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#4A5C26'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#556B2F'}
          >
            Comenzar mi formulario de salud
          </button>
        </div>
      </section>
    );
  }
);

BloqueMotivacionalRotatorio.displayName = "BloqueMotivacionalRotatorio";

export default BloqueMotivacionalRotatorio;
