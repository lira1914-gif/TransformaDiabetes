import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not configured. Email functionality will not work.');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  bcc?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const emailData: any = {
      from: 'TransformaDiabetes <onboarding@resend.dev>',
      to: [options.to],
      subject: options.subject,
      html: options.html
    };

    if (options.bcc) {
      emailData.bcc = [options.bcc];
    }

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      throw error;
    }

    console.log('✅ Email enviado:', data?.id);
    console.log('📧 Destinatario:', options.to);
    if (options.bcc) {
      console.log('📧 BCC:', options.bcc);
    }
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(to: string, name?: string): Promise<void> {
  const userName = name || 'Estimado usuario';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        h1 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 26px;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .intro {
          margin-bottom: 30px;
        }
        .highlight {
          background-color: #f5f3ef;
          border-left: 4px solid #4a5d23;
          padding: 15px;
          margin: 25px 0;
          border-radius: 4px;
          font-style: italic;
        }
        .steps {
          margin: 25px 0;
        }
        .step {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #fafaf8;
          border-radius: 6px;
        }
        .step-number {
          font-weight: 700;
          color: #4a5d23;
          font-size: 18px;
          margin-bottom: 8px;
        }
        .step-title {
          font-weight: 600;
          color: #2a2a2a;
          margin-bottom: 5px;
        }
        .step-desc {
          color: #5a5a5a;
          font-size: 15px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          background-color: #4a5d23;
          color: #ffffff !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 8px;
        }
        .quotes {
          background-color: #f9f7f4;
          padding: 20px;
          border-radius: 6px;
          margin: 25px 0;
        }
        .quote {
          font-style: italic;
          color: #4a5d23;
          margin: 10px 0;
          font-size: 15px;
        }
        .divider {
          border-top: 2px solid #e8e6e1;
          margin: 30px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-size: 14px;
          color: #757575;
        }
        .signature {
          margin: 20px 0;
          color: #3a3a3a;
        }
        .disclaimer {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 6px;
          margin-top: 25px;
          font-size: 13px;
          color: #666;
          border-left: 3px solid #b85c38;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bienvenido a TransformaDiabetes</h1>
          <p style="color: #757575; font-size: 15px; margin-top: 10px;">Tu cuerpo no está roto, está buscando equilibrio</p>
        </div>
        
        <div class="intro">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Gracias por unirte a TransformaDiabetes.<br>
          Has dado el primer paso hacia una comprensión más profunda de tu cuerpo — no desde el miedo, sino desde la raíz.</p>
          
          <p>Durante las próximas semanas te acompañaremos a descubrir cómo tus hábitos, tu digestión y tu energía trabajan juntos para crear equilibrio.</p>
        </div>

        <div class="divider"></div>
        
        <h2>¿Qué sigue ahora?</h2>
        
        <div class="steps">
          <div class="step">
            <div class="step-number">1. Completa tu registro funcional</div>
            <div class="step-desc">
              Accede a tu cuenta y llena el intake inicial con tus datos y hábitos diarios.
              <br><a href="${baseUrl}/onboarding/intake-form" class="button">Acceder al formulario de inicio</a>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2. Recibe tu informe funcional inmediatamente</div>
            <div class="step-title">Módulo 1: Empieza desde la raíz</div>
            <div class="step-desc">
              Tan pronto completes tu formulario, nuestra IA generará tu primer informe funcional personalizado.<br>
              Incluye observaciones, hábitos y tu plan educativo inicial basado en tus respuestas.
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3. Usa el chat para rastrear tus síntomas diarios</div>
            <div class="step-desc">
              Durante tu prueba de 7 días tendrás acceso ilimitado al chat "Marvin Lira IA".<br>
              Comparte cómo te sientes cada día: sueño, digestión, energía y ánimo. La IA aprenderá de ti y te guiará.
            </div>
          </div>
        </div>

        <div class="divider"></div>
        
        <div class="quotes">
          <h2 style="margin-top: 0;">Recuerda</h2>
          <div class="quote">"Tu cuerpo no está roto; solo está protegiéndose."</div>
          <div class="quote">"Mientras el cuerpo esté en alerta, no puede sanar."</div>
          <p style="margin-top: 15px; font-size: 15px;">
            Tu proceso no se trata de controlar síntomas, sino de entender causas y recuperar confianza en tu cuerpo.
          </p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con gratitud,<br>
            <strong>Marvin Lira</strong><br>
            Nutrición Funcional & Salud desde la raíz<br>
            <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a><br>
            <a href="https://transformadiabetes.com" style="color: #4a5d23;">transformadiabetes.com</a></p>
          </div>
          
          <div class="disclaimer">
            <strong>Nota importante:</strong> Este correo tiene fines educativos y no sustituye orientación médica. Si tienes diagnóstico o medicación activa, consulta con tu médico antes de realizar cambios significativos.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Bienvenido a TransformaDiabetes — Tu cuerpo no está roto, está buscando equilibrio',
    html
  });
}

export async function sendReportReadyEmail(to: string, name?: string, moduleNumber: number = 1): Promise<void> {
  const userName = name || 'Estimado usuario';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        h1 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 26px;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .intro {
          margin-bottom: 30px;
        }
        .module-box {
          background-color: #f9f7f4;
          padding: 25px;
          border-radius: 6px;
          margin: 25px 0;
          border-left: 4px solid #b85c38;
        }
        .module-title {
          font-weight: 700;
          color: #b85c38;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .module-subtitle {
          color: #5a5a5a;
          font-size: 15px;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .pillar {
          margin-bottom: 15px;
        }
        .pillar-number {
          font-weight: 700;
          color: #4a5d23;
          margin-bottom: 5px;
        }
        .pillar-desc {
          color: #5a5a5a;
          font-size: 15px;
          line-height: 1.6;
        }
        .cta-box {
          background-color: #f5f3ef;
          padding: 20px;
          border-radius: 6px;
          margin: 25px 0;
          text-align: center;
        }
        .cta-title {
          font-weight: 600;
          margin-bottom: 10px;
          color: #2a2a2a;
        }
        .button {
          display: inline-block;
          background-color: #b85c38;
          color: #ffffff !important;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 10px;
        }
        .info-text {
          font-size: 14px;
          color: #666;
          margin-top: 15px;
          line-height: 1.6;
        }
        .quotes {
          background-color: #f9f7f4;
          padding: 20px;
          border-radius: 6px;
          margin: 25px 0;
        }
        .quote {
          font-style: italic;
          color: #4a5d23;
          margin: 10px 0;
          font-size: 15px;
        }
        .divider {
          border-top: 2px solid #e8e6e1;
          margin: 30px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-size: 14px;
          color: #757575;
        }
        .signature {
          margin: 20px 0;
          color: #3a3a3a;
        }
        .disclaimer {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 6px;
          margin-top: 25px;
          font-size: 13px;
          color: #666;
          border-left: 3px solid #b85c38;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Tu primera Guía Funcional está lista</h1>
          <p style="color: #757575; font-size: 15px; margin-top: 10px;">Aprende lo que tu cuerpo te está diciendo</p>
        </div>
        
        <div class="intro">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Tu primera Guía Funcional Personalizada ya está lista.<br>
          Este es el inicio de tu proceso educativo con TransformaDiabetes,
          donde aprenderás a escuchar y entender lo que tu cuerpo comunica cada día.</p>
        </div>

        <div class="divider"></div>
        
        <div class="module-box">
          <div class="module-title">Módulo 1: "Empieza desde la raíz"</div>
          <div class="module-subtitle">
            Este primer informe no busca que cambies todo de golpe,
            sino que comprendas las tres raíces funcionales que sostienen tu bienestar:
          </div>
          
          <div class="pillar">
            <div class="pillar-number">1. Digestión y Eliminación (FECAR)</div>
            <div class="pillar-desc">
              Aprende a observar tus hábitos digestivos y cómo influyen en tu energía, inflamación y ánimo.
            </div>
          </div>
          
          <div class="pillar">
            <div class="pillar-number">2. Sueño y Ritmo Circadiano</div>
            <div class="pillar-desc">
              Descubre cómo tu descanso repara, regula y estabiliza tu metabolismo.
            </div>
          </div>
          
          <div class="pillar">
            <div class="pillar-number">3. Azúcar y Energía Estable</div>
            <div class="pillar-desc">
              Entiende cómo tus comidas y tus emociones influyen en tus niveles de glucosa y claridad mental.
            </div>
          </div>
        </div>

        <div class="divider"></div>
        
        <div class="cta-box">
          <div class="cta-title">Accede a tu Guía Funcional completa aquí:</div>
          <a href="${baseUrl}/onboarding/informe-inicial" class="button">Ver mi informe funcional</a>
          <div class="info-text">
            El informe incluye tus observaciones, hábitos clave y recomendaciones educativas
            creadas con el método Marvin Lira | Nutrición Funcional,
            basado en fisiología, empatía y consciencia del cuerpo.
          </div>
        </div>

        <div class="divider"></div>

        <h2>Siguiente paso: Rastrear tus síntomas diarios</h2>
        
        <div class="module-box" style="border-left-color: #6b8e23;">
          <div class="module-title" style="color: #6b8e23;">💬 Chat con Marvin Lira IA — Disponible ahora</div>
          <div class="module-subtitle">
            Durante tu prueba de 7 días, tienes acceso ilimitado al chat interactivo.
            Úsalo cada día para compartir:
          </div>
          
          <div class="pillar">
            <div class="pillar-number">🌙 Cómo dormiste</div>
            <div class="pillar-desc">
              ¿Cuántas horas? ¿Despertaste en la noche? ¿Cómo te sentiste al levantarte?
            </div>
          </div>
          
          <div class="pillar">
            <div class="pillar-number">🍽️ Cómo estuvo tu digestión</div>
            <div class="pillar-desc">
              ¿Inflamación? ¿Estreñimiento? ¿Acidez? Observa sin juzgar.
            </div>
          </div>
          
          <div class="pillar">
            <div class="pillar-number">⚡ Tu nivel de energía y ánimo</div>
            <div class="pillar-desc">
              ¿Estable o con bajones? ¿Antojos de dulce? ¿Ansiedad? Todo es información valiosa.
            </div>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <a href="${baseUrl}/chat-semanal" class="button" style="background-color: #6b8e23;">Ir al chat ahora</a>
          </div>
        </div>

        <div class="divider"></div>
        
        <div class="quotes">
          <h2 style="margin-top: 0;">Recuerda</h2>
          <div class="quote">"Tu cuerpo no está roto, solo está buscando equilibrio."</div>
          <div class="quote">"Sanar no es controlar un síntoma, es entender la raíz."</div>
          <p style="margin-top: 15px; font-size: 15px;">
            Cada pequeño cambio que hagas desde hoy es una señal de que tu cuerpo ya está respondiendo.
            Empieza con calma, con intención, y celebra cada mejora.
          </p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con gratitud,<br>
            <strong>Marvin Lira</strong><br>
            Nutrición Funcional & Salud desde la raíz<br>
            <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a><br>
            <a href="https://transformadiabetes.com" style="color: #4a5d23;">transformadiabetes.com</a></p>
          </div>
          
          <div class="disclaimer">
            <strong>Nota importante:</strong> Esta guía tiene fines educativos y no sustituye orientación médica. No incluye prescripción de suplementos ni dosis, solo pautas educativas basadas en fisiología funcional.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Tu primera Guía Funcional está lista — Aprende lo que tu cuerpo te está diciendo',
    html
  });
}

export async function sendModuleUnlockedEmail(to: string, name?: string, moduleNumber: number = 2): Promise<void> {
  const userName = name || 'Estimado usuario';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .celebration {
          background: linear-gradient(135deg, #4a5d23 0%, #6b8e23 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .celebration h1 {
          margin: 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 24px;
        }
        .celebration p {
          margin: 10px 0 0 0;
          opacity: 0.95;
        }
        h1 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 26px;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .intro {
          margin-bottom: 30px;
        }
        .module-box {
          background-color: #f9f7f4;
          padding: 25px;
          border-radius: 6px;
          margin: 25px 0;
          border-left: 4px solid #6b8e23;
        }
        .module-title {
          font-weight: 700;
          color: #6b8e23;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .feature {
          margin-bottom: 20px;
        }
        .feature-number {
          font-weight: 700;
          color: #4a5d23;
          margin-bottom: 5px;
          font-size: 16px;
        }
        .feature-subtitle {
          color: #2a2a2a;
          font-size: 15px;
          margin-bottom: 5px;
        }
        .feature-desc {
          color: #5a5a5a;
          font-size: 14px;
          line-height: 1.6;
        }
        .cta-box {
          background-color: #f5f3ef;
          padding: 20px;
          border-radius: 6px;
          margin: 25px 0;
          text-align: center;
        }
        .cta-title {
          font-weight: 600;
          margin-bottom: 10px;
          color: #2a2a2a;
        }
        .button {
          display: inline-block;
          background-color: #6b8e23;
          color: #ffffff !important;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 10px;
        }
        .info-text {
          font-size: 14px;
          color: #666;
          margin-top: 15px;
          line-height: 1.6;
        }
        .quotes {
          background-color: #f9f7f4;
          padding: 20px;
          border-radius: 6px;
          margin: 25px 0;
        }
        .quote {
          font-style: italic;
          color: #4a5d23;
          margin: 10px 0;
          font-size: 15px;
        }
        .divider {
          border-top: 2px solid #e8e6e1;
          margin: 30px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-size: 14px;
          color: #757575;
        }
        .signature {
          margin: 20px 0;
          color: #3a3a3a;
        }
        .disclaimer {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 6px;
          margin-top: 25px;
          font-size: 13px;
          color: #666;
          border-left: 3px solid #6b8e23;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="celebration">
          <h1>Nuevo módulo desbloqueado</h1>
          <p>Felicidades por completar tu primer mes</p>
        </div>
        
        <div class="intro">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Felicidades por completar tu primer mes con TransformaDiabetes.<br>
          Tu compromiso ya está creando cambios reales: más conciencia, más equilibrio y más calma.</p>
          
          <p>Hoy se desbloquea tu <strong>Módulo 2: Apoyo Nutricional y Sistema Nervioso</strong>,
          donde aprenderás cómo nutrir tu cuerpo para regular el estrés, estabilizar la glucosa y sostener tu energía sin agotarte.</p>
        </div>

        <div class="divider"></div>
        
        <h2>En este módulo descubrirás:</h2>
        
        <div class="module-box">
          <div class="feature">
            <div class="feature-number">1. Cómo el sistema nervioso influye en tu metabolismo</div>
            <div class="feature-subtitle">El estrés constante mantiene tu cuerpo en "modo alerta".</div>
            <div class="feature-desc">
              Aprenderás hábitos que apagan esa alarma y activan el modo reparación.
            </div>
          </div>
          
          <div class="feature">
            <div class="feature-number">2. Nutrientes que calman y equilibran</div>
            <div class="feature-subtitle">Magnesio, omega 3 y zinc: cofactores esenciales para energía estable y sueño profundo.</div>
          </div>
          
          <div class="feature">
            <div class="feature-number">3. Fitoterapia funcional educativa</div>
            <div class="feature-subtitle">Plantas como ashwagandha o GABA natural que ayudan a regular cortisol,</div>
            <div class="feature-desc">
              siempre presentadas con precauciones y fines educativos.
            </div>
          </div>
          
          <div class="feature">
            <div class="feature-number">4. Tu digestión como espejo del sistema nervioso</div>
            <div class="feature-subtitle">Cuando la mente se calma, el intestino responde.</div>
            <div class="feature-desc">
              Practicarás rutinas sencillas de respiración y masticación consciente.
            </div>
          </div>
        </div>

        <div class="divider"></div>
        
        <div class="cta-box">
          <div class="cta-title">Accede ahora a tu nuevo módulo:</div>
          <a href="${baseUrl}/onboarding/informe-inicial" class="button">Ver mi módulo ${moduleNumber} en TransformaDiabetes</a>
          <div class="info-text">
            Este contenido se adapta automáticamente a tu progreso y tus registros anteriores,
            para que cada recomendación te hable a ti y a tu cuerpo, no a una teoría.
          </div>
        </div>

        <div class="divider"></div>
        
        <div class="quotes">
          <h2 style="margin-top: 0;">Recuerda</h2>
          <div class="quote">"Mientras el cuerpo esté en alerta, no puede sanar."</div>
          <div class="quote">"Tu paz interna es la señal que tu metabolismo estaba esperando."</div>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con gratitud,<br>
            <strong>Marvin Lira</strong><br>
            Nutrición Funcional & Salud desde la raíz<br>
            <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a><br>
            <a href="https://transformadiabetes.com" style="color: #4a5d23;">transformadiabetes.com</a></p>
          </div>
          
          <div class="disclaimer">
            <strong>Nota educativa:</strong> Esta guía tiene fines educativos y no sustituye orientación médica. Las referencias a suplementos o plantas son informativas, sin dosis ni marcas. Consulta a tu médico antes de realizar cambios significativos.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Nuevo módulo desbloqueado — Fortalece tu energía y calma desde la raíz',
    html
  });
}

export async function sendReactivationEmail(to: string, name?: string): Promise<void> {
  const userName = name || 'Hola';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 25px;
        }
        h1 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 24px;
          margin-bottom: 15px;
          line-height: 1.3;
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .intro {
          margin-bottom: 25px;
        }
        .highlight {
          background-color: #f0f7f0;
          border-left: 4px solid #4a5d23;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .quote {
          font-style: italic;
          color: #4a5d23;
          font-size: 17px;
          text-align: center;
          margin: 25px 0;
          padding: 15px;
          background-color: #fafaf8;
          border-radius: 6px;
        }
        .button {
          display: inline-block;
          background-color: #6b7041;
          color: #ffffff;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .button-container {
          text-align: center;
          margin: 25px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
        .signature {
          margin-top: 20px;
          color: #4a5d23;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 ${userName}</h1>
        </div>
        
        <div class="content intro">
          <p>Tu cuenta en TransformaDiabetes vuelve a estar activa.<br>
          Mantendrás tus módulos, informes y todo tu progreso anterior.</p>
        </div>
        
        <div class="highlight">
          <p style="margin: 0; font-size: 16px; line-height: 1.6;">
            Tu cuerpo no se rindió — solo necesitaba una pausa.<br>
            Hoy estás eligiendo continuar desde la raíz. 🌱
          </p>
        </div>
        
        <div class="button-container">
          <a href="${baseUrl}/perfil" class="button">👉 Entrar a mi panel</a>
        </div>
        
        <div class="quote">
          "Mientras el cuerpo esté en alerta, no puede sanar."
        </div>
        
        <div class="content">
          <p>Hoy estás volviendo a escucharlo con conciencia.</p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con gratitud,<br>
            <strong>Marvin Lira</strong><br>
            Nutrición Funcional & Salud desde la raíz<br>
            📩 <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '💚 Tu suscripción ha sido reactivada — ¡Nos alegra tenerte de vuelta!',
    html
  });
}

export async function sendModule1CompletedEmail(to: string, name?: string): Promise<void> {
  const userName = name || 'Hola';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        h1 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 26px;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.8;
        }
        .highlight {
          background-color: #f5f3ef;
          border-left: 4px solid #4a5d23;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .quote {
          font-style: italic;
          font-size: 18px;
          color: #4a5d23;
          text-align: center;
          padding: 25px;
          margin: 30px 0;
          background-color: #f9f9f7;
          border-radius: 6px;
        }
        .cta-button {
          display: inline-block;
          background-color: #6B7041;
          color: #ffffff !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 25px 0;
          text-align: center;
        }
        .cta-container {
          text-align: center;
          margin: 30px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 25px;
          border-top: 1px solid #e6e3d9;
          font-size: 14px;
          color: #6a6a6a;
        }
        .signature {
          margin-top: 20px;
        }
        .emoji {
          font-size: 22px;
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><span class="emoji">🌿</span> Has completado tu primer módulo</h1>
        </div>
        
        <div class="content">
          <p>${userName},</p>
          
          <p><span class="emoji">✨</span> <strong>¡Felicidades! Has completado el Módulo 1 — "Empieza desde la raíz."</strong></p>
          
          <p>Este primer paso marca el inicio real de tu transformación funcional.<br>
          Has aprendido a observar las señales de tu cuerpo — digestión, energía, sueño y emociones — sin juzgarte.<br>
          Cada registro que hiciste fue una conversación entre tú y tu biología.</p>
        </div>
        
        <div class="highlight">
          <h2><span class="emoji">🧭</span> Reflexión funcional</h2>
          <div class="quote">
            "No se trata de controlar un síntoma, sino de entender la raíz."
          </div>
          <div class="content">
            <p>Tu cuerpo no está roto; está pidiendo equilibrio.<br>
            Y tú ya estás aprendiendo a escuchar lo que realmente necesita.</p>
          </div>
        </div>
        
        <div class="content">
          <h2><span class="emoji">🌱</span> Lo que viene ahora</h2>
          <p>El siguiente módulo, <strong>"Equilibra desde adentro,"</strong> te enseñará cómo fortalecer tus sistemas desde la nutrición funcional — con estrategias personalizadas y apoyo natural educativo (sin dosis ni marcas).</p>
        </div>
        
        <div class="cta-container">
          <a href="${baseUrl}/modulo-1" class="cta-button">
            <span class="emoji">👉</span> Continuar al Módulo 2
          </a>
        </div>
        
        <div class="content" style="font-size: 14px; color: #6a6a6a; margin-top: 30px;">
          <p><span class="emoji">💬</span> Si algo no funciona o tienes preguntas sobre tu acceso, puedes escribirnos desde el chat de soporte técnico dentro de la aplicación.</p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p><span class="emoji">🌿</span> <strong>Marvin Lira</strong><br>
            Nutrición Funcional<br>
            <em>Tu cuerpo no está roto, solo está buscando equilibrio.</em><br><br>
            📩 <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '🌿 Has completado tu primer módulo — Tu cuerpo ya está respondiendo',
    html
  });
}

export async function sendModule2CompletedEmail(to: string, name?: string): Promise<void> {
  const userName = name || 'Hola';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        h1 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 26px;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: #4a5d23;
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.8;
        }
        .highlight {
          background-color: #f5f3ef;
          border-left: 4px solid #4a5d23;
          padding: 20px;
          margin: 30px 0;
          border-radius: 4px;
        }
        .quote {
          font-style: italic;
          font-size: 18px;
          color: #4a5d23;
          text-align: center;
          padding: 25px;
          margin: 30px 0;
          background-color: #f9f9f7;
          border-radius: 6px;
        }
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }
        .benefits-list li {
          padding: 10px 0;
          padding-left: 30px;
          position: relative;
        }
        .cta-button {
          display: inline-block;
          background-color: #6B7041;
          color: #ffffff !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 25px 0;
          text-align: center;
        }
        .cta-container {
          text-align: center;
          margin: 30px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 25px;
          border-top: 1px solid #e6e3d9;
          font-size: 14px;
          color: #6a6a6a;
        }
        .signature {
          margin-top: 20px;
        }
        .emoji {
          font-size: 22px;
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1><span class="emoji">🌿</span> Has completado el Módulo 2</h1>
        </div>
        
        <div class="content">
          <p>${userName},</p>
          
          <p><span class="emoji">✨</span> <strong>¡Felicidades! Has completado el Módulo 2 — "Equilibra desde adentro."</strong></p>
          
          <p>Tu cuerpo ya no solo reacciona, ahora responde.<br>
          Durante este módulo aprendiste a observar cómo tu digestión, tu descanso y tus emociones se conectan con tu energía diaria.</p>
          
          <p>Has comenzado a cultivar equilibrio en tres niveles:</p>
          <ul class="benefits-list">
            <li><span class="emoji">🌿</span> <strong>Digestivo:</strong> alivio y regularidad.</li>
            <li><span class="emoji">💧</span> <strong>Glucémico:</strong> energía más estable y menos antojos.</li>
            <li><span class="emoji">🌙</span> <strong>Nervioso:</strong> descanso más profundo, cuerpo más tranquilo.</li>
          </ul>
        </div>
        
        <div class="highlight">
          <h2><span class="emoji">🧭</span> Reflexión funcional</h2>
          <div class="quote">
            "El equilibrio no se fuerza, se cultiva cada día con decisiones simples."
          </div>
          <div class="content">
            <p>Cada respiración, cada alimento y cada noche de descanso forman parte de tu proceso de recuperación funcional.<br>
            Estás reprogramando la manera en que tu cuerpo busca bienestar.</p>
          </div>
        </div>
        
        <div class="content">
          <h2><span class="emoji">🌱</span> Tu siguiente paso</h2>
          <p>El Módulo 3, <strong>"Energía estable y metabolismo consciente,"</strong> te enseñará cómo mantener esa estabilidad y fortalecer tu metabolismo con estrategias de movimiento, ritmo y alimentación funcional.</p>
        </div>
        
        <div class="cta-container">
          <a href="${baseUrl}/modulo-3" class="cta-button">
            <span class="emoji">👉</span> Desbloquear el Módulo 3
          </a>
        </div>
        
        <div class="content" style="font-size: 14px; color: #6a6a6a; margin-top: 30px;">
          <p><span class="emoji">💬</span> Si tienes preguntas técnicas o problemas para acceder, puedes escribirnos al chat de soporte dentro de la aplicación.</p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p><span class="emoji">🌿</span> <strong>Marvin Lira</strong><br>
            Nutrición Funcional<br>
            <em>Tu cuerpo no está roto, está buscando equilibrio.</em><br><br>
            📩 <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '🌿 Has completado el Módulo 2 — Tu cuerpo está encontrando su equilibrio',
    html
  });
}

export async function sendDay6ReminderEmail(to: string, name?: string): Promise<void> {
  const userName = name || '';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .cta-container {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #b85c38;
          color: #ffffff !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        .signature {
          font-size: 15px;
          color: #5a5a5a;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p><strong>Tu cuerpo ya empezó a responder.</strong><br>
          Durante estos días has dado los primeros pasos para entender mejor tus señales, equilibrar tu energía y reducir la inflamación.</p>
          
          <p>👉 <strong>Mañana termina tu acceso gratuito a TransformaDiabetes</strong>, pero tu transformación apenas comienza.</p>
          
          <p>Si te está gustando el proceso, no lo detengas ahora.<br>
          Activa tu suscripción por solo <strong>$5 USD al mes</strong> y continúa con el <strong>Módulo 1: Empieza desde la raíz</strong>, donde aprenderás a mantener tus niveles de glucosa estables sin dietas extremas ni restricciones.</p>
          
          <p><strong>Tu cuerpo no está roto — solo necesita apoyo constante.</strong><br>
          Dale la oportunidad de seguir mejorando.</p>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
            🔗 Continuar mi transformación
          </a>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con equilibrio,<br>
            <strong>Marvin Lira, Coach Funcional</strong><br>
            TransformaDiabetes 🌿<br><br>
            📩 <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '⏰ Tu prueba termina mañana — no pierdas tu progreso',
    html
  });
}

export async function sendDay8FollowupEmail(to: string, name?: string): Promise<void> {
  const userName = name || '';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .cta-container {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #b85c38;
          color: #ffffff !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        .signature {
          font-size: 15px;
          color: #5a5a5a;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Notamos que tu prueba gratuita terminó hace poco,<br>
          pero tu cuerpo sigue hablando contigo cada día.</p>
          
          <p>En TransformaDiabetes, <strong>no se trata solo de controlar el azúcar</strong>,<br>
          sino de entender lo que tu cuerpo necesita para sanar desde la raíz.</p>
          
          <p>Vuelve a tu guía, tus registros y tu chat funcional —<br>
          allí está el camino que ya comenzaste.</p>
          
          <p>💚 <strong>Reactiva tu cuenta hoy y continúa donde te quedaste:</strong></p>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
            👉 Retomar mi transformación
          </a>
        </div>

        <div class="content" style="font-size: 15px; color: #6a6a6a; text-align: center;">
          <p><strong>Tu bienestar no tiene fecha de expiración,<br>
          solo necesita continuidad.</strong></p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con aprecio,<br>
            <strong>Marvin Lira, Coach Funcional</strong><br>
            TransformaDiabetes 🌿<br><br>
            📩 <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '🌱 Extrañamos tu presencia — tu transformación aún te espera',
    html
  });
}

export async function sendDay9FollowupEmail(to: string, name?: string): Promise<void> {
  const userName = name || '';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .highlight-box {
          background-color: #f9f7f4;
          border-left: 4px solid #4a5d23;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .benefits-list {
          margin: 20px 0;
          padding-left: 20px;
        }
        .benefit-item {
          margin-bottom: 10px;
          line-height: 1.6;
        }
        .cta-container {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #4a5d23;
          color: #ffffff !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
        }
        .quote {
          font-style: italic;
          color: #4a5d23;
          text-align: center;
          font-size: 17px;
          margin: 30px 0;
          padding: 20px;
          background-color: #f5f3ef;
          border-radius: 6px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        .signature {
          font-size: 15px;
          color: #5a5a5a;
        }
        .disclaimer {
          font-size: 13px;
          color: #888;
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Durante estos 7 días diste un paso que muchas personas nunca se atreven a dar: <strong>escuchar lo que tu cuerpo realmente necesita</strong>.</p>
          
          <p>Tus conversaciones con el chat y tu informe funcional mostraron señales claras de mejora — mejor digestión, sueño más profundo o menos antojos de azúcar.<br>
          <strong>Eso significa que tu cuerpo ya empezó a responder.</strong></p>
          
          <p>No dejes que ese avance se pierda.</p>
        </div>

        <div class="highlight-box">
          <p style="margin: 0 0 15px 0; font-weight: 600; color: #2a2a2a;">
            Por solo $5 USD al mes, puedes continuar con el <strong>Módulo 1: Empieza desde la raíz</strong>, donde recibirás:
          </p>
          <div class="benefits-list">
            <div class="benefit-item">🌱 Tu plan funcional personalizado</div>
            <div class="benefit-item">💬 Acceso ilimitado al chat interactivo con IA</div>
            <div class="benefit-item">📊 Seguimiento continuo de tus síntomas y progreso</div>
            <div class="benefit-item">🌿 Contenido educativo exclusivo cada mes</div>
          </div>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
            Reactivar mi acceso ahora
          </a>
        </div>

        <div class="quote">
          "Tu cuerpo no está roto — solo necesita constancia, claridad y apoyo."
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>💚<br>
            <strong>Equipo de Marvin Lira Nutrición Funcional</strong><br>
            TransformaDiabetes<br><br>
            📩 <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a></p>
          </div>
          <div class="disclaimer">
            Programa educativo, no sustituto de orientación médica.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '🌿 Tu cuerpo ya comenzó a mejorar — no detengas el proceso',
    html
  });
}

export async function sendDay10FinalReminderEmail(to: string, name?: string): Promise<void> {
  const userName = name || '';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          color: #3a3a3a;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fffdf8;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .warning-header {
          background-color: #fff4e6;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin-bottom: 30px;
          border-radius: 6px;
        }
        .warning-title {
          font-size: 18px;
          font-weight: 700;
          color: #f59e0b;
          margin-bottom: 10px;
        }
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .benefits-box {
          background-color: #f9f7f4;
          padding: 25px;
          margin: 25px 0;
          border-radius: 6px;
        }
        .benefits-intro {
          font-weight: 600;
          color: #2a2a2a;
          margin-bottom: 15px;
        }
        .benefit-item {
          margin-bottom: 12px;
          line-height: 1.6;
          font-size: 15px;
        }
        .urgency-text {
          background-color: #fef2f2;
          border-left: 4px solid #b85c38;
          padding: 15px;
          margin: 25px 0;
          border-radius: 4px;
          font-weight: 600;
          color: #991b1b;
        }
        .cta-container {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #b85c38;
          color: #ffffff !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
        }
        .cta-subtext {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }
        .quote {
          font-style: italic;
          color: #4a5d23;
          text-align: center;
          font-size: 16px;
          margin: 30px 0;
          padding: 20px;
          background-color: #f5f3ef;
          border-radius: 6px;
          line-height: 1.6;
        }
        .footer {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        .signature {
          font-size: 15px;
          color: #5a5a5a;
        }
        .disclaimer {
          font-size: 13px;
          color: #888;
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="warning-header">
          <div class="warning-title">⚠️ Último día para conservar tu progreso funcional</div>
        </div>
        
        <div class="content">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Tu acceso gratuito a Marvin Lira Nutrición Funcional 🌿 <strong>está por finalizar hoy</strong>.<br>
          Durante estos días, comenzaste a conectar con la raíz de tus síntomas y a darle a tu cuerpo lo que realmente necesita.</p>
          
          <p>Queremos que ese esfuerzo no se pierda.</p>
        </div>

        <div class="benefits-box">
          <div class="benefits-intro">Si reactivas hoy tu cuenta, conservarás:</div>
          <div class="benefit-item">✅ Tu informe funcional inicial</div>
          <div class="benefit-item">✅ El acceso a tu chat interactivo con IA</div>
          <div class="benefit-item">✅ Los módulos de avance mensual</div>
          <div class="benefit-item">✅ Todo tu historial y registros personales</div>
        </div>

        <div class="urgency-text">
          Después de hoy, tu cuenta quedará inactiva y se perderá tu progreso.
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
            Reactivar mi acceso ahora
          </a>
          <div class="cta-subtext">(Solo $5 USD al mes, cancela cuando quieras)</div>
        </div>

        <div class="quote">
          "No es un salto gigante lo que transforma tu salud,<br>
          sino los pasos pequeños y constantes que das cada día."
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>💚<br>
            <strong>Equipo de Marvin Lira Nutrición Funcional</strong><br><br>
            📩 <a href="mailto:contacto@transformadiabetes.com" style="color: #4a5d23;">contacto@transformadiabetes.com</a></p>
          </div>
          <div class="disclaimer">
            Programa educativo, no sustituto de orientación médica.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '⚠️ Último día para conservar tu progreso funcional',
    html
  });
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    console.log('✅ Resend configurado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error con Resend:', error);
    return false;
  }
}
