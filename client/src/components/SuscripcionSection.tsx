import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import "../styles/suscripcion.css";
import backgroundImage from "@assets/stock_images/soft_translucent_gre_3ac61690.jpg";

export default function SuscripcionSection() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

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
        
        // Guardar marca de suscripción y redirigir a bienvenida
        localStorage.setItem('tm_subscribed_at', String(Date.now()));
        
        // Por ahora, mostrar el transaction ID al usuario con instrucciones
        alert(`✅ Transacción creada correctamente!\n\nID: ${data.transactionId}\n\n⚠️ NOTA: El checkout de Paddle está en proceso de configuración.\n\nUna vez completado el onboarding de Paddle, este botón abrirá el formulario de pago automáticamente.`);
        
        // Redirigir a la página de bienvenida del onboarding
        setLocation('/onboarding/bienvenida');
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
      </div>
    </section>
  );
}
