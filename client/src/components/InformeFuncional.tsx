import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TrialStatus } from "@/types/trial";

interface InformeFuncionalProps {
  readOnly?: boolean;
}

export default function InformeFuncional({ readOnly = false }: InformeFuncionalProps) {
  const [visible, setVisible] = useState(false);
  const [, navigate] = useLocation();
  
  // Verificar si el usuario ya está suscrito
  const isSubscribed = localStorage.getItem('tm_subscribed_at') !== null;
  
  // Obtener estado del trial para controlar visibilidad del Chat Semanal
  const userId = localStorage.getItem('tm_user_id');

  // Protección: redirigir si no hay userId
  useEffect(() => {
    if (!userId) {
      navigate('/onboarding/bienvenida-trial');
    }
  }, [userId, navigate]);

  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });
  
  // Chat Semanal solo visible después de completar el informe inicial
  const informeCompletado = localStorage.getItem('tm_informe_ready') === 'true';

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    // Durante el trial, simplemente abrir el chat
    navigate('/chat-semanal');
  };

  const handleFinalize = () => {
    // Solo después de suscribirse: Marcar que el usuario completó el informe y está listo para cerrar el Módulo 1
    localStorage.setItem('tm_module1_completed', 'true');
    
    // Enviar correo de cierre del módulo 1 en segundo plano (fire-and-forget)
    const userId = localStorage.getItem('tm_user_id');
    if (userId) {
      apiRequest('POST', '/api/notify-module1-completed', { userId })
        .then(() => console.log('✅ Email de cierre de Módulo 1 enviado'))
        .catch(error => console.error('Error enviando email de cierre:', error));
    }
    
    // Redirigir inmediatamente sin esperar el email
    navigate('/modulo-1');
  };

  return (
    <section
      id="informe-inicial"
      className={`informe-funcional ${visible ? "fade-in" : ""}`}
      data-testid="informe-inicial"
    >
      <h2>🌿 Tu Guía Funcional Personalizada — Inicio</h2>
      <p className="subtitulo">
        "Tu cuerpo no está roto, solo se está protegiendo. Aprende a escuchar su
        mensaje con calma y curiosidad."
      </p>

      <div className="bloque-texto">
        <h3>Resumen de tu perfil inicial</h3>
        <p>
          Basado en tu historial de salud, alimentación y estilo de vida, tu cuerpo está
          mostrando señales importantes. Durante los próximos 7 días, podrás usar el chat para
          compartir cómo te sientes cada día (sueño, digestión, energía, ánimo) y recibirás
          recomendaciones personalizadas en tiempo real. 🧠💪
        </p>
      </div>

      <ul className="lista-funcional">
        <li>⚖️ <strong>Equilibra tus comidas:</strong> combina grasa, fibra y proteína en cada plato. Esto ayuda a estabilizar tu glucosa y energía.</li>
        <li>🔥 <strong>Reduce la carga inflamatoria:</strong> evita ultraprocesados, aceites refinados y azúcares añadidos.</li>
        <li>💤 <strong>Repara con descanso:</strong> duerme 7–8 h, evita pantallas antes de dormir y realiza respiraciones profundas cada noche.</li>
        <li>🫀 <strong>Apoya tu hígado y linfa:</strong> masaje suave con aceite de ricino (si la piel está sana), infusión de diente de león o cepillado seco antes de la ducha.</li>
        <li>🌸 <strong>Calma tu sistema nervioso:</strong> 4–8 respiraciones pausadas antes de comer o cuando sientas ansiedad.</li>
      </ul>

      <div className="bloque-extra">
        <h4>Tu enfoque para los próximos días</h4>
        <p>
          Observa cómo responde tu cuerpo con estos ajustes. No busques perfección,
          busca señales: energía más estable, digestión más ligera, sueño más
          profundo.
        </p>
      </div>

      <blockquote className="frase-funcional">
        "Sanar no es controlar — es comprender el mensaje de tu cuerpo."
      </blockquote>

      <div className="nota-final">
        <p>
          *Este contenido es educativo y no reemplaza la atención médica profesional.
          Ahora puedes usar el chat durante 7 días para compartir cómo te sientes y
          recibir recomendaciones personalizadas basadas en tus síntomas diarios.* 🤖
        </p>
      </div>

      {/* CTA de Suscripción para usuarios en trial */}
      {!readOnly && !isSubscribed && trialStatus && trialStatus.subscriptionStatus !== 'active' && (
        <div style={{ 
          marginTop: '2.5rem',
          padding: '2rem',
          backgroundColor: 'rgba(161, 92, 56, 0.08)',
          borderRadius: '16px',
          border: '2px solid rgba(161, 92, 56, 0.25)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            color: '#A15C38', 
            fontSize: '1.4rem', 
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            ✨ Continúa tu transformación funcional
          </h3>
          <p style={{ 
            color: '#3A3A3A', 
            fontSize: '1rem',
            marginBottom: '0.75rem',
            lineHeight: 1.6
          }}>
            Este informe es solo el inicio. Con tu suscripción de <strong>$5 USD/mes</strong> desbloqueas:
          </p>
          <ul style={{ 
            listStyle: 'none',
            padding: 0,
            margin: '1.25rem 0',
            color: '#3A3A3A',
            fontSize: '0.95rem',
            lineHeight: 1.8
          }}>
            <li>🌿 <strong>Chat semanal ilimitado</strong> con Marvin Lira IA</li>
            <li>📚 <strong>Módulos educativos progresivos</strong> (se desbloquean cada semana)</li>
            <li>📊 <strong>Seguimiento personalizado</strong> de tu progreso funcional</li>
            <li>💬 <strong>Guías de acción específicas</strong> basadas en tus síntomas</li>
          </ul>
          <button
            className="btn-finalizar"
            data-testid="button-subscribe-from-informe"
            onClick={() => navigate('/onboarding/checkout')}
            style={{
              backgroundColor: '#A15C38',
              padding: '16px 36px',
              fontSize: '1.1rem',
              marginTop: '1rem'
            }}
          >
            Suscribirme por $5 USD/mes
          </button>
          <p style={{ 
            color: '#6F6E66', 
            fontSize: '0.85rem',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            🔒 Pago seguro con Stripe • Cancela cuando quieras
          </p>
        </div>
      )}

      {!readOnly && !isSubscribed && trialStatus && trialStatus.subscriptionStatus !== 'active' && informeCompletado && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1.2rem',
          marginTop: '2.5rem',
          padding: '2.5rem',
          backgroundColor: 'rgba(107, 112, 65, 0.12)',
          borderRadius: '16px',
          border: '3px solid rgba(107, 112, 65, 0.3)'
        }}>
          <p style={{ 
            color: '#556B2F', 
            fontSize: '1.5rem', 
            fontWeight: 700,
            margin: 0,
            textAlign: 'center'
          }}>
            💬 ¿Cómo usar el chat durante tu prueba gratuita?
          </p>
          
          <div style={{ 
            color: '#3A3A3A', 
            fontSize: '1rem',
            textAlign: 'left',
            lineHeight: 1.7,
            maxWidth: '650px'
          }}>
            <p style={{ marginBottom: '1rem', fontWeight: 600, fontSize: '1.05rem', color: '#556B2F' }}>
              Durante los próximos 7 días, el chat es tu espacio personal para:
            </p>
            <ul style={{ 
              paddingLeft: '1.5rem',
              margin: 0,
              listStyleType: 'none'
            }}>
              <li style={{ marginBottom: '0.75rem' }}>
                ✅ <strong>Compartir cómo te sientes cada día:</strong> cuéntale a Marvin Lira IA sobre tu sueño, digestión, nivel de energía y estado de ánimo
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                ✅ <strong>Hacer preguntas:</strong> sobre alimentación, síntomas, o cómo aplicar las recomendaciones de tu guía
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                ✅ <strong>Recibir orientación personalizada:</strong> basada en lo que compartas, recibirás consejos específicos para tu situación
              </li>
            </ul>
            <p style={{ marginTop: '1.25rem', fontSize: '0.95rem', fontStyle: 'italic', color: '#6F6E66' }}>
              💡 <strong>Consejo:</strong> Entre más detalles compartas sobre cómo te sientes, más específicas serán las recomendaciones que recibirás.
            </p>
          </div>

          <button
            className="btn-finalizar"
            data-testid="button-abrir-chat"
            onClick={handleOpenChat}
            style={{
              backgroundColor: '#6B7041',
              padding: '16px 40px',
              fontSize: '1.15rem',
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(107, 112, 65, 0.25)'
            }}
          >
            🌿 Abrir Chat Ahora
          </button>
          
          <p style={{ 
            color: '#556B2F', 
            fontSize: '0.9rem',
            margin: 0,
            fontWeight: 600
          }}>
            🎁 Acceso completo e ilimitado durante tu prueba de 7 días
          </p>
        </div>
      )}
      
      {!readOnly && isSubscribed && (
        <button
          className="btn-finalizar"
          data-testid="button-finalizar-informe"
          onClick={handleFinalize}
        >
          Finalizar
        </button>
      )}
    </section>
  );
}
