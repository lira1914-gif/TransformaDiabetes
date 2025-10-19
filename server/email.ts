import nodemailer from 'nodemailer';

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
          border-left: 4px solid #4a5d23;
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
          background-color: #4a5d23;
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
          <div class="emoji">🌿</div>
          <h1>¡Bienvenido a TransformaDiabetes!</h1>
        </div>
        
        <div class="content">
          <p>Hola ${userName},</p>
          
          <p>Gracias por unirte a TransformaDiabetes. Has dado el primer paso para transformar tu salud desde la raíz.</p>
          
          <div class="highlight">
            <strong>Tu cuerpo no está roto, solo está buscando equilibrio.</strong>
          </div>
          
          <p>En las próximas semanas, aprenderás a:</p>
          <ul>
            <li>🥦 Fortalecer tu digestión y eliminación</li>
            <li>🌙 Regular tu sueño y sistema nervioso</li>
            <li>🍯 Estabilizar tu azúcar y energía</li>
          </ul>
          
          <p>Recuerda: este es un proceso de transformación, no una carrera. Cada pequeño cambio cuenta.</p>
        </div>
        
        <div class="cta">
          <a href="${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}" class="button">Comenzar mi transformación</a>
        </div>
        
        <div class="footer">
          <p>Con consciencia y esperanza,<br>
          <strong>Equipo TransformaDiabetes</strong> 🌿</p>
          <p style="margin-top: 20px; font-size: 12px;">
            Si tienes preguntas, responde a este correo o escríbenos a contacto@transformadiabetes.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: '🌿 Bienvenido a TransformaDiabetes - Tu transformación comienza hoy',
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
          <div class="emoji">📋</div>
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
            <li>🩺 Qué está mostrando tu cuerpo</li>
            <li>🧠 La Trifecta Funcional (Digestión, Sueño, Azúcar)</li>
            <li>🌼 Hábitos funcionales personalizados</li>
            <li>💡 Recomendaciones específicas para tu caso</li>
          </ul>
        </div>
        
        <div class="cta">
          <a href="${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}/onboarding/informe-inicial` : 'http://localhost:5000/onboarding/informe-inicial'}" class="button">Ver mi informe funcional</a>
        </div>
        
        <div class="footer">
          <p>Con consciencia y esperanza,<br>
          <strong>Equipo TransformaDiabetes</strong> 🌿</p>
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
    subject: `📋 Tu Informe Funcional - Módulo ${moduleNumber} está listo`,
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
