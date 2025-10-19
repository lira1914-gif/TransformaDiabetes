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
