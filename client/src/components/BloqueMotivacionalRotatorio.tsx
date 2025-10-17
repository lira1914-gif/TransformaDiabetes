import { useState, useEffect, forwardRef } from "react";

// Lista de mensajes motivacionales funcionales
const mensajes = [
  "Tu cuerpo está empezando a liberar patrones antiguos. Obsérvalo sin juicio, con calma.",
  "No se trata de perfección, sino de conexión. Escucha cómo responde tu cuerpo hoy.",
  "Tu sistema necesita seguridad para sanar. Permítete descansar sin culpa.",
  "Respira profundo. El equilibrio no se fuerza, se permite.",
  "Hidrátate con conciencia. El agua limpia más que tu cuerpo: aclara tu mente.",
  "La inflamación es comunicación. Agradece el mensaje antes de corregirlo.",
  "Tu digestión refleja cómo procesas la vida. Mastica lento, vive despacio.",
  "No estás roto, estás adaptándose. Cada síntoma es una forma de protección.",
  "Dormir bien no es un lujo, es tu medicina nocturna. Regálate ese descanso.",
  "Cada elección alimenta una dirección. Hoy eliges sanar."
];

interface BloqueMotivacionalRotatorioProps {
  onComenzar: () => void;
}

const BloqueMotivacionalRotatorio = forwardRef<HTMLElement, BloqueMotivacionalRotatorioProps>(
  ({ onComenzar }, ref) => {
    const [mensajeDelDia, setMensajeDelDia] = useState("");

    useEffect(() => {
      // Seleccionar un mensaje aleatorio al cargar el componente
      const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
      setMensajeDelDia(mensajeAleatorio);
    }, []);

    return (
      <section 
        ref={ref}
        id="bloque-motivacional-diario" 
        className="motivacional-section"
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: '#f7f9f6',
          borderRadius: '12px',
          marginTop: '30px',
          animation: 'fadeInUp 1.2s ease forwards'
        }}
        data-testid="bloque-motivacional"
      >
        <h2 style={{ 
          color: '#5b7053', 
          fontWeight: 700, 
          marginBottom: '15px' 
        }}>
          🌿 Mensaje Funcional del Día
        </h2>
        
        <p 
          id="mensaje-rotatorio" 
          data-testid="mensaje-rotatorio"
          style={{ 
            fontSize: '1.2em', 
            color: '#3c3c3c', 
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '1rem auto'
          }}
        >
          {mensajeDelDia}
        </p>
        
        <p style={{ 
          marginTop: '10px', 
          fontStyle: 'italic', 
          color: '#7a7a7a',
          marginBottom: '2rem'
        }}>
          Cada día recibirás un recordatorio diferente para mantenerte enfocado en tu proceso de equilibrio.
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
