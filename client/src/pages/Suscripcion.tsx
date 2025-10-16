import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../styles/suscripcion.css";
import backgroundImage from "@assets/stock_images/soft_translucent_gre_3ac61690.jpg";

export default function Suscripcion() {
  const handleSubscribe = () => {
    // TODO: Integrar Paddle cuando esté listo
    alert("Paddle se integrará próximamente");
  };

  return (
    <div className="suscripcion-page">
      <Header />
      
      <div 
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

          <h2>Suscripción NutriMarvin Funcional</h2>

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
              >
                Unirme por $5 USD/mes
              </button>
            </div>

            <div className="footer-note">
              *El enlace de suscripción se habilitará pronto. Al registrarte, accederás a tu formulario de inicio funcional y diario de 5 días.
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
