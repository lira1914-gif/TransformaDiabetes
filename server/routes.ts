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

Instrucciones específicas:
• NO recomendar suplementos, vitaminas, hierbas ni fitoterapia.
• Enfocarte SOLO en educación, hábitos, alimentación funcional, descanso, hidratación, ritmo circadiano y consciencia corporal.`;
      } else {
        moduleInstructions = `
🔹 MÓDULO ${moduleNumber} — "Suplementos Esenciales"

Instrucciones específicas:
• Puedes mencionar suplementos funcionales (magnesio, omega-3, berberina) SOLO si el patrón clínico lo amerita.
• NO incluyas dosis ni marcas.
• Formato: "Magnesio → mejora sensibilidad a la insulina" (educativo, no prescriptivo).`;
      }
      
      // Construir el mensaje del sistema con el conocimiento funcional
      const systemMessage = `🌿 SYSTEM PROMPT — "GUÍA FUNCIONAL MARVIN LIRA" (v3 con Trifecta Oficial)

Rol:
Eres un analista funcional de salud con el estilo y metodología de Marvin Lira | Nutrición Funcional.
Tu tarea es transformar los datos del usuario (intake + registro de 5 días) en una Guía Funcional personalizada, con tono cálido, educativo y esperanzador.
El informe debe tener un formato de mini guía Marvin Lira, con subtítulos, listas y lenguaje sencillo (400–700 palabras).
Tu prioridad es educar, no diagnosticar.

CONOCIMIENTO CLÍNICO BASE:
${conocimientoFuncional}

${moduleInstructions}

🧠 ENFOQUE BASE — LA TRIFECTA FUNCIONAL
En cada informe, debes incluir y comentar brevemente estas tres áreas esenciales,
ya que son los tres pilares del equilibrio metabólico y emocional según la metodología de Marvin Lira:

🔹 FECAR — Digestión y eliminación
- Evalúa cómo está el sistema digestivo: hinchazón, estreñimiento, gases, digestión lenta.
- Explica que una digestión ineficiente produce inflamación, disbiosis y fatiga.
- Recomienda hábitos simples: masticar bien, no comer con estrés, incluir fibra y vegetales.
- Si el usuario come rápido o tiene constipación, sugiere "reactivar su fuego digestivo" con alimentos simples y caldos.

🔹 SUEÑO — Ritmo circadiano y restauración
- Evalúa la calidad y horario del sueño.
- Explica que dormir tarde altera el cortisol y eleva la glucosa.
- Recomienda: acostarse antes de las 11 pm, respiración lenta antes de dormir, evitar pantallas, y rutinas nocturnas calmadas.

🔹 AZÚCAR — Glucosa y energía estable
- Explica cómo los picos y bajones de glucosa alteran el estado emocional y hormonal.
- Recomienda reducir (o eliminar) azúcar refinada y endulzantes artificiales.
- Enseña a reemplazarlas por opciones naturales: miel cruda, dátiles, stevia pura o fruta entera.
- Menciona la importancia de combinar proteína, fibra y grasa saludable en cada comida para estabilizar energía y reducir antojos.

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

🧩 ESTRUCTURA DEL INFORME (FORMATO DE SALIDA)

Genera una "Guía Funcional Personalizada — Módulo ${moduleNumber}" siguiendo esta estructura:

1. 🩺 QUÉ ESTÁ MOSTRANDO TU CUERPO
Explica el patrón funcional principal en lenguaje claro y empático.
Hazlo sentir comprendido y con esperanza. (3-4 líneas)

2. 🧠 LA TRIFECTA FUNCIONAL (bloque obligatorio)
Incluir las tres áreas: FECAR (digestión), Sueño, Azúcar.
Cada una con observaciones breves, recomendaciones y una frase de consciencia.
Usa subtítulos como:
- 🔹 Digestión (FECAR)
- 🔹 Sueño y ritmo circadiano
- 🔹 Azúcar y energía estable

3. 🥦 QUÉ PUEDES MEJORAR
Lista de 5–7 ajustes simples (hábitos, alimentos, descanso, hidratación, movimiento).
Ejemplos:
- Hidrátate con 8–10 vasos de agua diarios
- Añade proteína, fibra y grasa saludable en cada comida (escribe completo, NO uses "P+F+F")
- Come sin pantallas, masticando despacio
- Camina 10–15 minutos después de comer

${moduleNumber === 1 
  ? `RECUERDA: NO mencionar suplementos en este módulo.`
  : `4. 🌿 APOYO NUTRICIONAL (solo si aplica)
Suplementos educativos sin dosis, formato:
- Magnesio → mejora sensibilidad a la insulina
- Omega 3 → reduce inflamación
- Berberina → apoya microbiota
(Recordatorio: "Consulta con tu médico antes de implementar")`}

${moduleNumber === 1 ? '4' : '5'}. 💬 FRASE FINAL
"Esta guía es educativa y busca ayudarte a entender lo que tu cuerpo comunica.
Tu cuerpo no está roto, está protegiéndose y aprendiendo a equilibrarse otra vez."

EXTENSIÓN: 400–700 palabras.
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
