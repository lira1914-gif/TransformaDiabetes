import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
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

  // Marcar que el usuario vio el informe (solo la primera vez)
  useEffect(() => {
    if (!userId) return;

    const markReportViewed = async () => {
      try {
        // Marcar reportViewedAt en el backend
        await apiRequest('PUT', `/api/users/${userId}`, {
          reportViewedAt: new Date().toISOString()
        });
        // Invalidar query de onboarding para actualizar UI
        queryClient.invalidateQueries({ queryKey: ['/api/onboarding-progress', userId] });
      } catch (error) {
        console.error('Error marking report as viewed:', error);
      }
    };

    // Solo marcar una vez por sesión para evitar requests innecesarios
    const sessionKey = 'tm_report_viewed_session';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'true');
      markReportViewed();
    }
  }, [userId]);

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

      {/* CTA Emocional de Suscripción para usuarios en trial */}
      {!readOnly && !isSubscribed && trialStatus && trialStatus.subscriptionStatus !== 'active' && (
        <div style={{ 
          marginTop: '3rem',
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(161, 92, 56, 0.06) 0%, rgba(107, 112, 65, 0.08) 100%)',
          borderRadius: '20px',
          border: '3px solid rgba(161, 92, 56, 0.3)',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(161, 92, 56, 0.12)'
        }}>
          <h3 style={{ 
            color: '#A15C38', 
            fontSize: '1.8rem', 
            fontWeight: 700,
            marginBottom: '1.25rem',
            lineHeight: 1.3
          }}>
            ¿Quieres seguir este camino conmigo?
          </h3>
          <p style={{ 
            color: '#3A3A3A', 
            fontSize: '1.15rem',
            marginBottom: '1.5rem',
            lineHeight: 1.7,
            fontWeight: 500
          }}>
            Esta guía funcional es solo el principio de tu transformación. 
            <br />
            <span style={{ color: '#556B2F', fontWeight: 600 }}>
              Tu cuerpo tiene la sabiduría para sanar — solo necesita el camino correcto.
            </span>
          </p>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '12px',
            padding: '1.75rem',
            marginBottom: '1.75rem',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto 1.75rem auto'
          }}>
            <p style={{ 
              color: '#556B2F', 
              fontSize: '1.05rem',
              marginBottom: '1rem',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              Con tu suscripción de <span style={{ color: '#A15C38', fontSize: '1.2rem' }}>$5 USD/mes</span> desbloqueas:
            </p>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#3A3A3A',
              fontSize: '1rem',
              lineHeight: 2
            }}>
              <li>🌿 <strong>Chat semanal ilimitado</strong> con Marvin Lira IA — tu guía personalizada</li>
              <li>📚 <strong>Módulos educativos progresivos</strong> que se desbloquean cada semana</li>
              <li>📊 <strong>Seguimiento personalizado</strong> de tu progreso funcional</li>
              <li>💬 <strong>Guías de acción específicas</strong> basadas en tus síntomas únicos</li>
              <li>👥 <strong>Comunidad de apoyo</strong> (próximamente)</li>
            </ul>
          </div>

          <button
            className="btn-finalizar"
            data-testid="button-subscribe-from-informe"
            onClick={() => navigate('/onboarding/checkout')}
            style={{
              backgroundColor: '#A15C38',
              padding: '18px 48px',
              fontSize: '1.2rem',
              marginTop: '0.5rem',
              fontWeight: 700,
              boxShadow: '0 6px 16px rgba(161, 92, 56, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            🌸 Sí, quiero transformar mi salud
          </button>
          
          <p style={{ 
            color: '#6F6E66', 
            fontSize: '0.9rem',
            marginTop: '1.25rem',
            marginBottom: 0,
            lineHeight: 1.6
          }}>
            <span style={{ fontSize: '1rem' }}>🔒</span> Pago seguro con Stripe • Cancela cuando quieras
            <br />
            <span style={{ color: '#A15C38', fontWeight: 600 }}>Solo $5 USD/mes — menos de un café al día</span>
          </p>
        </div>
      )}

      {/* CTA del Chat - Disponible durante los 7 días de trial */}
      {!readOnly && !isSubscribed && trialStatus && trialStatus.subscriptionStatus !== 'active' && informeCompletado && (
        <div style={{ 
          marginTop: '2rem',
          padding: '2rem',
          backgroundColor: 'rgba(107, 112, 65, 0.08)',
          borderRadius: '16px',
          border: '2px dashed rgba(107, 112, 65, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#556B2F', 
            fontSize: '1.3rem', 
            fontWeight: 600,
            margin: '0 0 1rem 0',
            lineHeight: 1.4
          }}>
            💬 Mientras decides, prueba el chat gratis por 7 días
          </p>
          
          <p style={{ 
            color: '#3A3A3A', 
            fontSize: '1rem',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 1.5rem auto'
          }}>
            Comparte cómo te sientes cada día (sueño, digestión, energía) y recibe orientación personalizada de Marvin Lira IA. 
            <strong> Sin compromiso, sin tarjeta.</strong>
          </p>

          <button
            className="btn-finalizar"
            data-testid="button-abrir-chat"
            onClick={handleOpenChat}
            style={{
              backgroundColor: '#6B7041',
              padding: '14px 36px',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(107, 112, 65, 0.2)',
              border: 'none'
            }}
          >
            🌿 Probar el Chat Gratis
          </button>
          
          <p style={{ 
            color: '#6F6E66', 
            fontSize: '0.85rem',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            🎁 <span style={{ fontWeight: 600 }}>Acceso ilimitado</span> durante los próximos 7 días
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
