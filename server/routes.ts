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

      // Crear o actualizar el usuario en PostgreSQL
      let user = await storage.getUserByEmail(email);

      if (user) {
        // Actualizar con datos de Stripe
        user = await storage.updateUser(user.id, {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status
        });
      } else {
        // Crear nuevo usuario
        user = await storage.createUser({
          email,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status
        });
      }

      if (!user) {
        throw new Error("No se pudo crear o actualizar el usuario");
      }

      console.log('Usuario guardado en BD:', user.id);

      res.json({ 
        userId: user.id,
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

  // Intake Form routes
  app.post("/api/intake-form", async (req, res) => {
    try {
      const { userId, ...formData } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId es requerido" });
      }

      // Verificar si ya existe un intake form para este usuario
      const existing = await storage.getIntakeFormByUserId(userId);

      if (existing) {
        // Actualizar el existente
        const updated = await storage.updateIntakeForm(existing.id, formData);
        return res.json(updated);
      }

      // Crear uno nuevo
      const intakeForm = await storage.createIntakeForm({ userId, ...formData });
      res.json(intakeForm);
    } catch (error: any) {
      console.error("Error guardando intake form:", error);
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

      if (!userId || !dia || !fecha) {
        return res.status(400).json({ error: "userId, dia y fecha son requeridos" });
      }

      // Crear el daily log
      const dailyLog = await storage.createDailyLog({
        userId,
        dia,
        fecha,
        horaDormir,
        horaDespertar,
        vecesDesperto,
      });

      // Crear los momentos asociados
      if (momentos && Array.isArray(momentos)) {
        for (const momento of momentos) {
          await storage.createDailyLogMoment({
            dailyLogId: dailyLog.id,
            momento: momento.momento,
            comida: momento.comida,
            estadoAnimo: momento.estadoAnimo,
            evacuaciones: momento.evacuaciones,
          });
        }
      }

      res.json(dailyLog);
    } catch (error: any) {
      console.error("Error guardando daily log:", error);
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
        subscriptionStatus: stripeSubscriptionId ? 'active' : undefined
      });

      res.json(user);
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  });

  app.get("/api/users/:email", async (req, res) => {
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

      // Obtener intake form
      const intakeForm = await storage.getIntakeFormByUserId(userId);
      if (!intakeForm) {
        return res.status(404).json({ error: "Formulario de intake no encontrado" });
      }

      // Obtener todos los daily logs del usuario
      const dailyLogs = await storage.getDailyLogsByUserId(userId);
      if (dailyLogs.length === 0) {
        return res.status(404).json({ error: "No hay registros de 5 días disponibles" });
      }

      // Obtener los momentos de cada día
      const logsWithMoments = await Promise.all(
        dailyLogs.map(async (log) => {
          const moments = await storage.getDailyLogMomentsByLogId(log.id);
          return { ...log, moments };
        })
      );

      // Preparar el informe generado por IA
      const { openai } = await import("./openai");
      
      // Cargar conocimiento funcional
      const fs = await import('fs/promises');
      const path = await import('path');
      const conocimientoFuncional = await fs.readFile(
        path.join(process.cwd(), 'server', 'conocimiento-funcional-condensado.txt'),
        'utf-8'
      );
      
      // Construir instrucciones específicas según el módulo
      let moduleInstructions = '';
      
      if (moduleNumber === 1) {
        moduleInstructions = `
🔹 MÓDULO 1 — "Empieza desde la raíz"

Enfoque: Identificar causas raíz y patrones funcionales sin usar suplementos.
Objetivo: Que el usuario comprenda las conexiones entre digestión, inflamación, sueño, estrés y glucosa.

Instrucciones específicas:
• NO recomendar suplementos, vitaminas, hierbas ni fitoterapia.
• Enfocarte SOLO en educación, hábitos, alimentación funcional, descanso, hidratación, ritmo circadiano y consciencia corporal.
• Usa frases empáticas y simples: "Tu cuerpo no está roto, está protegiéndose."
• Si notas carencias o desequilibrios (por ejemplo, inflamación, disbiosis, fatiga), menciónalos como observaciones educativas, no como indicaciones clínicas.

Ejemplo de cierre:
"Este primer paso es para que entiendas qué te está diciendo tu cuerpo. Aún no trabajamos con suplementos; solo observamos, comprendemos y ayudamos a tu cuerpo a sentirse seguro."`;
      } else {
        moduleInstructions = `
🔹 MÓDULO ${moduleNumber} — "Suplementos Esenciales"

Enfoque: Introducir recomendaciones de apoyo nutricional o fitoterapia educativa.
Objetivo: Sugerir nutrientes o hierbas de manera general y sin dosis.

Instrucciones específicas:
• Puedes mencionar suplementos funcionales (ej. magnesio, omega-3, cromo, berberina) solo si el patrón clínico lo amerita.
• NO incluyas dosis ni marcas.
• Recuérdale al usuario que consulte con su médico o nutricionista antes de implementar cambios.
• Termina siempre con un recordatorio educativo:
"Esta guía es educativa y no reemplaza la orientación médica profesional."`;
      }
      
      // Construir el mensaje del sistema con el conocimiento funcional
      const systemMessage = `ROL Y CONTEXTO:
Actúas como un analista de nutrición funcional basado en la metodología de Marvin Lira | Nutrición Funcional.
Tu objetivo es interpretar los datos del usuario (intake + registro de 5 días) desde la raíz funcional,
usando un lenguaje claro, humano y educativo.

Tu tarea no es diagnosticar, sino ayudar al usuario a entender lo que su cuerpo intenta comunicar.

CONOCIMIENTO CLÍNICO BASE:
${conocimientoFuncional}

${moduleInstructions}

LÍMITES Y ÉTICA (PARA TODOS LOS MÓDULOS):
• No des diagnósticos médicos ni trates enfermedades.
• No hables de suspender o ajustar medicación.
• Enfócate en educación, prevención y comprensión funcional.

TONO:
• Cálido, claro y empático.
• Sin tecnicismos innecesarios.
• Usa metáforas simples: raíz, ramas, fuego digestivo, equilibrio.
• Sé esperanzador, no alarmista.

RECORDATORIO FINAL (OBLIGATORIO):
Al final de cada informe, incluye una frase educativa como:
"Esta guía es educativa y no reemplaza orientación médica. Tu cuerpo no está roto, está buscando equilibrio."

Respondes siempre en español y en formato JSON estructurado.`;
      
      // Construir el prompt con los datos del usuario
      const userPrompt = `Analiza los siguientes datos de un paciente y genera un informe funcional personalizado.

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

REGISTRO DE 5 DÍAS (FOOD-MOOD-POOP):
${logsWithMoments.map((log, idx) => `
Día ${log.dia} (${log.fecha}):
  Sueño: Durmió a las ${log.horaDormir || 'N/A'}, despertó a las ${log.horaDespertar || 'N/A'}, despertó ${log.vecesDesperto || '0'} veces.
  Momentos del día:
${log.moments.map(m => `    - ${m.momento}: Comida: ${m.comida || 'N/A'}, Estado de ánimo: ${m.estadoAnimo || 'N/A'}, Evacuaciones: ${m.evacuaciones || 'N/A'}`).join('\n')}
`).join('\n')}

MÓDULO ACTUAL: ${moduleNumber}

INSTRUCCIONES:
Aplica tu conocimiento de nutrición funcional para generar un informe en español con las siguientes 4 secciones:

1. RESUMEN: Síntesis del estado funcional identificando las "raíces" principales de disfunción. Usa lenguaje empático y educativo. (2-3 líneas)

2. HALLAZGOS: Lista de 3-5 hallazgos clave conectando sistemas y patrones. Usa metáforas simples y lenguaje funcional claro (ejemplo: "fuego digestivo", "raíz", "equilibrio", "resistencia a insulina", "inflamación"). Máximo 300 palabras.

3. RECOMENDACIONES: ${moduleNumber === 1 
  ? `Lista de 4-6 recomendaciones SOLO EDUCATIVAS (sin suplementos):
   - Empieza con hábitos esenciales (sueño, hidratación, respiración)
   - Continúa con alimentación funcional y educación sobre digestión
   - Incluye prácticas de consciencia corporal y ritmo circadiano
   - Termina con educación sobre por qué estos cambios importan
   RECUERDA: NO mencionar suplementos, vitaminas, hierbas ni fitoterapia en este módulo.`
  : `Lista de 4-6 recomendaciones funcionales:
   - Comienza con hábitos esenciales
   - Continúa con alimentación funcional
   - Puedes mencionar suplementos de forma educativa SIN dosis ni marcas (ej: "considera magnesio para...")
   - Recuerda al usuario consultar con su médico`}
   Máximo 400 palabras.

4. FRASE FINAL: Una frase educativa y empática que incluya el recordatorio obligatorio sobre que esta guía es educativa. (1-2 líneas)

FORMATO DE RESPUESTA - Responde ÚNICAMENTE en formato JSON con esta estructura exacta:
{
  "resumen": "...",
  "hallazgos": "...",
  "recomendaciones": "...",
  "fraseFinal": "..."
}

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional antes o después.`;

      console.log('Generando informe con OpenAI usando conocimiento funcional...');
      
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
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
        max_completion_tokens: 8192
      });

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

      res.json(report);
    } catch (error: any) {
      console.error("Error generando informe:", error);
      res.status(500).json({ 
        error: "Error al generar el informe",
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
