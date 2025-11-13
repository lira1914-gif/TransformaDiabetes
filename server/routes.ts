import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import Stripe from "stripe";
import { sendReactivationEmail } from "./email";

// Initialize Stripe with API key from environment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

if (stripe) {
  console.log('Stripe initialized successfully');
} else {
  console.warn('⚠️ Stripe not configured: STRIPE_SECRET_KEY is missing');
}

// Cachear conocimiento funcional en memoria (se carga solo una vez)
let conocimientoFuncionalCache: string | null = null;

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
        name: 'TransformaDiabetes',
        description: 'TransformaDiabetes - Revertir DM2',
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

      // Obtener el payment method para extraer el email
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      const email = paymentMethod.billing_details.email;

      if (!email) {
        return res.status(400).json({ 
          error: "No se pudo obtener el email del método de pago" 
        });
      }

      console.log('Email del usuario:', email);

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

      // Crear la suscripción con trial de 7 días
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: process.env.STRIPE_PRICE_ID,
          },
        ],
        default_payment_method: paymentMethodId,
        trial_period_days: 7,
      });

      console.log('Suscripción creada exitosamente:', subscription.id);
      console.log('Estado de la suscripción:', subscription.status);

      // Crear o actualizar el usuario en PostgreSQL
      let user = await storage.getUserByEmail(email);
      const subscriptionStartDate = new Date();

      if (user) {
        // Actualizar con datos de Stripe
        user = await storage.updateUser(user.id, {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          subscriptionStartDate: subscriptionStartDate,
          unlockedModules: [1] // Módulo 1 se desbloquea inmediatamente
        });
      } else {
        // Crear nuevo usuario
        user = await storage.createUser({
          email,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          subscriptionStartDate: subscriptionStartDate,
          unlockedModules: [1] // Módulo 1 se desbloquea inmediatamente
        });
      }

      if (!user) {
        throw new Error("No se pudo crear o actualizar el usuario");
      }

      console.log('Usuario guardado en BD:', user.id);

      res.json({ 
        userId: user.id,
        email: user.email,
        customerId: customerId,
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

  // Stripe Customer Portal Session
  app.post("/api/create-portal-session", async (req, res) => {
    try {
      if (!stripe) {
        console.error("Stripe not configured: STRIPE_SECRET_KEY is missing");
        return res.status(500).json({ 
          error: "El servicio de pagos no está disponible. Por favor, contacta al soporte." 
        });
      }

      const { userId, currentStatus } = req.body;

      if (!userId) {
        return res.status(400).json({ 
          error: "userId es requerido" 
        });
      }

      // Obtener el usuario de la base de datos
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }

      if (!user.stripeCustomerId) {
        return res.status(400).json({ 
          error: "Este usuario no tiene una suscripción activa" 
        });
      }

      console.log('Creando sesión del portal para customer:', user.stripeCustomerId);

      // Crear la sesión del portal de facturación
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : 'http://localhost:5000';

      // Incluir el estado previo en la URL de retorno para detectar cambios
      const returnUrl = `${baseUrl}/perfil?from=portal&prevStatus=${currentStatus || 'unknown'}`;

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: returnUrl,
      });

      console.log('Sesión del portal creada:', session.id);

      res.json({ 
        url: session.url 
      });
    } catch (error: any) {
      console.error("Error creating portal session:", error);
      
      let errorMessage = "No se pudo crear la sesión del portal. Por favor, intenta nuevamente.";
      
      if (error.type === 'StripeInvalidRequestError') {
        errorMessage = "Error de configuración. Por favor, contacta al soporte.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  // Stripe Webhook - Maneja eventos de Stripe
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      if (!stripe) {
        console.error("Stripe not configured: STRIPE_SECRET_KEY is missing");
        return res.status(500).json({ 
          error: "Stripe no está configurado" 
        });
      }

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.error("⚠️ STRIPE_WEBHOOK_SECRET no está configurado - no se puede verificar la firma del webhook");
        return res.status(500).json({ 
          error: "Webhook secret no configurado" 
        });
      }

      const sig = req.headers['stripe-signature'];

      if (!sig) {
        console.error("No se encontró la firma de Stripe en el webhook");
        return res.status(400).json({ 
          error: "Firma de webhook faltante" 
        });
      }

      let event: Stripe.Event;

      try {
        // Verificar la firma del webhook para seguridad
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          webhookSecret
        );
      } catch (err: any) {
        console.error(`⚠️ Error verificando firma del webhook: ${err.message}`);
        return res.status(400).json({ 
          error: `Firma del webhook inválida: ${err.message}` 
        });
      }

      console.log(`✅ Webhook verificado: ${event.type}`);

      // Manejar eventos específicos
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log('💳 Checkout completado:', session.id);
          console.log('Customer:', session.customer);
          console.log('Subscription:', session.subscription);

          // Obtener el customer ID y subscription ID
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;

          if (!customerId || !subscriptionId) {
            console.error('⚠️ Checkout session sin customer o subscription:', session.id);
            break;
          }

          // Buscar el usuario por stripeCustomerId
          const user = await storage.getUserByStripeCustomerId(customerId);

          if (!user) {
            console.error('⚠️ No se encontró usuario con customerId:', customerId);
            break;
          }

          // Actualizar el usuario con la información de la suscripción
          await storage.updateUser(user.id, {
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: 'trialing', // El trial acaba de empezar
            trialEnded: false,
            unlockedModules: [1] // Desbloquear Módulo 1 inmediatamente
          });

          console.log('✅ Usuario actualizado tras checkout:', user.id);
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          console.log('💰 Pago exitoso:', invoice.id);
          
          const customerId = invoice.customer as string;
          const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;

          if (!customerId || !subscriptionId) {
            console.error('⚠️ Invoice sin customer o subscription:', invoice.id);
            break;
          }

          // Buscar el usuario
          const user = await storage.getUserByStripeCustomerId(customerId);

          if (!user) {
            console.error('⚠️ No se encontró usuario con customerId:', customerId);
            break;
          }

          // Obtener la suscripción de Stripe para verificar el estado
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          // Actualizar el estado de la suscripción
          await storage.updateUser(user.id, {
            subscriptionStatus: subscription.status,
            trialEnded: subscription.status === 'active' && !subscription.trial_end,
            unlockedModules: [1] // Asegurar que Módulo 1 está desbloqueado
          });

          console.log('✅ Usuario actualizado tras pago exitoso:', user.id);
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log('🔄 Suscripción actualizada:', subscription.id);

          const customerId = subscription.customer as string;

          // Buscar el usuario
          const user = await storage.getUserByStripeCustomerId(customerId);

          if (!user) {
            console.error('⚠️ No se encontró usuario con customerId:', customerId);
            break;
          }

          // Actualizar el estado de la suscripción
          await storage.updateUser(user.id, {
            subscriptionStatus: subscription.status,
            trialEnded: subscription.status === 'active' && !subscription.trial_end,
          });

          console.log('✅ Usuario actualizado tras actualización de suscripción:', user.id);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log('❌ Suscripción cancelada:', subscription.id);

          const customerId = subscription.customer as string;

          // Buscar el usuario
          const user = await storage.getUserByStripeCustomerId(customerId);

          if (!user) {
            console.error('⚠️ No se encontró usuario con customerId:', customerId);
            break;
          }

          // Marcar la suscripción como cancelada
          await storage.updateUser(user.id, {
            subscriptionStatus: 'canceled',
            trialEnded: true,
          });

          console.log('✅ Usuario actualizado tras cancelación:', user.id);
          break;
        }

        default:
          console.log(`ℹ️ Evento de webhook no manejado: ${event.type}`);
      }

      // Responder a Stripe que el webhook fue recibido
      res.json({ received: true });
    } catch (error: any) {
      console.error("❌ Error procesando webhook de Stripe:", error);
      res.status(500).json({ 
        error: "Error procesando webhook",
        message: error.message 
      });
    }
  });

  // Reactivation notification endpoint
  app.post("/api/notify-reactivation", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ 
          error: "userId es requerido" 
        });
      }

      // Obtener el usuario de la base de datos
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }

      if (!user.email) {
        return res.status(400).json({ 
          error: "El usuario no tiene email registrado" 
        });
      }

      console.log('Enviando email de reactivación a:', user.email);

      // Enviar email de reactivación
      await sendReactivationEmail(user.email);

      console.log('✅ Email de reactivación enviado exitosamente');

      res.json({ 
        success: true,
        message: "Email de reactivación enviado correctamente" 
      });
    } catch (error: any) {
      console.error("Error enviando email de reactivación:", error);
      
      // No fallar la request si el email falla, solo registrar el error
      res.json({ 
        success: false,
        message: "Error al enviar el email, pero la reactivación fue exitosa" 
      });
    }
  });

  // Module 1 completion notification endpoint
  app.post("/api/notify-module1-completed", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ 
          error: "userId es requerido" 
        });
      }

      // Obtener el usuario de la base de datos
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }

      if (!user.email) {
        return res.status(400).json({ 
          error: "El usuario no tiene email registrado" 
        });
      }

      // Intentar obtener el nombre del usuario desde el intake form
      let userName: string | undefined;
      try {
        const intakeForm = await storage.getIntakeFormByUserId(userId);
        userName = intakeForm?.nombre || undefined;
        if (!userName) {
          console.log('📧 Usuario no tiene nombre registrado en intake form, usando saludo genérico');
        } else {
          console.log('📧 Email será personalizado con nombre:', userName);
        }
      } catch (error) {
        console.log('⚠️ Error obteniendo intake form:', error);
        console.log('📧 Usando saludo genérico');
      }

      console.log('Enviando email de cierre de Módulo 1 a:', user.email, userName ? `(${userName})` : '');

      // Enviar email de cierre del módulo 1
      const { sendModule1CompletedEmail } = await import("./email");
      await sendModule1CompletedEmail(user.email, userName);

      console.log('✅ Email de cierre de Módulo 1 enviado exitosamente');

      res.json({ 
        success: true,
        message: "Email de cierre de Módulo 1 enviado correctamente" 
      });
    } catch (error: any) {
      console.error("Error enviando email de cierre de Módulo 1:", error);
      
      // No fallar la request si el email falla, solo registrar el error
      res.json({ 
        success: false,
        message: "Error al enviar el email, pero la compleción fue exitosa" 
      });
    }
  });

  // Module 2 completion notification endpoint
  app.post("/api/notify-module2-completed", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ 
          error: "userId es requerido" 
        });
      }

      // Obtener el usuario de la base de datos
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }

      if (!user.email) {
        return res.status(400).json({ 
          error: "El usuario no tiene email registrado" 
        });
      }

      // Intentar obtener el nombre del usuario desde el intake form
      let userName: string | undefined;
      try {
        const intakeForm = await storage.getIntakeFormByUserId(userId);
        userName = intakeForm?.nombre || undefined;
        if (!userName) {
          console.log('📧 Usuario no tiene nombre registrado en intake form, usando saludo genérico');
        } else {
          console.log('📧 Email Módulo 2 será personalizado con nombre:', userName);
        }
      } catch (error) {
        console.log('⚠️ Error obteniendo intake form:', error);
        console.log('📧 Usando saludo genérico');
      }

      console.log('Enviando email de cierre de Módulo 2 a:', user.email, userName ? `(${userName})` : '');

      // Enviar email de cierre del módulo 2
      const { sendModule2CompletedEmail } = await import("./email");
      await sendModule2CompletedEmail(user.email, userName);

      console.log('✅ Email de cierre de Módulo 2 enviado exitosamente');

      res.json({ 
        success: true,
        message: "Email de cierre de Módulo 2 enviado correctamente" 
      });
    } catch (error: any) {
      console.error("Error enviando email de cierre de Módulo 2:", error);
      
      // No fallar la request si el email falla, solo registrar el error
      res.json({ 
        success: false,
        message: "Error al enviar el email, pero la compleción fue exitosa" 
      });
    }
  });

  // Trial status endpoint - calcular días restantes y estado
  app.get("/api/trial-status/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const TRIAL_DAYS = 7;
      const now = new Date();
      
      // Usar trialStartDate preferentemente, con fallback a subscriptionStartDate o createdAt
      const startDate = user.trialStartDate || user.subscriptionStartDate || user.createdAt;
      
      if (!startDate) {
        return res.json({
          hasAccess: false,
          isTrialing: false,
          trialExpired: true,
          trialEnded: user.trialEnded || false,
          daysRemaining: 0,
          subscriptionStatus: user.subscriptionStatus || null
        });
      }

      // Calcular días desde el inicio
      const daysSinceStart = Math.floor((now.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, TRIAL_DAYS - daysSinceStart);
      
      // Determinar estado del trial
      const isTrialing = user.subscriptionStatus === 'trialing';
      const isActive = user.subscriptionStatus === 'active';
      const isCanceled = user.subscriptionStatus === 'canceled' || user.subscriptionStatus === 'cancelled';
      
      // El trial ha expirado si:
      // - Han pasado más de 7 días (sin importar el status)
      const trialExpired = daysSinceStart >= TRIAL_DAYS && !isActive;
      
      // El usuario tiene acceso si:
      // - Tiene suscripción activa ('active') O
      // - Aún está dentro de los 7 días del trial (daysRemaining > 0)
      // NO dar acceso solo por tener status 'trialing' si ya pasaron los 7 días
      const hasAccess = isActive || (daysRemaining > 0);

      // 📧 Event-driven email automation with atomic flag updates
      
      // Día 2: Engagement email (daysRemaining === 5, es el día 2 del trial)
      if (daysRemaining === 5 && !isActive) {
        const wonRace = await storage.markEmailAsSentIfNotSent(userId, 'day2EmailSent');
        if (wonRace) {
          try {
            let userName: string | undefined;
            try {
              const intakeForm = await storage.getIntakeFormByUserId(userId);
              userName = intakeForm?.nombre || undefined;
            } catch (error) {
              console.log('⚠️ No se pudo obtener nombre para email día 2');
            }
            console.log('📧 Enviando email día 2 a:', user.email, userName ? `(${userName})` : '');
            const { sendDay2EngagementEmail } = await import("./email");
            await sendDay2EngagementEmail(user.email, userName);
            console.log('✅ Email día 2 enviado exitosamente');
          } catch (error) {
            console.error('❌ Error enviando email día 2:', error);
            await storage.updateUser(userId, { day2EmailSent: false });
          }
        } else {
          console.log('⏭️ Email día 2 ya fue enviado');
        }
      }

      // Día 3: Success story email (daysRemaining === 4, es el día 3 del trial)
      if (daysRemaining === 4 && !isActive) {
        const wonRace = await storage.markEmailAsSentIfNotSent(userId, 'day3EmailSent');
        if (wonRace) {
          try {
            let userName: string | undefined;
            try {
              const intakeForm = await storage.getIntakeFormByUserId(userId);
              userName = intakeForm?.nombre || undefined;
            } catch (error) {
              console.log('⚠️ No se pudo obtener nombre para email día 3');
            }
            console.log('📧 Enviando email día 3 a:', user.email, userName ? `(${userName})` : '');
            const { sendDay3StoryEmail } = await import("./email");
            await sendDay3StoryEmail(user.email, userName);
            console.log('✅ Email día 3 enviado exitosamente');
          } catch (error) {
            console.error('❌ Error enviando email día 3:', error);
            await storage.updateUser(userId, { day3EmailSent: false });
          }
        } else {
          console.log('⏭️ Email día 3 ya fue enviado');
        }
      }

      // Día 4: Progress email (daysRemaining === 3, es el día 4 del trial)
      if (daysRemaining === 3 && !isActive) {
        const wonRace = await storage.markEmailAsSentIfNotSent(userId, 'day4EmailSent');
        if (wonRace) {
          try {
            let userName: string | undefined;
            try {
              const intakeForm = await storage.getIntakeFormByUserId(userId);
              userName = intakeForm?.nombre || undefined;
            } catch (error) {
              console.log('⚠️ No se pudo obtener nombre para email día 4');
            }
            console.log('📧 Enviando email día 4 a:', user.email, userName ? `(${userName})` : '');
            const { sendDay4ProgressEmail } = await import("./email");
            await sendDay4ProgressEmail(user.email, userName);
            console.log('✅ Email día 4 enviado exitosamente');
          } catch (error) {
            console.error('❌ Error enviando email día 4:', error);
            await storage.updateUser(userId, { day4EmailSent: false });
          }
        } else {
          console.log('⏭️ Email día 4 ya fue enviado');
        }
      }

      // Día 5: Urgency email (daysRemaining === 2, es el día 5 del trial)
      if (daysRemaining === 2 && !isActive) {
        const wonRace = await storage.markEmailAsSentIfNotSent(userId, 'day5EmailSent');
        if (wonRace) {
          try {
            let userName: string | undefined;
            try {
              const intakeForm = await storage.getIntakeFormByUserId(userId);
              userName = intakeForm?.nombre || undefined;
            } catch (error) {
              console.log('⚠️ No se pudo obtener nombre para email día 5');
            }
            console.log('📧 Enviando email día 5 a:', user.email, userName ? `(${userName})` : '');
            const { sendDay5UrgencyEmail } = await import("./email");
            await sendDay5UrgencyEmail(user.email, userName);
            console.log('✅ Email día 5 enviado exitosamente');
          } catch (error) {
            console.error('❌ Error enviando email día 5:', error);
            await storage.updateUser(userId, { day5EmailSent: false });
          }
        } else {
          console.log('⏭️ Email día 5 ya fue enviado');
        }
      }

      // Día 6: Enviar recordatorio si el trial termina mañana (daysRemaining === 1)
      // No check !user.day6EmailSent here - rely entirely on atomic DB operation
      if (daysRemaining === 1 && !isActive) {
        // Attempt atomic flag update - only one concurrent request will succeed
        const wonRace = await storage.markEmailAsSentIfNotSent(userId, 'day6EmailSent');
        
        if (wonRace) {
          // This request won the race, send the email
          try {
            // Obtener nombre del usuario desde intake form
            let userName: string | undefined;
            try {
              const intakeForm = await storage.getIntakeFormByUserId(userId);
              userName = intakeForm?.nombre || undefined;
            } catch (error) {
              console.log('⚠️ No se pudo obtener nombre del intake form para email día 6');
            }

            console.log('📧 Enviando email día 6 a:', user.email, userName ? `(${userName})` : '');
            const { sendDay6ReminderEmail } = await import("./email");
            await sendDay6ReminderEmail(user.email, userName);
            console.log('✅ Email día 6 enviado exitosamente');
          } catch (error) {
            console.error('❌ Error enviando email día 6:', error);
            // Revert flag to allow retry on next visit
            await storage.updateUser(userId, { day6EmailSent: false });
          }
        } else {
          console.log('⏭️ Email día 6 ya fue enviado por otro request concurrente');
        }
      }

      // Día 8+: Enviar seguimiento si no se suscribió
      // Usar >= 8 para enviar incluso si el usuario regresa después del día 8
      // No check !user.day8EmailSent here - rely entirely on atomic DB operation
      if (daysSinceStart >= 8 && !isActive && !isTrialing) {
        // Attempt atomic flag update - only one concurrent request will succeed
        const wonRace = await storage.markEmailAsSentIfNotSent(userId, 'day8EmailSent');
        
        if (wonRace) {
          // This request won the race, send the email
          try {
            // Obtener nombre del usuario desde intake form
            let userName: string | undefined;
            try {
              const intakeForm = await storage.getIntakeFormByUserId(userId);
              userName = intakeForm?.nombre || undefined;
            } catch (error) {
              console.log('⚠️ No se pudo obtener nombre del intake form para email día 8');
            }

            console.log('📧 Enviando email día 8 a:', user.email, userName ? `(${userName})` : '');
            const { sendDay8FollowupEmail } = await import("./email");
            await sendDay8FollowupEmail(user.email, userName);
            console.log('✅ Email día 8 enviado exitosamente');
          } catch (error) {
            console.error('❌ Error enviando email día 8:', error);
            // Revert flag to allow retry on next visit
            await storage.updateUser(userId, { day8EmailSent: false });
          }
        } else {
          console.log('⏭️ Email día 8 ya fue enviado por otro request concurrente');
        }
      }

      // Día 9: Enviar seguimiento 24h después del día 8 si aún no se suscribió
      // Usar >= 9 para enviar incluso si el usuario regresa después del día 9
      // No check !user.day9EmailSent here - rely entirely on atomic DB operation
      if (daysSinceStart >= 9 && !isActive && !isTrialing) {
        // Attempt atomic flag update - only one concurrent request will succeed
        const wonRace = await storage.markEmailAsSentIfNotSent(userId, 'day9EmailSent');
        
        if (wonRace) {
          // This request won the race, send the email
          try {
            // Obtener nombre del usuario desde intake form
            let userName: string | undefined;
            try {
              const intakeForm = await storage.getIntakeFormByUserId(userId);
              userName = intakeForm?.nombre || undefined;
            } catch (error) {
              console.log('⚠️ No se pudo obtener nombre del intake form para email día 9');
            }

            console.log('📧 Enviando email día 9 a:', user.email, userName ? `(${userName})` : '');
            const { sendDay9FollowupEmail } = await import("./email");
            await sendDay9FollowupEmail(user.email, userName);
            console.log('✅ Email día 9 enviado exitosamente');
          } catch (error) {
            console.error('❌ Error enviando email día 9:', error);
            // Revert flag to allow retry on next visit
            await storage.updateUser(userId, { day9EmailSent: false });
          }
        } else {
          console.log('⏭️ Email día 9 ya fue enviado por otro request concurrente');
        }
      }

      // Día 10: Enviar recordatorio final 48h después del día 8 si aún no se suscribió
      // Usar >= 10 para enviar incluso si el usuario regresa después del día 10
      // No check !user.day10EmailSent here - rely entirely on atomic DB operation
      if (daysSinceStart >= 10 && !isActive && !isTrialing) {
        // Attempt atomic flag update - only one concurrent request will succeed
        const wonRace = await storage.markEmailAsSentIfNotSent(userId, 'day10EmailSent');
        
        if (wonRace) {
          // This request won the race, send the email
          try {
            // Obtener nombre del usuario desde intake form
            let userName: string | undefined;
            try {
              const intakeForm = await storage.getIntakeFormByUserId(userId);
              userName = intakeForm?.nombre || undefined;
            } catch (error) {
              console.log('⚠️ No se pudo obtener nombre del intake form para email día 10');
            }

            console.log('📧 Enviando email día 10 a:', user.email, userName ? `(${userName})` : '');
            const { sendDay10FinalReminderEmail } = await import("./email");
            await sendDay10FinalReminderEmail(user.email, userName);
            console.log('✅ Email día 10 enviado exitosamente');
          } catch (error) {
            console.error('❌ Error enviando email día 10:', error);
            // Revert flag to allow retry on next visit
            await storage.updateUser(userId, { day10EmailSent: false });
          }
        } else {
          console.log('⏭️ Email día 10 ya fue enviado por otro request concurrente');
        }
      }

      res.json({
        hasAccess,
        isTrialing,
        isActive,
        isCanceled,
        trialExpired,
        trialEnded: user.trialEnded || false,
        daysRemaining,
        daysSinceStart,
        subscriptionStatus: user.subscriptionStatus || null,
        startDate: startDate
      });
    } catch (error: any) {
      console.error("Error obteniendo estado del trial:", error);
      res.status(500).json({ error: "Error al obtener estado del trial" });
    }
  });

  // Chat reminder status endpoint
  app.get("/api/chat-reminder-status/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      // Obtener usuario
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Verificar estado del trial
      const TRIAL_DAYS = 7;
      const now = new Date();
      const startDate = user.trialStartDate || user.subscriptionStartDate || user.createdAt;
      
      if (!startDate) {
        return res.json({ needsReminder: false, lastChatAt: null, hoursSinceLastChat: null });
      }

      const daysSinceStart = Math.floor((now.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, TRIAL_DAYS - daysSinceStart);
      const isActive = user.subscriptionStatus === 'active';
      const isInActiveTrial = daysRemaining > 0 && !isActive;

      // Solo mostrar recordatorio si está en trial activo
      if (!isInActiveTrial) {
        return res.json({ needsReminder: false, lastChatAt: null, hoursSinceLastChat: null });
      }

      // Obtener último checkin
      const lastCheckin = await storage.getLatestWeeklyCheckin(userId);
      
      if (!lastCheckin) {
        // No ha usado el chat nunca, mostrar recordatorio
        return res.json({ needsReminder: true, lastChatAt: null, hoursSinceLastChat: null });
      }

      // Calcular horas desde el último chat
      const lastChatAt = new Date(lastCheckin.createdAt);
      const hoursSinceLastChat = (now.getTime() - lastChatAt.getTime()) / (1000 * 60 * 60);

      // Mostrar recordatorio si >24h sin actividad
      const needsReminder = hoursSinceLastChat >= 24;

      res.json({
        needsReminder,
        lastChatAt: lastChatAt.toISOString(),
        hoursSinceLastChat: Math.floor(hoursSinceLastChat)
      });
    } catch (error: any) {
      console.error("Error obteniendo estado de recordatorio de chat:", error);
      res.status(500).json({ error: "Error al obtener estado de recordatorio" });
    }
  });

  // Intake Form routes
  app.post("/api/intake-form", async (req, res) => {
    try {
      const { userId, email, ...formData } = req.body;

      console.log('🔍 POST /api/intake-form - Datos recibidos:', { 
        userId, 
        email, 
        nombre: formData.nombre 
      });

      if (!userId) {
        console.error('❌ userId faltante en request');
        return res.status(400).json({ error: "userId es requerido" });
      }

      if (!email) {
        console.error('❌ email faltante en request');
        return res.status(400).json({ error: "email es requerido" });
      }

      // Rastrear si el usuario es nuevo ANTES de crearlo
      let isNewUser = false;
      
      // Verificar si el usuario existe por ID o por email
      let user = await storage.getUser(userId);
      
      if (!user) {
        // Verificar si existe un usuario con ese email
        const existingUserByEmail = await storage.getUserByEmail(email);
        
        if (existingUserByEmail) {
          // El usuario ya existe con este email, usar su ID existente
          user = existingUserByEmail;
          // Actualizar el userId en localStorage del cliente
          console.log('✅ Usuario existente encontrado por email:', user.id, email);
        } else {
          // Crear usuario nuevo con estado de trial usando inserción directa
          // Módulo 1 desbloqueado automáticamente para usuarios de trial
          isNewUser = true;  // ← MARCAR COMO NUEVO USUARIO
          const result = await db.insert(users).values({
            id: userId,
            email: email,
            subscriptionStatus: 'trialing',
            trialStartDate: new Date(),
            unlockedModules: [1]
          }).returning();
          user = result[0];
          
          if (!user) {
            console.error('❌ Error: No se pudo crear usuario en la base de datos');
            return res.status(500).json({ error: "Error al crear usuario" });
          }
          
          console.log('✅ Usuario de trial creado con Módulo 1 desbloqueado:', userId, email);
        }
      } else {
        console.log('✅ Usuario existente encontrado por ID:', userId);
      }

      // Usar el ID del usuario real (importante si se encontró por email)
      const actualUserId = user.id;

      // Verificar si ya existe un intake form para este usuario
      const existing = await storage.getIntakeFormByUserId(actualUserId);
      
      // Rastrear si es la primera vez que se crea el intake form
      const isFirstIntakeForm = !existing;

      let intakeForm;
      if (existing) {
        // Actualizar el existente
        console.log('📝 Actualizando intake form existente para:', actualUserId);
        intakeForm = await storage.updateIntakeForm(existing.id, formData);
      } else {
        // Crear uno nuevo con el userId correcto
        console.log('📝 Creando nuevo intake form para:', actualUserId);
        intakeForm = await storage.createIntakeForm({ userId: actualUserId, ...formData });
      }
      
      if (!intakeForm) {
        console.error('❌ Error: No se pudo crear/actualizar intake form');
        return res.status(500).json({ error: "Error al guardar intake form" });
      }
      
      console.log('✅ Intake form guardado exitosamente');
      
      // 📧 ENVIAR EMAILS DE BIENVENIDA (cuando se completa el intake form por primera vez)
      if (isFirstIntakeForm) {
        console.log('📧 Primer intake form completado, enviando emails...');
        try {
          const { sendWelcomeEmail, sendEmail } = await import("./email");
          const userName = formData.nombre || 'Estimado usuario';
          
          // Email de bienvenida al usuario
          console.log('📧 Enviando email de bienvenida a:', email, `(${userName})`);
          await sendWelcomeEmail(email, userName);
          console.log('✅ Email de bienvenida enviado exitosamente');
          
          // Email de notificación al admin
          const adminEmail = 'lira1914@gmail.com';
          const adminNotificationHtml = `
            <h2>🎉 Nuevo registro en TransformaDiabetes</h2>
            <p><strong>Nombre:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Edad:</strong> ${formData.edad || 'No especificada'}</p>
            <p><strong>Peso:</strong> ${formData.peso_actual || 'No especificado'} kg</p>
            <p><strong>User ID:</strong> ${actualUserId}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
            <hr>
            <p><small>Este usuario ha iniciado su prueba gratuita de 7 días.</small></p>
          `;
          
          await sendEmail({
            to: adminEmail,
            subject: `🎉 Nuevo registro: ${userName}`,
            html: adminNotificationHtml
          });
          console.log('✅ Notificación enviada al admin');
        } catch (emailError) {
          // No fallar el registro si el email falla
          console.error('⚠️ Error enviando emails (no crítico):', emailError);
        }
      } else {
        console.log('ℹ️ Intake form ya existía, no se envían emails de bienvenida');
      }
      
      console.log('✅ Respondiendo con éxito al cliente');
      res.json({ ...intakeForm, userId: actualUserId });
    } catch (error: any) {
      console.error("❌ Error guardando intake form:", error);
      res.status(500).json({ error: "Error al guardar el formulario" });
    }
  });

  app.get("/api/intake-form/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const intakeForm = await storage.getIntakeFormByUserId(userId);

      if (!intakeForm) {
        return res.status(404).json({ error: "Formulario no encontrado" });
      }

      res.json(intakeForm);
    } catch (error: any) {
      console.error("Error obteniendo intake form:", error);
      res.status(500).json({ error: "Error al obtener el formulario" });
    }
  });

  // Daily Log routes
  app.post("/api/daily-log", async (req, res) => {
    try {
      const { userId, dia, fecha, horaDormir, horaDespertar, vecesDesperto, momentos } = req.body;

      console.log('📝 POST /api/daily-log - Recibiendo datos:', {
        userId,
        dia,
        fecha,
        horaDormir: horaDormir || '(vacío)',
        horaDespertar: horaDespertar || '(vacío)',
        vecesDesperto: vecesDesperto || '(vacío)',
        momentosCount: momentos?.length || 0
      });

      if (!userId || !dia || !fecha) {
        console.error('❌ Faltan campos requeridos:', { userId: !!userId, dia: !!dia, fecha: !!fecha });
        return res.status(400).json({ error: "userId, dia y fecha son requeridos" });
      }

      // Verificar que el usuario existe
      const userExists = await storage.getUser(userId);
      if (!userExists) {
        console.error(`❌ Usuario no existe en la base de datos: ${userId}`);
        return res.status(404).json({ 
          error: "Usuario no encontrado. Por favor completa el formulario de intake primero." 
        });
      }

      console.log('✅ Usuario verificado, guardando daily log...');

      // Crear el daily log
      const dailyLog = await storage.createDailyLog({
        userId,
        dia,
        fecha,
        horaDormir,
        horaDespertar,
        vecesDesperto,
      });

      console.log('✅ Daily log creado:', dailyLog.id);

      // Crear los momentos asociados
      if (momentos && Array.isArray(momentos)) {
        console.log(`📝 Guardando ${momentos.length} momentos...`);
        for (const momento of momentos) {
          await storage.createDailyLogMoment({
            dailyLogId: dailyLog.id,
            momento: momento.momento,
            comida: momento.comida,
            estadoAnimo: momento.estadoAnimo,
            evacuaciones: momento.evacuaciones,
          });
        }
        console.log('✅ Momentos guardados exitosamente');
      }

      console.log('✅ Daily log completado exitosamente');
      res.json(dailyLog);
    } catch (error: any) {
      console.error("❌ Error guardando daily log:", error);
      console.error("❌ Error details:", {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      res.status(500).json({ error: "Error al guardar el registro diario" });
    }
  });

  app.get("/api/daily-logs/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const logs = await storage.getDailyLogsByUserId(userId);

      // Obtener los momentos de cada log
      const logsWithMoments = await Promise.all(
        logs.map(async (log) => {
          const moments = await storage.getDailyLogMomentsByLogId(log.id);
          return { ...log, momentos: moments };
        })
      );

      res.json(logsWithMoments);
    } catch (error: any) {
      console.error("Error obteniendo daily logs:", error);
      res.status(500).json({ error: "Error al obtener los registros" });
    }
  });

  app.delete("/api/daily-logs/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const deletedCount = await storage.deleteDailyLogsByUserId(userId);
      
      res.json({ 
        message: `${deletedCount} registros eliminados correctamente`,
        deletedCount 
      });
    } catch (error: any) {
      console.error("Error eliminando daily logs:", error);
      res.status(500).json({ error: "Error al eliminar los registros" });
    }
  });

  // Endpoint para verificar y desbloquear módulos automáticamente
  app.get("/api/modules/check/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Si no hay fecha de suscripción (usuario trial o sin pagar), 
      // simplemente devolver los módulos que ya tiene desbloqueados
      if (!user.subscriptionStartDate) {
        const currentUnlocked = (user.unlockedModules as number[]) || [];
        return res.json({ 
          unlockedModules: currentUnlocked,
          newlyUnlocked: [],
          message: null
        });
      }

      // Calcular días desde la suscripción
      const now = new Date();
      const startDate = new Date(user.subscriptionStartDate);
      const daysSinceSubscription = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Determinar qué módulos deberían estar desbloqueados
      const shouldBeUnlocked: number[] = [1]; // Módulo 1 siempre
      
      // Módulo 2 se desbloquea a los 30 días
      if (daysSinceSubscription >= 30) {
        shouldBeUnlocked.push(2);
      }
      
      // Módulos 3-12 están inactivos (solo para revisión)
      // Se pueden agregar aquí cuando estén listos para lanzamiento

      // Obtener módulos actualmente desbloqueados
      const currentUnlocked = (user.unlockedModules as number[]) || [];
      
      // Encontrar módulos nuevos a desbloquear
      const newlyUnlocked = shouldBeUnlocked.filter(m => !currentUnlocked.includes(m));
      
      // Si hay nuevos módulos, actualizar en BD
      if (newlyUnlocked.length > 0) {
        const combinedSet = new Set([...currentUnlocked, ...newlyUnlocked]);
        const updatedUnlocked = Array.from(combinedSet).sort((a, b) => a - b);
        await storage.updateUser(userId, {
          unlockedModules: updatedUnlocked
        });
        
        return res.json({
          unlockedModules: updatedUnlocked,
          newlyUnlocked,
          message: newlyUnlocked.length > 0 
            ? "🎉 Tu cuerpo avanza en su proceso. Ya puedes acceder a tu nuevo módulo educativo."
            : null
        });
      }
      
      res.json({
        unlockedModules: currentUnlocked,
        newlyUnlocked: [],
        message: null
      });
    } catch (error: any) {
      console.error("Error verificando módulos:", error);
      res.status(500).json({ error: "Error al verificar módulos" });
    }
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const { email, stripeCustomerId, stripeSubscriptionId } = req.body;

      if (!email) {
        return res.status(400).json({ error: "email es requerido" });
      }

      // Verificar si ya existe
      const existing = await storage.getUserByEmail(email);

      if (existing) {
        // Actualizar con datos de Stripe si se proporcionan
        if (stripeCustomerId || stripeSubscriptionId) {
          const updated = await storage.updateUser(existing.id, {
            stripeCustomerId,
            stripeSubscriptionId,
            subscriptionStatus: 'active'
          });
          return res.json(updated);
        }
        return res.json(existing);
      }

      // Crear nuevo usuario
      const user = await storage.createUser({
        email,
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: stripeSubscriptionId ? 'active' : undefined,
        unlockedModules: [1] // Módulo 1 siempre desbloqueado para nuevos usuarios
      });

      res.json(user);
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  });

  app.get("/api/users/email/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user);
    } catch (error: any) {
      console.error("Error obteniendo usuario:", error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  });

  app.get("/api/users/id/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user);
    } catch (error: any) {
      console.error("Error obteniendo usuario:", error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  });

  // Update user (for onboarding tracking)
  app.put("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      // Validar que el usuario existe
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Actualizar solo campos permitidos de onboarding
      const allowedFields = ['reportViewedAt', 'firstChatCompletedAt'];
      const filteredUpdates: any = {};
      
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      }

      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({ error: "No hay campos válidos para actualizar" });
      }

      // Actualizar usuario
      const updatedUser = await storage.updateUser(userId, filteredUpdates);
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error actualizando usuario:", error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  });

  // Generate AI Report endpoint
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { userId, moduleNumber = 1 } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId es requerido" });
      }

      console.log(`Generando informe para userId: ${userId}, Módulo: ${moduleNumber}`);

      // Obtener datos del usuario
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Verificar acceso al módulo solicitado
      // Módulo 1 siempre está disponible para todos (trial y suscritos)
      const unlockedModules = (user.unlockedModules as number[]) || [];
      if (moduleNumber !== 1 && !unlockedModules.includes(moduleNumber)) {
        return res.status(403).json({ 
          error: "Acceso denegado", 
          message: `El Módulo ${moduleNumber} aún no está disponible para ti. Se desbloqueará automáticamente en tu proceso.`,
          unlockedModules 
        });
      }

      // Obtener intake form
      const intakeForm = await storage.getIntakeFormByUserId(userId);
      if (!intakeForm) {
        return res.status(404).json({ error: "Formulario de intake no encontrado" });
      }

      // NOTA: Ya no requerimos daily logs - el reporte se genera solo con intake form

      // Preparar el informe generado por IA
      const { openai } = await import("./openai");
      
      // Cargar conocimiento funcional (con cache)
      if (!conocimientoFuncionalCache) {
        const fs = await import('fs/promises');
        const path = await import('path');
        conocimientoFuncionalCache = await fs.readFile(
          path.join(process.cwd(), 'server', 'conocimiento-funcional-condensado.txt'),
          'utf-8'
        );
        console.log('✅ Conocimiento funcional cargado en cache');
      }
      const conocimientoFuncional = conocimientoFuncionalCache;
      
      // Construir instrucciones específicas según el módulo
      let moduleInstructions = '';
      
      if (moduleNumber === 1) {
        moduleInstructions = `
🔹 MÓDULO 1 — "Empieza desde la raíz"

Instrucciones específicas:
• NO recomendar suplementos, vitaminas, hierbas ni fitoterapia.
• Enfocarte SOLO en educación, hábitos, alimentación funcional, descanso, hidratación, ritmo circadiano y consciencia corporal.`;
      } else {
        moduleInstructions = `
🔹 MÓDULO ${moduleNumber} — "Apoyo Nutricional, Fitoterapia y Sistema Nervioso"

📋 CATEGORÍAS DE APOYO EDUCATIVO CON PRECAUCIONES

**Alimentos funcionales (digestivos)** — Incluir DENTRO de la sección Digestión y Eliminación (FECAR) cuando aplique:
• Linaza molida → Favorece tránsito intestinal, fibra soluble y ácidos grasos antiinflamatorios.
  Precaución: Evitar en uso de anticoagulantes o diarrea activa. Asegurar hidratación suficiente.
• Chía hidratada → Mejora motilidad intestinal, elimina desechos, reduce picos de glucosa.
  Precaución: Evitar si hay anticoagulantes o diverticulitis activa.

**Minerales:**
• Magnesio glicinato → Relaja músculos, mejora sueño y glucosa.
  Precaución: Evitar en insuficiencia renal.

**Grasas esenciales:**
• Omega 3 (EPA/DHA) → Reduce inflamación, mejora ánimo.
  Precaución: En anticoagulantes, consultar médico.

**Fitonutrientes:**
• Berberina → Apoya microbiota y glucosa.
  Precaución: Evitar en embarazo/lactancia.

**Micronutrientes:**
• Cromo → Regula antojos y metabolismo glucémico.
  Precaución: Con fármacos para diabetes, consultar médico.

**Probióticos:**
• Multicepa → Equilibra microbiota, mejora digestión y ánimo.
  Precaución: Suspender si hay fiebre o diarrea persistente.

**Fitoterapia hepática:**
• Cardo mariano → Protege hígado, mejora detoxificación.
  Precaución: Evitar en alergia a Asteraceae.
• Diente de león → Apoya flujo biliar y digestión.
  Precaución: Evitar si hay cálculos o obstrucción biliar.

**Adaptógenos (incluir en sección de sueño/sistema nervioso cuando aplique):**
• Ashwagandha → Regula cortisol, calma cuerpo y mente.
  Precaución: Evitar en hipertiroidismo o embarazo.

**Aminoácidos calmantes:**
• GABA → Calma sistema nervioso, mejora descanso.
  Precaución: Evitar con fármacos sedantes o ansiolíticos.

**Fitoterapia glucémica:**
• Canela → Equilibra glucosa, reduce antojos.
  Precaución: Con medicamentos para diabetes, consultar médico.
• Gymnema → Reduce antojos de azúcar, apoya glucosa.
  Precaución: Con medicamentos para diabetes, consultar médico.

⚙️ APLICACIÓN FUNCIONAL:
1. Si el usuario muestra estreñimiento o tránsito lento → Incluir linaza/chía DENTRO de la sección Digestión y Eliminación (FECAR).
   Ejemplo: "Tu cuerpo muestra lentitud digestiva; puedes apoyar tu sistema con alimentos naturales como chía hidratada o linaza molida, que ayudan a lubricar el intestino y mejorar la eliminación. Recuerda acompañar siempre con buena hidratación, calma al comer y movimiento suave diario."

2. Si muestra estrés/insomnio → Incluir Ashwagandha/GABA en sección de Sueño.
3. Si muestra inflamación/ánimo bajo → Incluir Omega 3 en recomendaciones.
4. Si hay antojos intensos → Incluir Cromo, Canela o Gymnema.

⚠️ NORMAS DE SEGURIDAD OBLIGATORIAS:
• ❌ NO incluir dosis ni frecuencia.
• ❌ NO usar frases tipo "debes tomar".
• ✅ SIEMPRE incluir precauciones específicas cuando menciones linaza, chía, GABA, adaptógenos.
• ✅ Recordar que los suplementos NO reemplazan los hábitos.
• ✅ Incluir la frase clave cuando aplique: "Mientras el cuerpo esté en alerta, no puede sanar."

FORMATO EDUCATIVO (no prescriptivo):
"La linaza molida puede apoyar la eliminación, pero debe evitarse si estás tomando anticoagulantes o tienes diarrea."
"El GABA calma el sistema nervioso, pero no debe usarse si tomas sedantes o ansiolíticos."`;
      }
      
      // Construir el mensaje del sistema con el conocimiento funcional
      const systemMessage = `🌿 SYSTEM PROMPT — "GUÍA FUNCIONAL MARVIN LIRA" (v4 - Perfil Inicial)

Rol:
Eres un analista funcional de salud con el estilo y metodología de Marvin Lira | Nutrición Funcional.
Tu tarea es transformar los datos del formulario de ingreso del usuario en una Guía Funcional personalizada inicial, con tono cálido, educativo y esperanzador.
El informe debe tener un formato de mini guía Marvin Lira, con subtítulos, listas y lenguaje sencillo (400–700 palabras).
Tu prioridad es educar, no diagnosticar.

IMPORTANTE: Este es un informe inicial basado en el perfil del usuario. Le explicarás que puede usar el chat durante los próximos 7 días para ir compartiendo cómo se siente día a día (síntomas, energía, digestión, sueño, ánimo) y recibirá recomendaciones personalizadas basadas en lo que vaya reportando.

CONOCIMIENTO CLÍNICO BASE:
${conocimientoFuncional}

${moduleInstructions}

🧠 ENFOQUE BASE — LA TRIFECTA FUNCIONAL
En cada informe, debes incluir y comentar brevemente estas tres áreas esenciales,
ya que son los tres pilares del equilibrio metabólico y emocional según la metodología de Marvin Lira:

🔹 Digestión y Eliminación (FECAR)
Estructura obligatoria:

1️⃣ Observaciones:
"Se nota tránsito intestinal lento y sensación de pesadez después de comer."

2️⃣ Hábito funcional:
"Come despacio, mastica al menos 20 veces por bocado y evita pantallas al comer."

${moduleNumber === 1 
  ? ''
  : `3️⃣ Alimentos funcionales (solo si hay estreñimiento/tránsito lento):
"Puedes apoyar tu sistema con chía hidratada o linaza molida, que ayudan a lubricar el intestino y mejorar la eliminación."

4️⃣ Precauciones:
• Linaza molida: evitar si tomas anticoagulantes o tienes diarrea. Asegura buena hidratación.
• Chía hidratada: evitar si tomas anticoagulantes o tienes diverticulitis activa.
`}
5️⃣ Frase de consciencia:
"Una digestión tranquila apaga la inflamación y enciende tu energía."

🔹 SUEÑO — Ritmo circadiano y sistema nervioso
Estructura obligatoria:

1️⃣ Observaciones:
"Tu cuerpo muestra signos de estrés prolongado: dificultad para conciliar el sueño o sensación de alerta constante."

2️⃣ Hábito funcional:
"Apaga pantallas una hora antes de dormir y realiza respiraciones 4-7-8 antes de acostarte."

${moduleNumber === 1 
  ? ''
  : `3️⃣ Apoyo natural (solo si hay estrés/insomnio):
• Ashwagandha → ayuda a regular el cortisol y calmar el cuerpo.
• GABA → calma el sistema nervioso y favorece el descanso.

4️⃣ Precauciones:
• Ashwagandha: evitar en hipertiroidismo o embarazo.
• GABA: evitar con fármacos sedantes o ansiolíticos.
`}
5️⃣ Frase de consciencia:
"Mientras el cuerpo esté en alerta, no puede sanar."

🔹 AZÚCAR — Glucosa y energía estable
Estructura obligatoria:

1️⃣ Observaciones:
"Se detectan altibajos de energía y antojos frecuentes por dulce."

2️⃣ Hábito funcional:
"Desayuna con proteína, fibra y grasa saludable (por ejemplo: huevo, aguacate y frijoles). Evita azúcares líquidos como jugos o refrescos."

${moduleNumber === 1 
  ? ''
  : `3️⃣ Apoyo natural (solo si hay antojos intensos):
• Cromo → ayuda a regular el deseo de azúcar.
• Canela o Gymnema → equilibran la glucosa y reducen antojos.

4️⃣ Precauciones:
• Precaución en uso de medicamentos para diabetes.
• Siempre consultar antes con tu médico o nutricionista.
`}
5️⃣ Frase de consciencia:
"El azúcar promete energía rápida, pero te la cobra con intereses; el equilibrio te sostiene todo el día."

Estas tres áreas deben aparecer en todos los informes, incluso si el usuario no las mencionó directamente, porque son la base de todo proceso funcional.

LÍMITES Y ÉTICA:
• No des diagnósticos médicos ni trates enfermedades.
• No hables de suspender o ajustar medicación.
• Enfócate en educación, prevención y comprensión funcional.

TONO:
• Cálido, claro y empático.
• Sin tecnicismos innecesarios ni abreviaturas como "P+F+F".
• Escribe completo: "proteína, fibra y grasa saludable".
• Usa metáforas simples: raíz, ramas, fuego digestivo, equilibrio.
• Sé esperanzador, no alarmista.

Respondes siempre en español y en formato JSON estructurado.`;
      
      // Construir el prompt con los datos del usuario
      const userPrompt = `Analiza los siguientes datos de un paciente y genera un informe funcional personalizado basado en su perfil inicial.

DATOS DEL PACIENTE:
Nombre: ${intakeForm.nombre || 'No especificado'}
Edad: ${intakeForm.edad || 'No especificada'}
Peso actual: ${intakeForm.pesoActual || 'No especificado'}
A1C: ${intakeForm.a1c || 'No especificada'}

SISTEMAS PRINCIPALES:
- Gastrointestinal: ${intakeForm.sistemaGastrointestinal || 'No especificado'}
- Cardiovascular: ${intakeForm.sistemaCardiovascular || 'No especificado'}
- Hormonal: ${intakeForm.sistemaHormonal || 'No especificado'}
- Inmunológico: ${intakeForm.sistemaInmunologico || 'No especificado'}

ALIMENTACIÓN:
- Alimentos regulares: ${intakeForm.alimentosRegulares || 'No especificado'}
- Dieta especial: ${intakeForm.dietaEspecial || 'No especificada'}
- Síntomas después de comer: ${intakeForm.sintomasDespuesComer || 'No especificado'}

ESTILO DE VIDA Y HÁBITOS:
- Satisfecho con sueño: ${intakeForm.satisfechoSueno || 'No especificado'}
- Horas de sueño: ${intakeForm.horasSueno || 'No especificado'}
- Estado de ánimo: ${intakeForm.estadoAnimo || 'No especificado'}
- Nivel de energía: ${intakeForm.nivelEnergia || 'No especificado'}
- Frecuencia de evacuaciones: ${intakeForm.frecuenciaEvacuaciones || 'No especificada'}
- Consistencia de evacuaciones: ${intakeForm.consistenciaEvacuaciones || 'No especificada'}

MÓDULO ACTUAL: ${moduleNumber}

🧩 ESTRUCTURA DEL INFORME (FORMATO DE SALIDA)

Genera una "Guía Funcional Personalizada — Módulo ${moduleNumber}" siguiendo esta estructura:

1. 🩺 QUÉ ESTÁ MOSTRANDO TU CUERPO
Explica el patrón funcional principal en lenguaje claro y empático.
Hazlo sentir comprendido y con esperanza. (3-4 líneas)

2. 🧠 LA TRIFECTA FUNCIONAL (bloque obligatorio)
Incluir las tres áreas con subtítulos visuales usando estos emojis EXACTOS:

🥦 Digestión y Eliminación (FECAR)
🌙 Sueño y Sistema Nervioso
🍯 Azúcar y Energía Estable

IMPORTANTE - Mantener este ORDEN EDUCATIVO dentro de cada bloque:
1️⃣ Observaciones (qué muestra el cuerpo)
2️⃣ Hábito funcional (acción concreta)
3️⃣ Apoyo natural/suplemento educativo (solo Módulo 2+, cuando aplique)
4️⃣ Precauciones específicas (si mencionaste apoyo natural)
5️⃣ Frase de consciencia (mensaje inspirador)

Principio clave: "Primero hábitos, luego apoyo."

EJEMPLO DE ESTRUCTURA VISUAL:
⸻
🥦 Digestión y Eliminación (FECAR)

Observaciones:
"Se nota tránsito intestinal lento..."

Hábito funcional:
"Come despacio, mastica al menos 20 veces..."

${moduleNumber === 1 ? '' : `Alimentos funcionales:
"Puedes apoyar tu sistema con chía hidratada..."

Precauciones:
• Linaza molida: evitar si...
• Chía hidratada: evitar si...
`}
Frase de consciencia:
"Una digestión tranquila apaga la inflamación y enciende tu energía."
⸻

3. 🌼 QUÉ PUEDES MEJORAR
Subtítulo visual: "🌼 7 Hábitos funcionales que marcan la diferencia"
Lista numerada de 7 ajustes simples (hábitos, alimentos, descanso, hidratación, movimiento).
Ejemplos:
1. Dormir antes de las 11 p.m.
2. Masticar con calma y sin pantallas
3. Beber agua durante el día (no solo al comer)
4. Caminar 10–15 min después de cada comida
5. Practicar respiración 4-7-8 antes de dormir
6. Eliminar bebidas con azúcar y endulzantes artificiales
7. Comer tres comidas completas (evitar picoteo constante)

${moduleNumber === 1 
  ? `RECUERDA: NO mencionar suplementos en este módulo.`
  : `4. 🌿 APOYO NUTRICIONAL Y FITOTERAPIA
Subtítulo visual: "💊 Complementa tus hábitos, no los reemplaza."
Incluye solo los elementos que NO se mencionaron ya en la Trifecta.
Formato educativo con precauciones:
- Magnesio glicinato → Relaja músculos, mejora sueño y glucosa. Precaución: evitar en insuficiencia renal.
- Omega 3 (EPA/DHA) → Reduce inflamación, mejora ánimo. Precaución: en anticoagulantes, consultar médico.
- Berberina → Apoya microbiota y glucosa. Precaución: evitar en embarazo/lactancia.
- Probiótico multicepa → Equilibra microbiota, mejora digestión. Precaución: suspender si hay fiebre o diarrea persistente.
- Cromo → Regula antojos. Precaución: con fármacos para diabetes, consultar médico.
- Canela / Gymnema → Equilibran glucosa. Precaución: con medicamentos para diabetes, consultar médico.
- Cardo mariano / Diente de león → Apoyan hígado y digestión. Precauciones: evitar en alergia a Asteraceae o cálculos biliares.

IMPORTANTE:
- SIEMPRE incluir la precaución específica de cada elemento.
- NO usar frases tipo "debes tomar".
- Recordatorio final: "Consulta con tu médico antes de implementar cualquier suplemento."`}

${moduleNumber === 1 ? '4' : '5'}. 💬 FRASE FINAL
Usar esta versión completa (4 líneas):
"Esta guía es educativa y no reemplaza orientación médica.
Tu cuerpo no está roto, está buscando equilibrio.
Mientras el cuerpo esté en alerta, no puede sanar.
Sanar no es controlar un síntoma, es entender la raíz."

EXTENSIÓN: 300–500 palabras (conciso y directo).
FORMATO VISUAL: Usa subtítulos y emojis para hacerlo más visual y amigable.
LENGUAJE: Completamente claro, sin abreviaturas técnicas.

FORMATO DE RESPUESTA - Responde ÚNICAMENTE en formato JSON con esta estructura exacta:
{
  "resumen": "Contenido completo de la sección 'Qué está mostrando tu cuerpo'",
  "hallazgos": "Contenido completo de 'La Trifecta Funcional' con las 3 áreas",
  "recomendaciones": "Contenido completo de 'Qué puedes mejorar' + 'Apoyo nutricional' si aplica",
  "fraseFinal": "Frase final educativa"
}

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional antes o después.`;

      console.log('Generando informe con OpenAI usando conocimiento funcional...');
      const startTime = Date.now();
      
      // Usar gpt-4o-mini para respuestas más rápidas (5-10 segundos en lugar de 30-60 segundos)
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1500,
        temperature: 0.7
      });
      
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`⏱️ OpenAI respondió en ${elapsedTime}s`);

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error("No se recibió respuesta de OpenAI");
      }

      console.log('Respuesta de OpenAI recibida');

      // Parsear la respuesta JSON
      const reportData = JSON.parse(aiResponse);

      // Guardar el informe en la base de datos
      const report = await storage.createReport({
        userId,
        resumen: reportData.resumen,
        hallazgos: reportData.hallazgos,
        recomendaciones: reportData.recomendaciones,
        fraseFinal: reportData.fraseFinal
      });

      console.log('Informe guardado en BD:', report.id);

      // 📧 ENVIAR EMAIL DE REPORTE LISTO
      try {
        const { sendReportReadyEmail } = await import("./email");
        const intakeForm = await storage.getIntakeFormByUserId(userId);
        const userName = intakeForm?.nombre || undefined;
        
        if (user.email) {
          console.log('📧 Enviando email de reporte listo a:', user.email, userName ? `(${userName})` : '');
          await sendReportReadyEmail(user.email, userName, moduleNumber);
          console.log('✅ Email de reporte listo enviado');
        }
      } catch (emailError) {
        // No fallar la generación del reporte si el email falla
        console.error('⚠️ Error enviando email de reporte listo (no crítico):', emailError);
      }

      res.json(report);
    } catch (error: any) {
      console.error("Error generando informe:", error);
      res.status(500).json({ 
        error: "Error al generar el informe",
        details: error.message 
      });
    }
  });

  // TEST ENDPOINT
  app.post("/api/test-checkin", async (req, res) => {
    console.log('🧪 TEST ENDPOINT LLAMADO - Body:', req.body);
    res.json({ status: 'ok', message: 'test funcionando' });
  });

  // Weekly Checkin - Chat Funcional Interactivo
  app.post("/api/weekly-checkin", async (req, res) => {
    console.log('🌿 ENDPOINT /api/weekly-checkin LLAMADO');
    try {
      console.log('POST /api/weekly-checkin - Body recibido:', JSON.stringify(req.body));
      const { userId, message } = req.body;

      if (!userId || !message) {
        console.log('Error: Faltan parámetros requeridos', { userId: !!userId, message: !!message });
        return res.status(400).json({ error: "userId y message son requeridos" });
      }

      console.log(`Procesando check-in semanal para userId: ${userId}`);

      // Obtener datos del usuario para contexto
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Obtener historial previo para comparación
      const previousCheckins = await storage.getWeeklyCheckinsByUserId(userId);
      const hasHistory = previousCheckins.length > 0;

      // ACCESO AL CHAT DURANTE EL TRIAL:
      // Los usuarios de trial tienen acceso ILIMITADO al chat durante 7 días
      // No hay límite de conversaciones - el límite es solo temporal (7 días)

      // Preparar el prompt para "Marvin Lira IA"
      const { openai } = await import("./openai");

      const systemMessage = `Eres el asistente funcional "Marvin Lira IA" 🌿
Tu rol es escuchar cómo se siente el usuario día a día durante su prueba de 7 días y responder con empatía y claridad,
explicando brevemente qué puede significar lo que siente y cómo puede apoyar su cuerpo desde la raíz.

PRINCIPIOS EDUCATIVOS:
• No das diagnósticos ni dosis específicas
• Enseñas desde la medicina funcional con los 3 ejes: Digestión y Eliminación (FECAR), Sueño, Azúcar
• Usas lenguaje simple, sin tecnicismos
• Eres breve y directo (150-250 palabras)
• Siempre cierras con una frase motivacional de consciencia

EMOJIS EDUCATIVOS:
🥦 Digestión y Eliminación (FECAR)
🌙 sueño / descanso
🍯 azúcar / glucosa / antojos
🌿 energía / vitalidad
💧 hidratación
🧘 estrés / sistema nervioso

ESTRUCTURA DE RESPUESTA:
1. Identifica los sistemas afectados (digestión, sueño, azúcar)
2. Para cada sistema detectado:
   - Emoji del sistema
   - Explicación breve de qué está pasando
   - 1-2 ajustes funcionales simples
3. Frase final motivacional (1 línea)

FRASES DE CIERRE (elige una o crea similar):
• "Tu cuerpo no está roto, solo está buscando equilibrio."
• "Mientras el cuerpo esté en alerta, no puede sanar."
• "Sanar no es controlar un síntoma, es entender la raíz."
• "La digestión tranquila apaga la inflamación y enciende tu energía."

IMPORTANTE:
- NO uses frases técnicas como "resistencia a la insulina" o "disbiosis"
- SÍ usa metáforas: "fuego digestivo", "raíz", "equilibrio", "alerta"
- Siempre menciona: "Si los síntomas persisten, consulta con tu médico."

Responde en JSON con esta estructura exacta:
{
  "responseText": "Tu respuesta empática completa (150-250 palabras)",
  "systemsDetected": ["array de sistemas: fecar, sueño, azúcar, estrés, energía"],
  "emotionTags": ["array de emociones: ansiedad, cansancio, frustración, esperanza, alegría"]
}`;

      const userPrompt = `El usuario te comparte cómo se sintió hoy (sueño, digestión, energía, ánimo):

"${message}"

${hasHistory ? `(El usuario ha compartido ${previousCheckins.length} veces anteriores durante su prueba de 7 días. Puedes mencionar progreso si es evidente.)` : '(Esta es la primera vez que el usuario comparte contigo durante su prueba de 7 días gratuitos.)'}

Responde con empatía, identifica sistemas afectados y ofrece orientación funcional simple basada en los síntomas que comparte hoy.
Devuelve SOLO el JSON, sin texto adicional.`;

      console.log('Generando respuesta del chat con Marvin Lira IA...');

      let completion;
      try {
        completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemMessage
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 800
        });
      } catch (openaiError: any) {
        console.error('Error llamando a OpenAI:', openaiError.message);
        console.error('Stack:', openaiError.stack);
        throw new Error(`Error de OpenAI: ${openaiError.message}`);
      }

      console.log('OpenAI completion recibida - choices length:', completion.choices?.length);

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        console.error('No hay contenido en la respuesta. Completion:', JSON.stringify(completion));
        throw new Error("No se recibió respuesta de OpenAI");
      }

      console.log('Respuesta de Marvin Lira IA recibida - length:', aiResponse.length);

      // Parsear la respuesta JSON
      const chatData = JSON.parse(aiResponse);

      // Guardar el check-in en la base de datos
      const checkin = await storage.createWeeklyCheckin({
        userId,
        inputText: message,
        responseText: chatData.responseText,
        systemsDetected: chatData.systemsDetected || [],
        emotionTags: chatData.emotionTags || []
      });

      console.log('Check-in guardado en BD:', checkin.id);

      res.json({
        id: checkin.id,
        responseText: chatData.responseText,
        systemsDetected: chatData.systemsDetected,
        emotionTags: chatData.emotionTags,
        createdAt: checkin.createdAt
      });
    } catch (error: any) {
      console.error("Error procesando check-in semanal:", error);
      res.status(500).json({ 
        error: "Error al procesar el mensaje",
        details: error.message 
      });
    }
  });

  // Get Weekly Checkin History
  app.get("/api/weekly-checkins/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const checkins = await storage.getWeeklyCheckinsByUserId(userId);
      res.json(checkins);
    } catch (error: any) {
      console.error("Error obteniendo check-ins:", error);
      res.status(500).json({ error: "Error al obtener el historial" });
    }
  });

  // Get User Progress Stats
  app.get("/api/user-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      // Obtener usuario y checkins
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Obtener TODO el historial de checkins (sin límite de tiempo)
      // Nota: a pesar del nombre "weekly", este método devuelve TODOS los checkins del usuario
      const checkins = await storage.getWeeklyCheckinsByUserId(userId);
      
      // Ordenar defensivamente por createdAt DESC (más reciente primero)
      // Esto asegura que checkins[0] siempre sea el más reciente
      checkins.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Helper: Normalizar fecha a día calendario en timezone Mexico
      // Usa Intl.DateTimeFormat para evitar problemas de conversión doble
      const toCalendarDay = (date: Date): string => {
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Mexico_City',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return formatter.format(date); // Returns YYYY-MM-DD
      };

      // Calcular estadísticas del chat
      const chatStats = {
        totalMessages: checkins.length,
        // Bug fix: Normalizar lastUsedDate al mismo formato de día calendario
        lastUsedDate: checkins.length > 0 ? toCalendarDay(new Date(checkins[0].createdAt)) : null,
        totalActiveDays: 0,
        currentStreak: 0
      };

      if (checkins.length > 0) {
        // Agrupar por día calendario único (ya normalizados a timezone México)
        const uniqueDays = new Set(
          checkins.map(c => toCalendarDay(new Date(c.createdAt)))
        );
        chatStats.totalActiveDays = uniqueDays.size;

        // Calcular racha actual (días consecutivos hasta el último día usado)
        // Trabaja directamente con strings YYYY-MM-DD para evitar timezone double-conversion
        const sortedDays = Array.from(uniqueDays).sort().reverse();
        let streak = 0;

        if (sortedDays.length > 0) {
          const mostRecentDay = sortedDays[0]; // String YYYY-MM-DD

          // Helper: Restar días de un string YYYY-MM-DD sin conversión de timezone
          const subtractDays = (dateStr: string, days: number): string => {
            // Usar noon UTC para evitar problemas de timezone boundary
            const date = new Date(dateStr + 'T12:00:00Z');
            date.setUTCDate(date.getUTCDate() - days);
            return date.toISOString().split('T')[0];
          };

          // Contar días consecutivos hacia atrás verificando existencia en el Set
          // Esto evita romper la racha por gaps en el array ordenado
          let currentDay = mostRecentDay;
          while (uniqueDays.has(currentDay)) {
            streak++;
            currentDay = subtractDays(currentDay, 1);
          }
        }

        chatStats.currentStreak = streak;
      }

      // Calcular progreso del trial
      const trialStartDate = new Date(user.trialStartDate!);
      const now = new Date();
      const msPerDay = 24 * 60 * 60 * 1000;
      const trialLength = 7;
      
      const daysElapsed = Math.floor((now.getTime() - trialStartDate.getTime()) / msPerDay);
      const daysCompleted = Math.max(0, Math.min(daysElapsed, trialLength));
      const daysRemaining = Math.max(0, trialLength - daysElapsed);
      const percentComplete = Math.round((daysCompleted / trialLength) * 100);

      const trialProgress = {
        daysCompleted,
        daysRemaining,
        percentComplete
      };

      // Generar acciones sugeridas basado en reglas
      const suggestedActions: string[] = [];
      const isSubscribed = user.subscriptionStatus === 'active';

      if (chatStats.currentStreak === 0) {
        suggestedActions.push("Inicia tu racha hoy: haz tu primera consulta con Marvin");
      } else if (chatStats.currentStreak < 3) {
        suggestedActions.push("Mantén tu racha: continúa tu conversación con Marvin");
      } else {
        suggestedActions.push(`¡Increíble! Llevas ${chatStats.currentStreak} días consecutivos`);
      }

      if (!isSubscribed && daysRemaining <= 2 && daysRemaining > 0) {
        suggestedActions.push("Tu trial termina pronto: asegura acceso ilimitado suscribiéndote");
      } else if (!isSubscribed && daysRemaining > 2) {
        suggestedActions.push("Explora todas las funciones durante tu trial gratuito");
      }

      if (chatStats.totalMessages < 5) {
        suggestedActions.push("Prueba preguntas sobre nutrición, síntomas o progreso");
      }

      res.json({
        chatStats,
        trialProgress,
        suggestedActions
      });
    } catch (error: any) {
      console.error("Error obteniendo progreso del usuario:", error);
      res.status(500).json({ error: "Error al obtener el progreso" });
    }
  });

  // Get Onboarding Progress
  app.get("/api/onboarding-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      // Obtener usuario, intake form y reporte
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const intakeForm = await storage.getIntakeFormByUserId(userId);
      const report = await storage.getReportByUserId(userId);
      const checkins = await storage.getWeeklyCheckinsByUserId(userId);

      // Calcular pasos completados
      const steps = [
        {
          id: "intake",
          title: "Completar cuestionario inicial",
          completed: !!intakeForm,
          completedAt: intakeForm?.createdAt,
          link: "/onboarding/paso-1"
        },
        {
          id: "report",
          title: "Recibir informe funcional personalizado",
          completed: !!report,
          completedAt: report?.createdAt,
          link: "/informe-funcional"
        },
        {
          id: "first_chat",
          title: "Hacer primera consulta con Marvin",
          completed: !!user.firstChatCompletedAt,
          completedAt: user.firstChatCompletedAt,
          link: "/chat-semanal",
          isPrimaryCTA: true
        },
        {
          id: "view_report",
          title: "Revisar tu informe completo",
          completed: !!user.reportViewedAt,
          completedAt: user.reportViewedAt,
          link: "/informe-funcional"
        }
      ];

      const completedSteps = steps.filter(s => s.completed).length;
      const totalSteps = steps.length;
      const percentComplete = Math.round((completedSteps / totalSteps) * 100);
      const isComplete = completedSteps === totalSteps;

      // Obtener siguiente paso sugerido
      const nextStep = steps.find(s => !s.completed);

      res.json({
        steps,
        completedSteps,
        totalSteps,
        percentComplete,
        isComplete,
        nextStep: nextStep || null
      });
    } catch (error: any) {
      console.error("Error obteniendo progreso de onboarding:", error);
      res.status(500).json({ error: "Error al obtener el progreso de onboarding" });
    }
  });

  // Test email endpoint (development only)
  app.post("/api/test-email", async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ 
        error: "Este endpoint solo está disponible en modo desarrollo" 
      });
    }

    try {
      const { sendWelcomeEmail, sendReportReadyEmail, sendModuleUnlockedEmail, sendEmail } = await import("./email");
      const { type, to, name, moduleNumber } = req.body;

      if (!to) {
        return res.status(400).json({ error: "El campo 'to' es requerido" });
      }

      console.log(`📧 Enviando correo de prueba tipo: ${type || 'custom'} a ${to}`);

      if (type === 'welcome') {
        await sendWelcomeEmail(to, name);
        res.json({ 
          success: true, 
          message: `Correo de bienvenida enviado a ${to}` 
        });
      } else if (type === 'report') {
        await sendReportReadyEmail(to, name, moduleNumber || 1);
        res.json({ 
          success: true, 
          message: `Correo de informe listo enviado a ${to}` 
        });
      } else if (type === 'module') {
        await sendModuleUnlockedEmail(to, name, moduleNumber || 2);
        res.json({ 
          success: true, 
          message: `Correo de módulo desbloqueado enviado a ${to}` 
        });
      } else {
        const { subject, html } = req.body;
        if (!subject || !html) {
          return res.status(400).json({ 
            error: "Para correo personalizado, 'subject' y 'html' son requeridos" 
          });
        }
        await sendEmail({ to, subject, html });
        res.json({ 
          success: true, 
          message: `Correo personalizado enviado a ${to}` 
        });
      }
    } catch (error: any) {
      console.error("Error enviando correo de prueba:", error);
      res.status(500).json({ 
        error: "Error al enviar el correo",
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
