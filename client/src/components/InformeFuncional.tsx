import { useEffect, useState } from "react";

export default function InformeFuncional() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="informe-inicial"
      className={`informe-funcional ${visible ? "fade-in" : ""}`}
      style={{
        backgroundColor: "#FAF8F4",
        minHeight: "100vh",
        padding: "3rem 1.5rem",
      }}
      data-testid="informe-inicial"
    >
      <div
        className="container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "2.5rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            color: "#3E5E36",
            fontSize: "2rem",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          🌿 Tu Guía Funcional Personalizada – Semana 1
        </h1>

        <p
          style={{
            textAlign: "center",
            fontStyle: "italic",
            color: "#6a6a6a",
            marginBottom: "1.5rem",
          }}
        >
          "Tu cuerpo no está roto, solo se está protegiendo.  
          Aprende a escuchar su mensaje con calma y curiosidad."
        </p>

        <hr style={{ margin: "1.5rem 0" }} />

        <h3 style={{ color: "#4B6043" }}>Resumen de tus primeros 5 días</h3>
        <p>
          Basado en tus registros de alimentación, sueño y digestión, tu cuerpo
          está ajustando su equilibrio interno. No busca fallar, sino adaptarse
          a lo que le das día a día.
        </p>

        <ul style={{ lineHeight: "1.8", marginLeft: "1.5rem" }}>
          <li>
            🍽️ <strong>Equilibra tus comidas:</strong> combina grasa, fibra y proteína.
          </li>
          <li>
            🌿 <strong>Reduce la carga inflamatoria:</strong> evita procesados y
            azúcares añadidos.
          </li>
          <li>
            🌙 <strong>Repara con descanso:</strong> cuida tu ritmo circadiano y evita pantallas 1h antes de dormir.
          </li>
          <li>
            💧 <strong>Apoya tu hígado y linfa:</strong> hidrátate y realiza respiraciones profundas cada mañana.
          </li>
          <li>
            🧘 <strong>Calma tu sistema nervioso:</strong> tu cuerpo no puede sanar en estado de alerta.
          </li>
        </ul>

        <hr style={{ margin: "1.5rem 0" }} />

        <h3 style={{ color: "#4B6043" }}>Tu enfoque para los próximos días</h3>
        <p>
          Observa cómo responde tu cuerpo con estos ajustes.  
          No busques perfección, busca señales: energía más estable, digestión
          más ligera, sueño más profundo.
        </p>

        <div
          style={{
            background: "#f9f9f9",
            padding: "1rem 1.5rem",
            borderRadius: "10px",
            margin: "1.5rem 0",
          }}
        >
          <p style={{ fontStyle: "italic", color: "#555" }}>
            "Sanar no es controlar — es comprender el mensaje de tu cuerpo."
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            data-testid="button-finalizar-informe"
            style={{
              backgroundColor: "#8C593B",
              color: "#fff",
              padding: "0.8rem 1.5rem",
              borderRadius: "8px",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#734b31")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#8C593B")}
            onClick={() =>
              alert(
                "Gracias por completar tu primera semana. Pronto podrás continuar al Mes 2 con IA."
              )
            }
          >
            Finalizar
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.9rem",
            color: "#777",
          }}
        >
          *Este contenido es educativo y no reemplaza la atención médica
          profesional.*
        </p>
      </div>
    </section>
  );
}
