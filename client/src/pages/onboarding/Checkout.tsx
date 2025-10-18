import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/hooks/use-toast";

// Cargar Stripe fuera del componente
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Falta la clave VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/onboarding/bienvenida`,
        },
      });

      if (error) {
        toast({
          title: "Error en el pago",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Guardar marca de suscripción
        localStorage.setItem('tm_subscribed_at', String(Date.now()));
        
        toast({
          title: "¡Pago exitoso!",
          description: "Bienvenido a TransformaDiabetes",
        });
        
        setLocation('/onboarding/bienvenida');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al procesar el pago",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        data-testid="button-submit-payment"
        style={{
          marginTop: '2rem',
          width: '100%',
          padding: '1rem',
          background: isProcessing ? '#ccc' : '#A15C38',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: 600,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
        }}
      >
        {isProcessing ? 'Procesando...' : 'Pagar $5 USD/mes'}
      </button>
    </form>
  );
}

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Crear sesión de pago con Stripe
    fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al crear la sesión de pago');
        }
        return res.json();
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError('No se recibió la información de pago');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message || 'Error al conectar con el servidor');
      });
  }, []);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fffdf8',
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: '500px',
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <h2 style={{ color: '#A15C38', marginBottom: '1rem' }}>⚠️ Error</h2>
          <p style={{ color: '#3A3A3A', marginBottom: '2rem' }}>{error}</p>
          <button
            onClick={() => setLocation('/')}
            data-testid="button-back-home"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#556B2F',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fffdf8',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #E6E3D9',
          borderTop: '4px solid #A15C38',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fffdf8',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'white',
        padding: '3rem 2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          color: '#556B2F',
          textAlign: 'center',
          fontSize: '2rem',
          marginBottom: '0.5rem',
        }}>
          🌿 Suscripción TransformaDiabetes
        </h1>
        <p style={{
          color: '#3A3A3A',
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.05rem',
        }}>
          Completa tu pago para comenzar tu transformación funcional
        </p>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>

        <p style={{
          marginTop: '2rem',
          fontSize: '0.85rem',
          color: '#666',
          textAlign: 'center',
        }}>
          🔒 Pago seguro procesado por Stripe
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
