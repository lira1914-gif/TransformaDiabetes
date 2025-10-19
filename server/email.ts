import nodemailer from 'nodemailer';

if (!process.env.SMTP_PASSWORD) {
  throw new Error('SMTP_PASSWORD environment variable is not configured. Email functionality will not work.');
}

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'contacto@transformadiabetes.com',
    pass: process.env.SMTP_PASSWORD
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: '"TransformaDiabetes" <contacto@transformadiabetes.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '')
    });

    console.log('✅ Email enviado:', info.messageId);
    console.log('📧 Destinatario:', options.to);
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
            <div class="step-number">2. Registra tus 5 días</div>
            <div class="step-desc">
              Anota lo que comes, cómo duermes y cómo te sientes cada día.<br>
              Este paso es clave para que la IA pueda generar tu primer informe funcional personalizado.
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3. Recibirás tu guía funcional</div>
            <div class="step-title">Módulo 1: Empieza desde la raíz</div>
            <div class="step-desc">
              Tu informe se entregará directamente en esta bandeja.<br>
              Incluye observaciones, hábitos y tu plan educativo inicial.
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
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
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
        }
        .emoji {
          font-size: 36px;
          margin-bottom: 20px;
        }
        .content {
          font-size: 16px;
          margin-bottom: 25px;
        }
        .highlight {
          background-color: #f5f3ef;
          border-left: 4px solid #b85c38;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .cta {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #b85c38;
          color: #ffffff;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-size: 14px;
          color: #757575;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Tu Informe Funcional está listo</h1>
        </div>
        
        <div class="content">
          <p>Hola ${userName},</p>
          
          <p>Hemos analizado tu cuestionario de salud y tu registro de 5 días. Tu <strong>Guía Funcional Personalizada - Módulo ${moduleNumber}</strong> ya está disponible.</p>
          
          <div class="highlight">
            <strong>Este informe revela qué está mostrando tu cuerpo y cómo puedes apoyarlo desde la raíz.</strong>
          </div>
          
          <p>En tu guía encontrarás:</p>
          <ul>
            <li><strong>Análisis:</strong> Qué está mostrando tu cuerpo</li>
            <li><strong>Trifecta Funcional:</strong> Digestión, Sueño, Azúcar</li>
            <li><strong>Hábitos:</strong> Acciones funcionales personalizadas</li>
            <li><strong>Recomendaciones:</strong> Orientación específica para tu caso</li>
          </ul>
        </div>
        
        <div class="cta">
          <a href="${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}/onboarding/informe-inicial` : 'http://localhost:5000/onboarding/informe-inicial'}" class="button">Ver mi informe funcional</a>
        </div>
        
        <div class="footer">
          <p>Con consciencia y esperanza,<br>
          <strong>Equipo TransformaDiabetes</strong></p>
          <p style="margin-top: 20px; font-size: 12px;">
            Si tienes preguntas sobre tu informe, escríbenos a contacto@transformadiabetes.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: `Tu Informe Funcional - Módulo ${moduleNumber} está listo`,
    html
  });
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error verificando conexión SMTP:', error);
    return false;
  }
}
