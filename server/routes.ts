import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";

// Initialize Stripe with API key from environment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

if (stripe) {
  console.log('Stripe initialized successfully');
} else {
  console.warn('⚠️ Stripe not configured: STRIPE_SECRET_KEY is missing');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe subscription endpoint
  app.post("/api/create-subscription", async (req, res) => {
    try {
      if (!stripe) {
        console.error("Stripe not configured: STRIPE_SECRET_KEY is missing");
        return res.status(500).json({ 
          error: "El servicio de pagos no está disponible. Por favor, contacta al soporte." 
        });
      }

      if (!process.env.STRIPE_PRICE_ID) {
        console.error("Stripe PRICE_ID not configured");
        return res.status(500).json({ 
          error: "El servicio de pagos no está disponible. Por favor, contacta al soporte." 
        });
      }

      // Crear un customer (por ahora anónimo, luego puede asociarse a un usuario)
      const customer = await stripe.customers.create({
        metadata: {
          source: 'TransformaDiabetes'
        }
      });

      // Crear una suscripción asociada al customer
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: process.env.STRIPE_PRICE_ID,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Obtener el invoice y payment_intent
      const latestInvoice = subscription.latest_invoice;
      
      if (!latestInvoice || typeof latestInvoice === 'string') {
        console.error('Invoice no disponible:', latestInvoice);
        throw new Error("No se pudo crear la factura de suscripción");
      }

      // Acceder al payment_intent (está expandido, pero TypeScript no lo reconoce en los tipos)
      const paymentIntent = (latestInvoice as any).payment_intent;
      
      if (!paymentIntent || typeof paymentIntent === 'string') {
        console.error('PaymentIntent no expandido:', paymentIntent);
        throw new Error("No se pudo obtener el PaymentIntent");
      }

      const clientSecret = paymentIntent.client_secret;
      
      if (!clientSecret) {
        console.error('ClientSecret no disponible');
        throw new Error("No se pudo obtener el client_secret");
      }

      console.log('Suscripción creada exitosamente:', subscription.id);
      
      res.json({ 
        subscriptionId: subscription.id,
        clientSecret: clientSecret
      });
    } catch (error: any) {
      console.error("Error creating Stripe subscription:", error);
      
      let errorMessage = "No se pudo procesar la solicitud de pago. Por favor, intenta nuevamente.";
      
      if (error.type === 'StripeCardError') {
        errorMessage = "Error con la tarjeta. Verifica los datos e intenta nuevamente.";
      } else if (error.type === 'StripeInvalidRequestError') {
        errorMessage = "Error de configuración del servicio de pagos. Contacta al soporte.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
