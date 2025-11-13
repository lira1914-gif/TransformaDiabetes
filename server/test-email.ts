import { verifyEmailConnection, sendEmail } from './email';

async function testEmail() {
  console.log(' Probando configuración SMTP...\n');
  
  const isConnected = await verifyEmailConnection();
  
  if (!isConnected) {
    console.error(' No se pudo verificar la conexión SMTP');
    process.exit(1);
  }
  
  console.log('\n Enviando correo de prueba...\n');
  
  try {
    await sendEmail({
      to: 'contacto@transformadiabetes.online',
      subject: 'Prueba de configuración SMTP - TransformaDiabetes',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fffdf8;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
            <h1 style="color: #4a5d23; font-family: Georgia, serif;"> Configuración exitosa</h1>
            <p>El servidor SMTP de TransformaDiabetes está funcionando correctamente.</p>
            <p><strong>Servidor:</strong> mail.privateemail.com<br>
            <strong>Puerto:</strong> 465 (SSL/TLS)<br>
            <strong>Remitente:</strong> contacto@transformadiabetes.online</p>
            <p style="margin-top: 30px; color: #757575; font-size: 14px;">
              Este es un correo de prueba enviado desde el sistema de correos automáticos.
            </p>
          </div>
        </div>
      `
    });
    
    console.log('\n Correo de prueba enviado exitosamente');
    console.log(' Revisa la bandeja de entrada de contacto@transformadiabetes.online');
  } catch (error) {
    console.error('\n Error enviando correo de prueba:', error);
    process.exit(1);
  }
}

testEmail();
