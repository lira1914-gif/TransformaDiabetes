import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";

// Initialize Stripe with secret key from environment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-09-30.clover" })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe Checkout Session endpoint for subscriptions
  app.post("/api/create-checkout-session", async (req, res) => {
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

      // Get the origin for success/cancel URLs
      const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${origin}/bienvenida?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/resultados`,
        // Optional: collect customer email
        customer_email: req.body.email || undefined,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating Stripe checkout session:", error);
      res.status(500).json({ 
        error: "No se pudo procesar la solicitud de pago. Por favor, intenta nuevamente." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
