import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../styles/suscripcion.css";

export default function Suscripcion() {
  const handleSubscribe = () => {
    // TODO: Integrar Paddle cuando esté listo
    alert("Paddle se integrará próximamente");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="suscripcion">
        <div className="wrap">
          <h1>🌿 Tu transformación funcional comienza aquí</h1>
          <p className="sub">
            Acompañamiento humano + ciencia funcional para equilibrar tu glucosa y energía.
          </p>

          <h2>Suscripción NutriMarvin Funcional</h2>

          <div>
            <h3>Qué recibes por $5/mes:</h3>
            <ul>
              <li>Acceso a las 10 mini guías funcionales ampliadas.</li>
              <li>Recomendaciones personalizadas para revertir resistencia a la insulina.</li>
              <li>Opción de subir tus análisis de sangre para revisión funcional.</li>
              <li>Microhábitos semanales para digestión, descanso y claridad mental.</li>
            </ul>

            <h3>Cómo funciona:</h3>
            <ol>
              <li>Suscríbete y obtén acceso seguro a tu área personal.</li>
              <li>Completa tu historial funcional (intake médico y hábitos).</li>
              <li>Registra 5 días de comidas, sueño y digestión.</li>
              <li>Recibe tu análisis y recomendaciones iniciales.</li>
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
              *Al suscribirte, accederás a tu formulario funcional y guía inicial paso a paso.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
