import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";

// Initialize Paddle with API key from environment
// Auto-detect environment based on API key prefix
const getEnvironment = () => {
  const apiKey = process.env.PADDLE_API_KEY || '';
  if (apiKey.includes('_sdbx_')) {
    return Environment.sandbox;
  } else if (apiKey.includes('_live_')) {
    return Environment.production;
  }
  // Fallback to sandbox for development
  return process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox;
};

const paddle = process.env.PADDLE_API_KEY 
  ? new Paddle(process.env.PADDLE_API_KEY, {
      environment: getEnvironment()
    })
  : null;

console.log('Paddle initialized with environment:', getEnvironment());

export async function registerRoutes(app: Express): Promise<Server> {
  // Get Paddle environment info for client initialization
  app.get("/api/paddle-config", async (req, res) => {
    try {
      const environment = getEnvironment();
      // For now, return environment without client token
      // Client will initialize Paddle with the transactionId directly
      res.json({ 
        environment: environment === Environment.sandbox ? 'sandbox' : 'production'
      });
    } catch (error) {
      console.error("Error getting Paddle config:", error);
      res.status(500).json({ error: "Could not load payment configuration" });
    }
  });

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

      // Return both transaction ID and checkout URL
      const checkoutUrl = transaction.checkout?.url;
      
      if (!transaction.id || !checkoutUrl) {
        throw new Error("No transaction data returned from Paddle");
      }

      res.json({ 
        transactionId: transaction.id,
        checkoutUrl: checkoutUrl
      });
    } catch (error: any) {
      console.error("Error creating Paddle checkout:", error);
      
      // Provide more specific error messages based on Paddle error codes
      let errorMessage = "No se pudo procesar la solicitud de pago. Por favor, intenta nuevamente.";
      
      if (error.code === 'transaction_checkout_not_enabled') {
        errorMessage = "El sistema de pagos está en proceso de configuración. Por favor, intenta más tarde.";
      } else if (error.code === 'forbidden') {
        errorMessage = "Error de configuración del servicio de pagos. Contacta al soporte.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
