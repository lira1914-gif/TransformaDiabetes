import { useEffect, useState } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer 
      className="text-center px-4 py-8 mt-12 border-t"
      style={{ 
        backgroundColor: '#F7F5EF',
        color: '#4B4B3B',
        borderTopColor: '#E0DED5'
      }}
    >
      <p className="text-sm sm:text-base mb-2">
        © {currentYear} <strong>NutriMarvin</strong> — Todos los derechos reservados.
      </p>

      <p className="text-xs sm:text-sm leading-relaxed mb-3 max-w-3xl mx-auto">
        La información en esta plataforma tiene fines educativos y no sustituye orientación médica profesional.
        <br />
        Tu cuerpo no está roto, solo está protegiéndose.
      </p>

      <p className="text-sm">
        <a 
          href="/privacidad" 
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline transition-all"
          style={{ color: '#A15C38' }}
        >
          Política de Privacidad Completa
        </a>
      </p>
    </footer>
  );
}
