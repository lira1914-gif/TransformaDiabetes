import { useState, useRef, useEffect } from "react";
import "../styles/suscripcion.css";
import backgroundImage from "@assets/stock_images/soft_translucent_gre_3ac61690.jpg";
import IntakeForm from "./IntakeForm";
import MensajePostIntake from "./MensajePostIntake";
import Registro5Dias from "./Registro5Dias";

export default function SuscripcionSection() {
  const [showBienvenida, setShowBienvenida] = useState(false);
  const [showBloqueMotivacional, setShowBloqueMotivacional] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [showMensajePost, setShowMensajePost] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bienvenidaRef = useRef<HTMLDivElement>(null);
  const bloqueMotivacionalRef = useRef<HTMLDivElement>(null);
  const intakeRef = useRef<HTMLDivElement>(null);
  const mensajePostRef = useRef<HTMLDivElement>(null);
  const registroRef = useRef<HTMLDivElement>(null);

  // Inicializar Paddle cuando se carga el componente
  useEffect(() => {
    const initializePaddle = async () => {
      if (window.Paddle) {
        try {
          // Para Paddle Billing con transacciones, no necesitamos llamar Initialize
          // El environment ya está configurado en el script tag
          console.log('Paddle.js cargado correctamente');
        } catch (error) {
          console.error('Error inicializando Paddle:', error);
        }
      }
    };
    
    initializePaddle();
  }, []);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // Llamar al endpoint de Paddle para crear checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error creando checkout:', error);
        alert(error.error || 'Error al procesar el pago. Por favor, intenta nuevamente.');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (data.transactionId) {
        console.log('Transaction ID recibido:', data.transactionId);
        
        // Por ahora, mostrar el transaction ID al usuario con instrucciones
        alert(`✅ Transacción creada correctamente!\n\nID: ${data.transactionId}\n\n⚠️ NOTA: El checkout de Paddle está en proceso de configuración.\n\nUna vez completado el onboarding de Paddle, este botón abrirá el formulario de pago automáticamente.`);
        
        // Mostrar sección de bienvenida de todos modos
        setShowBienvenida(true);
      } else {
        console.error('No se recibió transaction ID:', data);
        alert('Error: No se pudo crear la sesión de pago. Por favor, intenta nuevamente.');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servicio de pagos. Por favor, intenta nuevamente.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showBienvenida && bienvenidaRef.current) {
      // Hacer scroll suave a la sección de bienvenida
      setTimeout(() => {
        bienvenidaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [showBienvenida]);

  useEffect(() => {
    if (showIntake && intakeRef.current) {
      // Hacer scroll suave al formulario de intake
      setTimeout(() => {
        intakeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [showIntake]);

  useEffect(() => {
    if (showMensajePost && mensajePostRef.current) {
      // Hacer scroll suave al mensaje post-intake
      setTimeout(() => {
        mensajePostRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [showMensajePost]);

  useEffect(() => {
    if (showBloqueMotivacional && bloqueMotivacionalRef.current) {
      // Hacer scroll suave al bloque motivacional
      setTimeout(() => {
        bloqueMotivacionalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [showBloqueMotivacional]);

  useEffect(() => {
    if (showRegistro && registroRef.current) {
      // Hacer scroll suave al formulario de registro
      setTimeout(() => {
        registroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [showRegistro]);

  const handleIniciarRegistro = () => {
    setShowBloqueMotivacional(true);
  };

  const handleComenzarFormulario = () => {
    setShowIntake(true);
  };

  const handleIntakeComplete = () => {
    setShowMensajePost(true);
  };

  const handleContinuarRegistro = () => {
    setShowRegistro(true);
  };

  return (
    <section 
      id="suscripcion"
      className="suscripcion"
      style={{ '--suscripcion-bg-image': `url(${backgroundImage})` } as React.CSSProperties}
    >
      <div className="wrap">
        <h1>🌿 Tu transformación funcional comienza aquí</h1>
        <p className="sub">
          Acompañamiento humano + ciencia funcional para recuperar tu energía, estabilizar tu glucosa y reconectar con tu cuerpo.
          <br />
          <em>"Tu cuerpo no está roto — solo está protegiéndose."</em>
        </p>

        <h2>Suscripción TransformaDiabetes Funcional</h2>

        <div>
          <h3>Qué recibes por $5/mes:</h3>
          <ul>
            <li>Acceso a 10 mini guías funcionales ampliadas.</li>
            <li>Recomendaciones prácticas para equilibrar tu glucosa y energía.</li>
            <li>Revisión opcional de tus análisis de sangre para orientación funcional.</li>
            <li>Microhábitos semanales para mejorar digestión, descanso y claridad mental.</li>
            <li>Acceso al diario funcional y seguimiento personalizado.</li>
          </ul>

          <h3>Cómo funciona:</h3>
          <ol>
            <li>Suscríbete y obtén acceso a tu área personal.</li>
            <li>Completa tu historial funcional (intake médico y hábitos).</li>
            <li>Registra tus 5 días de comidas, sueño y digestión.</li>
            <li>Recibe tu primer análisis funcional y plan de ajustes personalizado.</li>
          </ol>

          <div className="cta">
            <button 
              onClick={handleSubscribe}
              data-testid="button-subscribe-page"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
            >
              {isLoading ? 'Procesando...' : 'Unirme por $5 USD/mes'}
            </button>
          </div>

          <div className="footer-note">
            *El enlace de suscripción se habilitará pronto. Al registrarte, accederás a tu formulario de inicio funcional y diario de 5 días.
          </div>

          <section className="disclaimer">
            <p>
              <strong>🩺 Aviso importante:</strong><br />
              El contenido presentado en TransformaDiabetes tiene fines exclusivamente educativos y no sustituye el consejo, diagnóstico ni tratamiento médico profesional. 
              La información compartida busca ayudarte a comprender mejor las señales de tu cuerpo desde un enfoque de nutrición funcional y autoconocimiento.
            </p>
            <p>
              Siempre consulta con tu médico o profesional de salud antes de realizar cambios en tu alimentación, suplementación o tratamiento médico.
            </p>
            <p className="update">
              <em>Última actualización: Octubre 2025</em>
            </p>
          </section>

          <footer className="mini-disclaimer">
            <p>
              © 2025 TransformaDiabetes. Este contenido es educativo y no sustituye la orientación médica profesional. 
              Consulta siempre con tu médico antes de realizar cambios en tu alimentación o tratamiento.
            </p>
          </footer>
        </div>

        {/* Sección de Bienvenida - Aparece después de suscribirse */}
        {showBienvenida && (
          <div 
            ref={bienvenidaRef}
            id="bienvenida"
            className="bienvenida-section"
            style={{
              marginTop: '3rem',
              background: 'rgba(250,248,244,0.9) url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60") center/cover no-repeat',
              borderRadius: '12px',
              padding: '4rem 1rem',
              animation: 'fadeInUp 1.2s ease forwards'
            }}
          >
            <div
              style={{
                margin: '0 auto',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #E6E3D9',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 8px 22px rgba(0,0,0,0.05)',
                maxWidth: '800px'
              }}
            >
              <h1 style={{ color: '#556B2F', textAlign: 'center' }}>
                ✨ Bienvenido a TransformaDiabetes Funcional
              </h1>
              <h2 style={{ color: '#A15C38', textAlign: 'center', fontSize: '1.5rem', marginTop: '0.5rem' }}>
                Tu camino hacia el equilibrio comienza hoy
              </h2>
              <p style={{ color: '#3A3A3A', textAlign: 'center', maxWidth: '650px', margin: '1rem auto', lineHeight: 1.6 }}>
                Gracias por unirte a la suscripción funcional. Aquí aprenderás a escuchar a tu cuerpo, paso a paso, 
                desde un enfoque humano y basado en fisiología funcional.
              </p>

              <div style={{ 
                background: 'rgba(161,92,56,0.1)', 
                padding: '1rem', 
                borderRadius: '8px', 
                color: '#A15C38', 
                fontWeight: 600, 
                margin: '1.5rem auto', 
                maxWidth: '600px',
                textAlign: 'center'
              }}>
                💡 Tu primer paso: Registrar tus primeros 5 días de alimentación, sueño y digestión.
              </div>

              <div style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
                <h3 style={{ color: '#556B2F' }}>📋 ¿Qué incluye tu suscripción?</h3>
                <ul style={{ color: '#3A3A3A', lineHeight: 1.6 }}>
                  <li>Análisis funcional de tu historial médico y hábitos.</li>
                  <li>Interpretación personalizada de tus resultados y síntomas.</li>
                  <li>Recomendaciones iniciales de alimentación y estilo de vida.</li>
                  <li>Seguimiento semanal y actualización de tus avances.</li>
                  <li>Evaluación de suplementos según tu caso, con precauciones y disclaimers.</li>
                  <li>Revisión de análisis de sangre y contexto clínico general.</li>
                </ul>

                <h3 style={{ color: '#556B2F' }}>🧠 Antes de iniciar</h3>
                <p style={{ color: '#3A3A3A' }}>
                  Durante los próximos 5 días, anota lo que comes, cómo duermes y cómo evacúas.  
                  No cambies nada aún — queremos conocer cómo responde tu cuerpo tal como está hoy.
                </p>
                <p style={{ color: '#3A3A3A' }}>
                  Este registro será la base para tus recomendaciones personalizadas.
                </p>
                <button 
                  onClick={handleIniciarRegistro}
                  data-testid="button-iniciar-registro"
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
                  Empezar mi registro funcional
                </button>
              </div>

              {/* Frase motivacional final */}
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
                  lineHeight: 1.6
                }}
              >
                🌿 "Tu cuerpo no está roto, solo está protegiéndose.
                <br />
                Vamos a enseñarle cómo sentirse seguro otra vez." 🌿
              </div>
            </div>
          </div>
        )}

        {/* Bloque Motivacional Diario */}
        {showBloqueMotivacional && (
          <section 
            ref={bloqueMotivacionalRef}
            id="bloque-motivacional-diario" 
            style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              background: '#FAF8F4',
              borderRadius: '12px',
              marginTop: '3rem',
              animation: 'fadeInUp 1.2s ease forwards'
            }}
            data-testid="bloque-motivacional"
          >
            <h2 style={{ color: '#556B2F' }}>🌿 ¡Bienvenido a tu espacio funcional!</h2>
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
              onClick={handleComenzarFormulario}
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
          </section>
        )}

        {/* Formulario de Historial Funcional (Intake) */}
        {showIntake && (
          <div ref={intakeRef}>
            <IntakeForm onComplete={handleIntakeComplete} />
          </div>
        )}

        {/* Mensaje Post-Intake */}
        {showMensajePost && (
          <div ref={mensajePostRef}>
            <MensajePostIntake onContinue={handleContinuarRegistro} />
          </div>
        )}

        {/* Formulario de Registro de 5 Días */}
        {showRegistro && (
          <div ref={registroRef}>
            <Registro5Dias />
          </div>
        )}
      </div>
    </section>
  );
}
