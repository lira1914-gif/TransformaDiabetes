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
      from: 'TransformaDiabetes <no-reply@transformadiabetes.online>',
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

    console.log('[EMAIL ENVIADO]', data?.id);
    console.log('[DESTINATARIO]', options.to);
    if (options.bcc) {
      console.log('[BCC]', options.bcc);
    }
  } catch (error) {
    console.error('[ERROR] Error enviando email:', error);
    throw error;
  }
}

function getConsultationFooter(): string {
  const consultationUrl = 'https://my.practicebetter.io/#/67ee0d2ede79d5983d604c7f/bookings?s=67ee0fcade79d5983d609b52&flavor=mobileapp&step=date';
  
  return `
    <div style="background-color: #f0f7f0; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center; border: 2px solid #4a5d23;">
      <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #4a5d23;">
        ¿Tienes dudas sobre tu proceso?
      </p>
      <p style="margin: 0 0 20px 0; font-size: 15px; color: #5a5a5a; line-height: 1.6;">
        Agenda una <strong>consulta inicial gratuita de 15 minutos</strong> conmigo.<br>
        Sin compromiso, sin tarjeta, solo orientación funcional personalizada.
      </p>
      <a href="${consultationUrl}" style="display: inline-block; background-color: #4a5d23; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
        Agendar mi consulta gratuita
      </a>
    </div>
  `;
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
        
        ${getConsultationFooter()}
        
        <div class="footer">
          <div class="signature">
            <p>Con gratitud,<br>
            <strong>Marvin Lira</strong><br>
            Nutrición Funcional & Salud desde la raíz<br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a><br>
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
          <div class="module-title" style="color: #6b8e23;"> Chat con Marvin Lira IA — Disponible ahora</div>
          <div class="module-subtitle">
            Durante tu prueba de 7 días, tienes acceso ilimitado al chat interactivo.
            Úsalo cada día para compartir:
          </div>
          
          <div class="pillar">
            <div class="pillar-number"> Cómo dormiste</div>
            <div class="pillar-desc">
              ¿Cuántas horas? ¿Despertaste en la noche? ¿Cómo te sentiste al levantarte?
            </div>
          </div>
          
          <div class="pillar">
            <div class="pillar-number"> Cómo estuvo tu digestión</div>
            <div class="pillar-desc">
              ¿Inflamación? ¿Estreñimiento? ¿Acidez? Observa sin juzgar.
            </div>
          </div>
          
          <div class="pillar">
            <div class="pillar-number"> Tu nivel de energía y ánimo</div>
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
        
        ${getConsultationFooter()}
        
        <div class="footer">
          <div class="signature">
            <p>Con gratitud,<br>
            <strong>Marvin Lira</strong><br>
            Nutrición Funcional & Salud desde la raíz<br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a><br>
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
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a><br>
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
          <h1>${userName}</h1>
        </div>
        
        <div class="content intro">
          <p>Tu cuenta en TransformaDiabetes vuelve a estar activa.<br>
          Mantendrás tus módulos, informes y todo tu progreso anterior.</p>
        </div>
        
        <div class="highlight">
          <p style="margin: 0; font-size: 16px; line-height: 1.6;">
            Tu cuerpo no se rindió — solo necesitaba una pausa.<br>
            Hoy estás eligiendo continuar desde la raíz.
          </p>
        </div>
        
        <div class="button-container">
          <a href="${baseUrl}/perfil" class="button">Entrar a mi panel</a>
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
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Tu suscripción ha sido reactivada — ¡Nos alegra tenerte de vuelta!',
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
          <h1>Has completado tu primer módulo</h1>
        </div>
        
        <div class="content">
          <p>${userName},</p>
          
          <p><strong>¡Felicidades! Has completado el Módulo 1 — "Empieza desde la raíz."</strong></p>
          
          <p>Este primer paso marca el inicio real de tu transformación funcional.<br>
          Has aprendido a observar las señales de tu cuerpo — digestión, energía, sueño y emociones — sin juzgarte.<br>
          Cada registro que hiciste fue una conversación entre tú y tu biología.</p>
        </div>
        
        <div class="highlight">
          <h2>Reflexión funcional</h2>
          <div class="quote">
            "No se trata de controlar un síntoma, sino de entender la raíz."
          </div>
          <div class="content">
            <p>Tu cuerpo no está roto; está pidiendo equilibrio.<br>
            Y tú ya estás aprendiendo a escuchar lo que realmente necesita.</p>
          </div>
        </div>
        
        <div class="content">
          <h2>Lo que viene ahora</h2>
          <p>El siguiente módulo, <strong>"Equilibra desde adentro,"</strong> te enseñará cómo fortalecer tus sistemas desde la nutrición funcional — con estrategias personalizadas y apoyo natural educativo (sin dosis ni marcas).</p>
        </div>
        
        <div class="cta-container">
          <a href="${baseUrl}/modulo-1" class="cta-button">
            Continuar al Módulo 2
          </a>
        </div>
        
        <div class="content" style="font-size: 14px; color: #6a6a6a; margin-top: 30px;">
          <p>Si algo no funciona o tienes preguntas sobre tu acceso, puedes escribirnos desde el chat de soporte técnico dentro de la aplicación.</p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p><strong>Marvin Lira</strong><br>
            Nutrición Funcional<br>
            <em>Tu cuerpo no está roto, solo está buscando equilibrio.</em><br><br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Has completado tu primer módulo — Tu cuerpo ya está respondiendo',
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
          <h1>Has completado el Módulo 2</h1>
        </div>
        
        <div class="content">
          <p>${userName},</p>
          
          <p><strong>¡Felicidades! Has completado el Módulo 2 — "Equilibra desde adentro."</strong></p>
          
          <p>Tu cuerpo ya no solo reacciona, ahora responde.<br>
          Durante este módulo aprendiste a observar cómo tu digestión, tu descanso y tus emociones se conectan con tu energía diaria.</p>
          
          <p>Has comenzado a cultivar equilibrio en tres niveles:</p>
          <ul class="benefits-list">
            <li><strong>Digestivo:</strong> alivio y regularidad.</li>
            <li><strong>Glucémico:</strong> energía más estable y menos antojos.</li>
            <li><strong>Nervioso:</strong> descanso más profundo, cuerpo más tranquilo.</li>
          </ul>
        </div>
        
        <div class="highlight">
          <h2>Reflexión funcional</h2>
          <div class="quote">
            "El equilibrio no se fuerza, se cultiva cada día con decisiones simples."
          </div>
          <div class="content">
            <p>Cada respiración, cada alimento y cada noche de descanso forman parte de tu proceso de recuperación funcional.<br>
            Estás reprogramando la manera en que tu cuerpo busca bienestar.</p>
          </div>
        </div>
        
        <div class="content">
          <h2>Tu siguiente paso</h2>
          <p>El Módulo 3, <strong>"Energía estable y metabolismo consciente,"</strong> te enseñará cómo mantener esa estabilidad y fortalecer tu metabolismo con estrategias de movimiento, ritmo y alimentación funcional.</p>
        </div>
        
        <div class="cta-container">
          <a href="${baseUrl}/modulo-3" class="cta-button">
            Desbloquear el Módulo 3
          </a>
        </div>
        
        <div class="content" style="font-size: 14px; color: #6a6a6a; margin-top: 30px;">
          <p>Si tienes preguntas técnicas o problemas para acceder, puedes escribirnos al chat de soporte dentro de la aplicación.</p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p><strong>Marvin Lira</strong><br>
            Nutrición Funcional<br>
            <em>Tu cuerpo no está roto, está buscando equilibrio.</em><br><br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Has completado el Módulo 2 — Tu cuerpo está encontrando su equilibrio',
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
          
          <p><strong>Mañana termina tu acceso gratuito a TransformaDiabetes</strong>, pero tu transformación apenas comienza.</p>
          
          <p>Si te está gustando el proceso, no lo detengas ahora.<br>
          Activa tu suscripción por solo <strong>$5 USD al mes</strong> (menos que un café al día) y continúa con el <strong>Módulo 1: Empieza desde la raíz</strong>, donde aprenderás a mantener tus niveles de glucosa estables sin dietas extremas ni restricciones.</p>
          
          <p><strong>Beneficios inmediatos al suscribirte:</strong></p>
          <ul style="margin: 15px 0; padding-left: 20px; line-height: 1.8;">
            <li>Chat ilimitado con orientación funcional personalizada</li>
            <li>Acceso completo al Módulo 1 y módulos progresivos</li>
            <li>Tus registros y progreso guardados para siempre</li>
            <li>Cancela cuando quieras, sin compromiso</li>
          </ul>
          
          <p><strong>Tu cuerpo no está roto — solo necesita apoyo constante.</strong><br>
          Dale la oportunidad de seguir mejorando.</p>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
            Continuar mi transformación por $5/mes
          </a>
          <p style="margin-top: 15px; font-size: 14px; color: #888;">
            Cancela cuando quieras, sin preguntas
          </p>
        </div>
        
        ${getConsultationFooter()}
        
        <div class="footer">
          <div class="signature">
            <p>Con equilibrio,<br>
            <strong>Marvin Lira, Coach Funcional</strong><br>
            TransformaDiabetes<br><br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Tu prueba termina mañana — no pierdas tu progreso',
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
          
          <p>Por solo <strong>$5 USD al mes</strong> (el precio de un café), puedes:</p>
          <ul style="margin: 15px 0; padding-left: 20px; line-height: 1.8;">
            <li>Retomar tu chat funcional ilimitado con Marvin IA</li>
            <li>Acceder a tus registros y progreso guardados</li>
            <li>Continuar con módulos progresivos personalizados</li>
            <li>Cancelar cuando quieras, sin compromiso</li>
          </ul>
          
          <p><strong>Reactiva tu cuenta hoy y continúa donde te quedaste:</strong></p>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
            Retomar mi transformación por $5/mes
          </a>
          <p style="margin-top: 15px; font-size: 14px; color: #888;">
            Sin permanencia, cancela en cualquier momento
          </p>
        </div>

        <div class="content" style="font-size: 15px; color: #6a6a6a; text-align: center;">
          <p><strong>Tu bienestar no tiene fecha de expiración,<br>
          solo necesita continuidad.</strong></p>
        </div>
        
        ${getConsultationFooter()}
        
        <div class="footer">
          <div class="signature">
            <p>Con aprecio,<br>
            <strong>Marvin Lira, Coach Funcional</strong><br>
            TransformaDiabetes<br><br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Extrañamos tu presencia — tu transformación aún te espera',
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
            <div class="benefit-item">Tu plan funcional personalizado</div>
            <div class="benefit-item">Acceso ilimitado al chat interactivo con IA</div>
            <div class="benefit-item">Seguimiento continuo de tus síntomas y progreso</div>
            <div class="benefit-item">Contenido educativo exclusivo cada mes</div>
          </div>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
            Reactivar mi acceso ahora
          </a>
        </div>

        <div class="cta-container">
          <p style="margin-top: 15px; font-size: 14px; color: #888;">
            Cancela cuando quieras, sin permanencia
          </p>
        </div>

        <div class="quote">
          "Tu cuerpo no está roto — solo necesita constancia, claridad y apoyo."
        </div>
        
        ${getConsultationFooter()}
        
        <div class="footer">
          <div class="signature">
            <p><strong>Equipo de Marvin Lira Nutrición Funcional</strong><br>
            TransformaDiabetes<br><br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
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
    subject: 'Tu cuerpo ya comenzó a mejorar — no detengas el proceso',
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
          <div class="warning-title">Último día para conservar tu progreso funcional</div>
        </div>
        
        <div class="content">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Tu acceso gratuito a Marvin Lira Nutrición Funcional <strong>está por finalizar hoy</strong>.<br>
          Durante estos días, comenzaste a conectar con la raíz de tus síntomas y a darle a tu cuerpo lo que realmente necesita.</p>
          
          <p>Queremos que ese esfuerzo no se pierda.</p>
        </div>

        <div class="benefits-box">
          <div class="benefits-intro">Si reactivas hoy tu cuenta, conservarás:</div>
          <div class="benefit-item">Tu informe funcional inicial</div>
          <div class="benefit-item">El acceso a tu chat interactivo con IA</div>
          <div class="benefit-item">Los módulos de avance mensual</div>
          <div class="benefit-item">Todo tu historial y registros personales</div>
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
        
        ${getConsultationFooter()}
        
        <div class="footer">
          <div class="signature">
            <p><strong>Equipo de Marvin Lira Nutrición Funcional</strong><br><br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
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
    subject: 'Último día para conservar tu progreso funcional',
    html
  });
}

export async function sendDay2EngagementEmail(to: string, name?: string): Promise<void> {
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
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .suggestion-box {
          background-color: #f5f3ef;
          border-left: 4px solid #4a5d23;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .suggestion-item {
          margin: 12px 0;
          padding-left: 10px;
          color: #2a2a2a;
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
          
          <p>¿Ya tuviste oportunidad de conversar con Marvin Lira IA? </p>
          
          <p>Recuerda que durante tu prueba gratuita de 7 días tienes <strong>acceso ilimitado al chat</strong> para hacer cualquier pregunta sobre tu salud funcional, síntomas, o dudas sobre nutrición.</p>
          
          <p><strong>No estás solo en este proceso</strong> — el chat está aquí para guiarte paso a paso.</p>
        </div>

        <div class="suggestion-box">
          <div style="font-weight: 600; color: #4a5d23; margin-bottom: 15px;"> Ideas de preguntas que puedes hacer hoy:</div>
          <div class="suggestion-item">• "¿Por qué tengo antojos de dulce por las tardes?"</div>
          <div class="suggestion-item">• "¿Qué puedo desayunar para estabilizar mi energía?"</div>
          <div class="suggestion-item">• "¿Cómo sé si tengo resistencia a la insulina?"</div>
          <div class="suggestion-item">• "Quiero mejorar mi sueño, ¿qué me recomiendas?"</div>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/chat-semanal" class="cta-button">
             Ir al chat ahora
          </a>
        </div>
        
        <div class="content">
          <p style="color: #6a6a6a; font-size: 15px; font-style: italic;">
            Cada pregunta que hagas te acerca un paso más a comprender tu cuerpo y recuperar tu salud.
          </p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con equilibrio,<br>
            <strong>Equipo TransformaDiabetes</strong> <br><br>
             <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: ' ¿Ya usaste tu chat hoy? — Tienes 6 días restantes',
    html
  });
}

export async function sendDay3StoryEmail(to: string, name?: string): Promise<void> {
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
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .story-box {
          background-color: #f9f8f5;
          padding: 25px;
          margin: 25px 0;
          border-radius: 8px;
          border: 1px solid #e8e6df;
        }
        .quote {
          font-style: italic;
          color: #4a5d23;
          font-size: 17px;
          margin: 20px 0;
          padding-left: 20px;
          border-left: 3px solid #4a5d23;
        }
        .stats {
          background-color: #f5f3ef;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .stat-item {
          margin: 8px 0;
          color: #2a2a2a;
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
          
          <p>Hoy quiero compartir contigo la historia de <strong>María</strong>, quien hace 4 meses estaba exactamente donde tú estás ahora.</p>
        </div>

        <div class="story-box">
          <p style="font-weight: 600; color: #4a5d23; margin-bottom: 15px;"> La historia de María (53 años, Diabetes Tipo 2)</p>
          
          <div class="quote">
            "Tenía A1C en 8.2, tomaba 3 medicamentos, y me sentía cansada todo el tiempo. Mi doctor me decía que 'así es la diabetes' y que tendría que vivir con eso."
          </div>
          
          <p>María decidió darle una oportunidad al enfoque funcional. Empezó identificando sus patrones:</p>
          
          <div class="stats">
            <div class="stat-item"><strong> Descubrió</strong> que sus picos de glucosa venían de comer pan en el desayuno</div>
            <div class="stat-item"><strong> Aprendió</strong> a combinar proteínas con carbohidratos</div>
            <div class="stat-item"><strong> Mejoró</strong> su ritmo circadiano (dormía 5h, ahora 7h)</div>
            <div class="stat-item"><strong> Integró</strong> caminatas de 15 min después de comer</div>
          </div>
          
          <p style="font-weight: 600; color: #2a2a2a; margin-top: 20px;">Sus resultados después de 3 meses:</p>
          <div class="stats" style="background-color: #e8f5e9;">
            <div class="stat-item"> A1C: 8.2 → <strong>6.1</strong></div>
            <div class="stat-item"> Energía: "Me levanto sin alarma y con ganas"</div>
            <div class="stat-item"> Medicamentos: Redujo de 3 a 1 (con supervisión médica)</div>
            <div class="stat-item"> Estado de ánimo: "Volví a sentirme yo misma"</div>
          </div>
          
          <div class="quote">
            "No fue magia — fue entender qué necesitaba mi cuerpo y darle las herramientas correctas. TransformaDiabetes me enseñó que mi cuerpo SÍ puede sanar."
          </div>
        </div>

        <div class="content">
          <p><strong>Tu historia puede ser similar.</strong></p>
          
          <p>María empezó exactamente como tú: con dudas, con miedo, pero con la esperanza de que había algo mejor.</p>
          
          <p>La diferencia fue <strong>dar el siguiente paso</strong>.</p>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/chat-semanal" class="cta-button">
             Habla con Marvin Lira IA hoy
          </a>
        </div>
        
        <div class="content">
          <p style="color: #6a6a6a; font-size: 15px;">
            Tienes <strong>5 días restantes</strong> de acceso gratuito — úsalos para descubrir qué necesita tu cuerpo.
          </p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con equilibrio,<br>
            <strong>Equipo TransformaDiabetes</strong> <br><br>
             <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: ' Cómo María redujo su A1C de 8.2 a 6.1 — Su historia',
    html
  });
}

export async function sendDay4ProgressEmail(to: string, name?: string): Promise<void> {
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
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .progress-box {
          background-color: #f5f3ef;
          padding: 25px;
          margin: 25px 0;
          border-radius: 8px;
        }
        .progress-item {
          margin: 15px 0;
          padding-left: 15px;
        }
        .highlight {
          background-color: #e8f5e9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #4a5d23;
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
          
          <p>Ya llevas <strong>4 días en TransformaDiabetes</strong>. </p>
          
          <p>Quiero que te tomes un momento para reflexionar sobre lo que ya has logrado:</p>
        </div>

        <div class="progress-box">
          <div style="font-weight: 600; color: #4a5d23; margin-bottom: 15px;"> Lo que has logrado hasta ahora:</div>
          <div class="progress-item"> Completaste tu evaluación funcional completa</div>
          <div class="progress-item"> Recibiste tu informe personalizado con recomendaciones</div>
          <div class="progress-item"> Tienes acceso ilimitado al chat con Marvin Lira IA</div>
          <div class="progress-item"> Empezaste a entender las señales de tu cuerpo</div>
        </div>

        <div class="content">
          <p><strong>Eso es mucho más de lo que la mayoría de las personas logran.</strong></p>
          
          <p>La transformación de tu salud no sucede en un día — sucede en los pequeños pasos consistentes que tomas cada día.</p>
        </div>

        <div class="highlight">
          <p style="margin-bottom: 15px;"><strong> Reflexiona un momento:</strong></p>
          <p>¿Qué has aprendido sobre tu cuerpo en estos 4 días?<br>
          ¿Hay algo que te haya sorprendido?<br>
          ¿Qué cambio pequeño podrías implementar hoy?</p>
        </div>

        <div class="content">
          <p>Recuerda que tienes <strong>3 días más de acceso gratuito</strong> al chat y a todo el sistema.</p>
          
          <p>Después de eso, si decides continuar, será solo <strong>$5 USD al mes</strong> para seguir con:</p>
          <p style="padding-left: 20px;">
             Módulos educativos mensuales<br>
             Chat ilimitado con IA funcional<br>
             Seguimiento personalizado de tu progreso<br>
             Acceso a todas las herramientas
          </p>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/chat-semanal" class="cta-button">
             Continuar mi transformación
          </a>
        </div>
        
        <div class="content">
          <p style="color: #6a6a6a; font-size: 15px; font-style: italic;">
            "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora."
          </p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con equilibrio,<br>
            <strong>Marvin Lira, Coach Funcional</strong><br>
            TransformaDiabetes <br><br>
             <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: ' Tu progreso en 4 días — Ya estás transformando tu salud',
    html
  });
}

export async function sendDay5UrgencyEmail(to: string, name?: string): Promise<void> {
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
        .content {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .urgency-box {
          background-color: #fff3e0;
          padding: 25px;
          margin: 25px 0;
          border-radius: 8px;
          border-left: 4px solid #b85c38;
        }
        .benefits-box {
          background-color: #f5f3ef;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .benefit-item {
          margin: 10px 0;
          padding-left: 10px;
        }
        .cta-container {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #b85c38;
          color: #ffffff !important;
          padding: 18px 36px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 17px;
        }
        .cta-subtext {
          margin-top: 12px;
          font-size: 14px;
          color: #6a6a6a;
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
          
          <p><strong>Solo quedan 2 días de tu acceso gratuito.</strong></p>
          
          <p>En estos 5 días has dado pasos importantes hacia comprender tu cuerpo y recuperar tu salud. Has recibido tu informe funcional, tienes acceso al chat ilimitado, y estás aprendiendo sobre nutrición funcional.</p>
        </div>

        <div class="urgency-box">
          <p style="font-weight: 600; color: #b85c38; margin-bottom: 15px;"> ¿Qué pasa después del día 7?</p>
          <p>Si no activas tu suscripción, <strong>perderás acceso a:</strong></p>
          <div style="margin-top: 15px;">
             Chat ilimitado con Marvin Lira IA<br>
             Módulos educativos progresivos<br>
             Seguimiento personalizado de tu salud<br>
             Todo tu historial y progreso
          </div>
        </div>

        <div class="content">
          <p><strong>No dejes que tu progreso se detenga ahora.</strong></p>
          
          <p>Por solo <strong>$5 USD al mes</strong> (menos que un café por semana), puedes continuar tu transformación y recibir:</p>
        </div>

        <div class="benefits-box">
          <div class="benefit-item"> <strong>Chat ilimitado</strong> con orientación funcional personalizada</div>
          <div class="benefit-item"> <strong>Módulos educativos</strong> que se desbloquean cada mes</div>
          <div class="benefit-item"> <strong>Seguimiento continuo</strong> de tu progreso</div>
          <div class="benefit-item"> <strong>Actualizaciones constantes</strong> del sistema</div>
          <div class="benefit-item"> <strong>Soporte dedicado</strong> cuando lo necesites</div>
        </div>

        <div class="content">
          <p style="font-weight: 600; color: #2a2a2a;">La pregunta es simple:</p>
          <p>¿Vale la pena invertir $5 al mes en tu salud, energía y bienestar?</p>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
             Asegurar mi acceso por $5/mes
          </a>
          <div class="cta-subtext">Cancela cuando quieras, sin compromisos</div>
        </div>
        
        <div class="content">
          <p style="color: #6a6a6a; font-size: 15px; font-style: italic;">
            Tu cuerpo no está roto — solo necesita las herramientas correctas.<br>
            Dale la oportunidad de seguir sanando.
          </p>
        </div>
        
        <div class="footer">
          <div class="signature">
            <p>Con equilibrio,<br>
            <strong>Marvin Lira, Coach Funcional</strong><br>
            TransformaDiabetes <br><br>
             <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Solo quedan 2 días — No pierdas tu progreso',
    html
  });
}

export async function sendWeeklyPostTrialEmail(to: string, name?: string): Promise<void> {
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
          font-size: 28px;
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
          line-height: 1.7;
        }
        .intro-box {
          background-color: #f5f3ef;
          border-left: 4px solid #4a5d23;
          padding: 20px;
          margin: 25px 0;
          border-radius: 6px;
        }
        .benefits-grid {
          display: grid;
          gap: 20px;
          margin: 30px 0;
        }
        .benefit-card {
          background-color: #f9f7f4;
          padding: 20px;
          border-radius: 8px;
          border-left: 3px solid #4a5d23;
        }
        .benefit-title {
          font-weight: 700;
          color: #4a5d23;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .benefit-description {
          font-size: 15px;
          color: #5a5a5a;
          line-height: 1.6;
        }
        .testimonial-box {
          background: linear-gradient(135deg, #f5f3ef 0%, #fffdf8 100%);
          padding: 25px;
          margin: 30px 0;
          border-radius: 8px;
          border: 1px solid #e0ddd8;
        }
        .testimonial-text {
          font-style: italic;
          color: #2a2a2a;
          margin-bottom: 15px;
          font-size: 15px;
          line-height: 1.7;
        }
        .testimonial-author {
          font-weight: 600;
          color: #4a5d23;
          font-size: 14px;
        }
        .stats-box {
          background-color: #e8f5e9;
          padding: 25px;
          margin: 30px 0;
          border-radius: 8px;
          text-align: center;
        }
        .stat-item {
          margin-bottom: 15px;
        }
        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #4a5d23;
          display: block;
        }
        .stat-label {
          font-size: 14px;
          color: #5a5a5a;
        }
        .cta-container {
          text-align: center;
          margin: 40px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #4a5d23;
          color: #ffffff !important;
          padding: 18px 36px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 17px;
          box-shadow: 0 4px 12px rgba(74, 93, 35, 0.3);
        }
        .cta-subtext {
          font-size: 14px;
          color: #666;
          margin-top: 12px;
        }
        .price-highlight {
          background-color: #fff4e6;
          border: 2px dashed #f59e0b;
          padding: 20px;
          margin: 25px 0;
          border-radius: 8px;
          text-align: center;
        }
        .price-amount {
          font-size: 36px;
          font-weight: 700;
          color: #f59e0b;
        }
        .price-period {
          font-size: 16px;
          color: #666;
        }
        .quote {
          font-style: italic;
          color: #4a5d23;
          text-align: center;
          font-size: 17px;
          margin: 35px 0;
          padding: 25px;
          background-color: #f5f3ef;
          border-radius: 8px;
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
        <div class="header">
          <h1>¿Recuerdas por qué comenzaste?</h1>
        </div>
        
        <div class="content">
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Hace unos días completaste tu informe funcional inicial con nosotros. En ese momento, tu cuerpo te estaba dando señales claras de que algo necesitaba cambiar.</p>
          
          <p><strong>Esas señales no desaparecieron solas.</strong></p>
        </div>

        <div class="intro-box">
          <p style="margin: 0; font-size: 16px; line-height: 1.7;">
            La diferencia entre quienes revierten su resistencia a la insulina y quienes siguen atrapados en el ciclo no es el conocimiento inicial. <strong>Es la constancia y el acompañamiento correcto.</strong>
          </p>
        </div>

        <h2>Lo que estás perdiendo cada semana sin suscripción:</h2>

        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-title">Chat ilimitado con Marvin Lira IA</div>
            <div class="benefit-description">Consulta síntomas, dudas sobre alimentos, interpretación de análisis de sangre y ajustes personalizados las 24/7. Como tener un nutricionista funcional en tu bolsillo.</div>
          </div>

          <div class="benefit-card">
            <div class="benefit-title">Interpretación de tus análisis clínicos</div>
            <div class="benefit-description">Sube tus estudios de glucosa, A1C, perfil lipídico o tiroides y recibe una interpretación funcional personalizada que tu médico tradicional no te dará.</div>
          </div>

          <div class="benefit-card">
            <div class="benefit-title">Recetas funcionales personalizadas</div>
            <div class="benefit-description">Más de 50 recetas adaptadas a tu perfil metabólico: desayunos antiinflamatorios, snacks que estabilizan glucosa, cenas que mejoran tu sueño.</div>
          </div>

          <div class="benefit-card">
            <div class="benefit-title">Módulos educativos mensuales</div>
            <div class="benefit-description">Aprende paso a paso sobre resistencia a la insulina, salud intestinal, manejo de estrés y optimización hormonal. Educación que transforma, no solo informa.</div>
          </div>

          <div class="benefit-card">
            <div class="benefit-title">Tracking personalizado de progreso</div>
            <div class="benefit-description">Registra síntomas, patrones de sueño, niveles de energía y antojos. El sistema detecta mejoras que tú no ves y te mantiene motivado.</div>
          </div>

          <div class="benefit-card">
            <div class="benefit-title">Actualizaciones de tu informe funcional</div>
            <div class="benefit-description">Cada mes, un nuevo informe adaptado a tu progreso con recomendaciones ajustadas a tu nueva realidad metabólica.</div>
          </div>
        </div>

        <div class="testimonial-box">
          <div class="testimonial-text">
            "Llevaba 3 años tomando metformina y mi A1C seguía en 7.8%. En 4 meses con TransformaDiabetes bajé a 5.6% y mi doctor redujo mi medicamento. Lo mejor: aprendí a leer mi cuerpo y ya no tengo antojos incontrolables."
          </div>
          <div class="testimonial-author">— María G., 52 años, Ciudad de México</div>
        </div>

        <div class="stats-box">
          <div class="stat-item">
            <span class="stat-number">78%</span>
            <span class="stat-label">de usuarios reducen su A1C en 3 meses</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">92%</span>
            <span class="stat-label">reportan más energía en las primeras 2 semanas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">$5</span>
            <span class="stat-label">USD/mes — menos que un café diario</span>
          </div>
        </div>

        <h2>¿Por qué funciona TransformaDiabetes?</h2>

        <div class="content">
          <p><strong>No es una dieta más.</strong> Es educación funcional basada en ciencia que te enseña a:</p>
          
          <ul style="line-height: 1.8; margin: 20px 0;">
            <li>Identificar qué alimentos específicos están saboteando tu glucosa</li>
            <li>Interpretar las señales de tu cuerpo antes de que se conviertan en síntomas graves</li>
            <li>Crear hábitos sostenibles que revierten la resistencia a la insulina de raíz</li>
            <li>Reducir (o eliminar) medicamentos bajo supervisión médica</li>
            <li>Recuperar tu energía, claridad mental y calidad de vida</li>
          </ul>

          <p>Y lo mejor: <strong>todo esto con acompañamiento diario por solo $5 USD al mes.</strong></p>
        </div>

        <div class="price-highlight">
          <div class="price-amount">$5 USD</div>
          <div class="price-period">por mes • Cancela cuando quieras</div>
        </div>

        <div class="cta-container">
          <a href="${baseUrl}/onboarding/checkout" class="cta-button">
            Activar mi suscripción ahora
          </a>
          <div class="cta-subtext">Comienza hoy, transforma tu salud en 90 días</div>
        </div>

        <div class="quote">
          "Tu cuerpo no está roto, está pidiendo ayuda.<br>
          Dale las herramientas correctas y él hará el resto."
        </div>

        ${getConsultationFooter()}
        
        <div class="footer">
          <div class="signature">
            <p><strong>Equipo de Marvin Lira Nutrición Funcional</strong><br>
            TransformaDiabetes<br><br>
            <a href="mailto:contacto@transformadiabetes.online" style="color: #4a5d23;">contacto@transformadiabetes.online</a></p>
          </div>
          <div class="disclaimer">
            Programa educativo, no sustituto de orientación médica. Resultados individuales pueden variar.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '¿Recuerdas por qué comenzaste? Tu salud te está esperando',
    html
  });
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    console.log('[RESEND OK] Resend configurado correctamente');
    return true;
  } catch (error) {
    console.error('[RESEND ERROR] Error con Resend:', error);
    return false;
  }
}
