import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function MensajeFinalRegistro() {
  const [, setLocation] = useLocation();

  const handleVerRecomendaciones = () => {
    // Navegar a /onboarding/mes1 para ver el tablero y generar el informe
    setLocation('/onboarding/mes1');
  };

  return (
    <section
      id="mensajeFinal"
      style={{
        background: '#FFFFFF',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid #E6E3D9',
        marginTop: '2rem',
        borderRadius: '12px'
      }}
    >
      <div style={{ maxWidth: '700px', margin: 'auto' }}>
        <h2 style={{ color: '#556B2F', marginBottom: '1rem' }}>
           Has completado tu Registro Funcional
        </h2>
        <p style={{ color: '#3A3A3A', fontSize: '1.1rem', marginBottom: '1.2rem' }}>
          Tu cuerpo se comunica contigo todos los días — y ahora estás aprendiendo a escucharlo.
        </p>
        <p style={{ color: '#6F6E66', marginBottom: '2rem' }}>
          Este registro es el primer paso para entender cómo tus hábitos, emociones y alimentos
          <br />
          influyen en tu energía, digestión y bienestar general.
        </p>
        
        <blockquote
          style={{
            fontStyle: 'italic',
            color: '#A15C38',
            borderLeft: '4px solid #A15C38',
            paddingLeft: '1rem',
            margin: '1.5rem auto',
            maxWidth: '600px',
            textAlign: 'left'
          }}
        >
          "Tu cuerpo no puede sanar en estado de alerta.
          <br />
          Aprender a escucharlo es la forma más profunda de sanación."
        </blockquote>

        <p style={{ color: '#3A3A3A', marginTop: '2rem' }}>
          A continuación, recibirás tus <strong>recomendaciones funcionales iniciales</strong>
          <br />
          basadas en tu historial y tus 5 días de registro.
          <br />
          Estas te ayudarán a comenzar con ajustes simples y sostenibles.
        </p>

        <p style={{ color: '#6F6E66', marginTop: '1rem', marginBottom: '2rem' }}>
          Recuerda: este proceso no se trata de control, sino de confianza.
          <br />
          Estás creando una relación nueva con tu cuerpo. 
        </p>

        <Button
          onClick={handleVerRecomendaciones}
          data-testid="button-ver-recomendaciones"
          style={{
            backgroundColor: '#A15C38',
            color: 'white',
            padding: '.9rem 1.5rem',
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          Ver mis recomendaciones iniciales
        </Button>
      </div>
    </section>
  );
}
