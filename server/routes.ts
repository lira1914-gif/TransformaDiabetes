import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";

// Initialize Stripe with API key from environment
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('Stripe initialized successfully');

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe subscription endpoint
  app.post("/api/create-subscription", async (req, res) => {
    try {
      if (!process.env.STRIPE_PRICE_ID) {
        console.error("Stripe PRICE_ID not configured");
        return res.status(500).json({ 
          error: "El servicio de pagos no está disponible. Por favor, contacta al soporte." 
        });
      }

      // Primero crear un customer (por ahora anónimo, luego puede asociarse a un usuario)
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

      // Acceder al payment_intent del invoice
      const invoice = subscription.latest_invoice;
      if (typeof invoice === 'string') {
        throw new Error("Invoice no expandido correctamente");
      }

      const paymentIntent = invoice?.payment_intent;
      if (!paymentIntent || typeof paymentIntent === 'string') {
        throw new Error("PaymentIntent no disponible");
      }

      const clientSecret = paymentIntent.client_secret;
      if (!clientSecret) {
        throw new Error("No se pudo obtener el client_secret");
      }

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
