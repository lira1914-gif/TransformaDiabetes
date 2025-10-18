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

      console.log('Customer creado:', customer.id);

      // Crear un SetupIntent para recolectar el método de pago
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
        metadata: {
          price_id: process.env.STRIPE_PRICE_ID,
          source: 'TransformaDiabetes'
        }
      });

      console.log('SetupIntent creado:', setupIntent.id);
      
      if (!setupIntent.client_secret) {
        console.error('ClientSecret no disponible en SetupIntent');
        throw new Error("No se pudo obtener el client_secret del SetupIntent");
      }

      console.log('SetupIntent creado exitosamente');
      
      res.json({ 
        customerId: customer.id,
        clientSecret: setupIntent.client_secret
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

  // Endpoint para crear la suscripción después de guardar el payment_method
  app.post("/api/create-subscription-with-payment", async (req, res) => {
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

      const { customerId, paymentMethodId } = req.body;

      if (!customerId || !paymentMethodId) {
        return res.status(400).json({ 
          error: "customerId y paymentMethodId son requeridos" 
        });
      }

      console.log('Creando suscripción para customer:', customerId);
      console.log('Con payment_method:', paymentMethodId);

      // Adjuntar el payment_method al customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Establecer como método de pago por defecto
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Crear la suscripción
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: process.env.STRIPE_PRICE_ID,
          },
        ],
        default_payment_method: paymentMethodId,
      });

      console.log('Suscripción creada exitosamente:', subscription.id);
      console.log('Estado de la suscripción:', subscription.status);

      res.json({ 
        subscriptionId: subscription.id,
        status: subscription.status
      });
    } catch (error: any) {
      console.error("Error creating subscription with payment:", error);
      
      let errorMessage = "No se pudo crear la suscripción. Por favor, intenta nuevamente.";
      
      if (error.type === 'StripeCardError') {
        errorMessage = "Error con la tarjeta. Verifica los datos e intenta nuevamente.";
      } else if (error.type === 'StripeInvalidRequestError') {
        errorMessage = "Error de configuración. Contacta al soporte.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
