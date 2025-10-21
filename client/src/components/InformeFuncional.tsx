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
  const userId = "d48af8be-dabe-4b0e-94cb-48eadfb0fbe8"; // Usuario de prueba
  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });

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
      <h2>🌿 Tu Guía Funcional Personalizada — Semana 1</h2>
      <p className="subtitulo">
        "Tu cuerpo no está roto, solo se está protegiendo. Aprende a escuchar su
        mensaje con calma y curiosidad."
      </p>

      <div className="bloque-texto">
        <h3>Resumen de tus primeros 5 días</h3>
        <p>
          Basado en tus registros de alimentación, sueño y digestión, tu cuerpo está
          ajustando su equilibrio interno. No busca fallar, está aprendiendo a
          responder de otra forma. 🧠💪
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
          La próxima etapa incluirá ajustes más específicos y la activación del
          diario funcional guiado por IA.* 🤖
        </p>
      </div>

      {!readOnly && !isSubscribed && trialStatus && (trialStatus.isActive || trialStatus.isTrialing) && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1rem',
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(107, 112, 65, 0.08)',
          borderRadius: '12px',
          border: '2px solid rgba(107, 112, 65, 0.2)'
        }}>
          <p style={{ 
            color: '#556B2F', 
            fontSize: '1.1rem', 
            fontWeight: 600,
            margin: 0,
            textAlign: 'center'
          }}>
            💬 ¿Tienes preguntas sobre tu informe?
          </p>
          <p style={{ 
            color: '#3A3A3A', 
            fontSize: '0.95rem',
            margin: 0,
            textAlign: 'center'
          }}>
            Abre tu chat semanal guiado por IA para explorar tus resultados y recibir orientación personalizada
          </p>
          <button
            className="btn-finalizar"
            data-testid="button-abrir-chat"
            onClick={handleOpenChat}
            style={{
              backgroundColor: '#6B7041',
              padding: '14px 32px',
              fontSize: '1.05rem'
            }}
          >
            🌿 Abrir Chat Semanal
          </button>
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
