import { Button } from "@/components/ui/button";

interface MensajePostIntakeProps {
  onContinue: () => void;
}

export default function MensajePostIntake({ onContinue }: MensajePostIntakeProps) {
  return (
    <section
      id="mensajePostIntake"
      style={{
        background: '#FAF8F4',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        marginTop: '2rem',
        borderRadius: '12px'
      }}
    >
      <div style={{ maxWidth: '700px', margin: 'auto' }}>
        <h2 style={{ color: '#556B2F', marginBottom: '1rem' }}>
          Excelente 🌿
        </h2>
        <p style={{ color: '#3A3A3A', fontSize: '1.1rem', marginBottom: '1.2rem' }}>
          Gracias por compartir tu historia funcional.
          <br />
          Con esa información podremos entender mejor cómo responde tu cuerpo.
        </p>
        <p style={{ color: '#6F6E66', marginBottom: '2rem' }}>
          Ahora vamos a observar tu día a día — cómo te alimentas, duermes y eliminas —
          <br />
          para encontrar los patrones que afectan tu energía y equilibrio.
        </p>
        <h3 style={{ color: '#A15C38', marginBottom: '1rem' }}>
          📔 Tu siguiente paso:
        </h3>
        <p style={{ color: '#3A3A3A', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          Completa tu <strong>Registro Funcional de 5 Días</strong>.
          <br />
          No se trata de hacerlo perfecto, sino de observar con curiosidad cómo responde tu cuerpo.
        </p>
        <p style={{ color: '#6F6E66', fontSize: '.9rem', marginBottom: '2rem' }}>
          (Recuerda: si un día olvidas registrar algo, no te preocupes.
          <br />
          Lo importante es la constancia, no la perfección.)
        </p>
        
        <Button
          onClick={onContinue}
          data-testid="button-continuar-registro"
          style={{
            backgroundColor: '#556B2F',
            color: 'white',
            padding: '1rem 2.5rem',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Comenzar mi registro de 5 días
        </Button>
      </div>
    </section>
  );
}
