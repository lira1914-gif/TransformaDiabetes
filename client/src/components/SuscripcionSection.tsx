import { useState } from "react";
import { useLocation } from "wouter";
import "../styles/suscripcion.css";
import backgroundImage from "@assets/stock_images/soft_translucent_gre_3ac61690.jpg";

export default function SuscripcionSection() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    // Redirigir a la pantalla de bienvenida del trial (NO al checkout)
    setLocation('/onboarding/bienvenida-trial');
  };

  return (
    <section 
      id="suscripcion"
      className="suscripcion"
      style={{ '--suscripcion-bg-image': `url(${backgroundImage})` } as React.CSSProperties}
    >
      <div className="wrap">
        <h1>Tu transformación funcional comienza aquí.</h1>
        <p className="sub">
          Accede a una guía práctica, sesiones interactivas y recomendaciones personalizadas para entender tu cuerpo, no solo controlar los síntomas.
          <br /><br />
          Da el primer paso con orientación real y herramientas que te ayuden a crear equilibrio físico, mental y metabólico.
        </p>

        <h2>¿Qué incluye tu prueba gratuita?</h2>

        <div>
          <h3>Durante tus 7 días gratuitos recibes:</h3>
          <ul>
            <li>Informe funcional con raíces y recomendaciones personalizadas</li>
            <li>Chat funcional semanal (educativo, no médico)</li>
            <li>Acompañamiento mensual por módulos, sin dietas extremas</li>
            <li>Acceso a historial y progreso</li>
          </ul>

          <h3>Cómo funciona:</h3>
          <ol>
            <li>Comienza tu prueba gratuita de 7 días (sin costo).</li>
            <li>Completa tu historial funcional (intake médico y hábitos).</li>
            <li>Registra tus 5 días de comidas, sueño y digestión.</li>
            <li>Recibe tu análisis funcional y plan de ajustes personalizado.</li>
            <li>Después de 7 días, si decides continuar, se activa automáticamente tu suscripción por $5 USD/mes.</li>
          </ol>

          <div className="cta">
            <button 
              onClick={handleSubscribe}
              data-testid="button-subscribe-page"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
            >
              {isLoading ? 'Procesando...' : 'Comenzar prueba gratuita de 7 días'}
            </button>
          </div>

          <div className="footer-note">
             Pago seguro procesado por Stripe. Cancela cuando quieras desde tu perfil.
          </div>
          
          <p className="text-sm mt-4" style={{ color: '#6F6E66', textAlign: 'center' }}>
            Programa educativo. No reemplaza la orientación médica.
          </p>

          <section className="disclaimer">
            <p>
              <strong> Aviso importante:</strong><br />
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
