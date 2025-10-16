import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";

// Initialize Paddle with API key from environment
const paddle = process.env.PADDLE_API_KEY 
  ? new Paddle(process.env.PADDLE_API_KEY, {
      environment: process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox
    })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Paddle Checkout endpoint for subscriptions
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      if (!paddle) {
        console.error("Paddle not configured: PADDLE_API_KEY is missing");
        return res.status(500).json({ 
          error: "El servicio de pagos no está disponible. Por favor, contacta al soporte." 
        });
      }

      if (!process.env.PADDLE_PRICE_ID) {
        console.error("Paddle PRICE_ID not configured");
        return res.status(500).json({ 
          error: "El servicio de pagos no está disponible. Por favor, contacta al soporte." 
        });
      }

      // Get the origin for success/cancel URLs
      const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;

      // Create a transaction with Paddle
      const transaction = await paddle.transactions.create({
        items: [
          {
            priceId: process.env.PADDLE_PRICE_ID,
            quantity: 1,
          },
        ],
        // Optional: include customer email if provided
        ...(req.body.email && {
          customData: {
            email: req.body.email
          }
        })
      });

      // Return the checkout URL from the transaction
      const checkoutUrl = transaction.checkout?.url;
      
      if (!checkoutUrl) {
        throw new Error("No checkout URL returned from Paddle");
      }

      res.json({ url: checkoutUrl });
    } catch (error: any) {
      console.error("Error creating Paddle checkout:", error);
      res.status(500).json({ 
        error: "No se pudo procesar la solicitud de pago. Por favor, intenta nuevamente." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
