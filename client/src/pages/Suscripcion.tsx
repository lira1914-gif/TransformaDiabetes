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
            Acompañamiento humano + ciencia funcional para recuperar tu energía, estabilizar tu glucosa y reconectar con tu cuerpo.  
            <br />Tu cuerpo no está roto — solo está protegiéndose.
          </p>

          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1556228578-4cdd6d0a6d2b?auto=format&fit=crop&w=800&q=80"
              alt="Persona relajada revisando su progreso funcional"
            />
          </div>

          <h2>Suscripción NutriMarvin Funcional</h2>

          <div className="columns">
            <div className="col">
              <h3>💚 Qué recibes por $5/mes</h3>
              <ul>
                <li>Acceso a <strong>10 mini guías funcionales</strong> ampliadas.</li>
                <li>Recomendaciones prácticas para <strong>equilibrar tu glucosa</strong> y tu energía.</li>
                <li>Opción de enviar tus <strong>análisis de sangre</strong> para revisión personalizada.</li>
                <li>Microhábitos semanales para mejorar digestión, estrés y descanso.</li>
                <li>Contenido educativo sobre nutrición funcional y hormonas.</li>
              </ul>
            </div>

            <div className="col">
              <h3>🧭 Cómo funciona</h3>
              <ol>
                <li>Suscríbete para obtener acceso seguro y exclusivo.</li>
                <li>Completa tu <strong>historial funcional</strong> (alimentación, sueño, síntomas, hábitos).</li>
                <li>Registra tus comidas y sensaciones durante los <strong>primeros 5 días</strong>.</li>
                <li>Recibe tus recomendaciones iniciales + plan de ajustes personalizados.</li>
                <li>Accede a la comunidad y herramientas de seguimiento.</li>
              </ol>
            </div>
          </div>

          <div className="cta">
            <button 
              onClick={handleSubscribe}
              data-testid="button-subscribe-page"
            >
              💳 Unirme por $5 USD/mes
            </button>
            <p>Cancela en cualquier momento. Sin permanencia.</p>
          </div>

          <div className="trust">
            <p>Más de 300 personas ya han iniciado su camino funcional con NutriMarvin.</p>
            <p>Este programa es educativo y no sustituye el consejo médico profesional.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
