import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer 
      className="text-center px-4 py-8 border-t transition-all duration-300"
      style={{ 
        backgroundColor: '#F8F7F3',
        color: '#4B4B3B',
        borderTopColor: '#E6E3D9'
      }}
    >
      {/* Logo y Frase */}
      <div className="mb-4">
        <img 
          src="https://i.ibb.co/XZcPNfw/nutrimarvin-logo-olivo.png" 
          alt="NutriMarvin Logo" 
          className="h-10 mx-auto mb-2"
        />
        <p className="text-sm sm:text-base italic m-0">
          "Tu cuerpo no está roto, solo está protegiéndose."
        </p>
      </div>

      {/* Enlaces de navegación */}
      <div className="mb-5 text-sm sm:text-base flex flex-wrap justify-center gap-x-1 gap-y-2">
        <Link 
          href="/" 
          className="mx-2 hover:underline hover:opacity-90 transition-opacity"
          style={{ color: '#A15C38', textDecoration: 'none' }}
        >
          Inicio
        </Link>
        <span style={{ color: '#7A776F' }}>|</span>
        <Link 
          href="/diagnostico" 
          className="mx-2 hover:underline hover:opacity-90 transition-opacity"
          style={{ color: '#A15C38', textDecoration: 'none' }}
        >
          Diagnóstico
        </Link>
        <span style={{ color: '#7A776F' }}>|</span>
        <Link 
          href="/guia" 
          className="mx-2 hover:underline hover:opacity-90 transition-opacity"
          style={{ color: '#A15C38', textDecoration: 'none' }}
        >
          Guías
        </Link>
        <span style={{ color: '#7A776F' }}>|</span>
        <Link 
          href="/resultados" 
          className="mx-2 hover:underline hover:opacity-90 transition-opacity"
          style={{ color: '#A15C38', textDecoration: 'none' }}
        >
          Resultados
        </Link>
        <span style={{ color: '#7A776F' }}>|</span>
        <Link 
          href="/privacidad" 
          className="mx-2 hover:underline hover:opacity-90 transition-opacity"
          style={{ color: '#A15C38', textDecoration: 'none' }}
        >
          Política de Privacidad
        </Link>
      </div>

      {/* Información de Privacidad */}
      <div 
        className="max-w-4xl mx-auto mb-5 text-xs sm:text-sm leading-relaxed"
        style={{ color: '#7A776F' }}
      >
        <p className="mb-2">
          La información que compartes en <strong>NutriMarvin</strong> es completamente confidencial.
          No vendemos, compartimos ni divulgamos tus datos personales a terceros.
        </p>
        <p>
          Cumplimos con las regulaciones de privacidad aplicables en EE. UU. y protegemos tu información mediante protocolos seguros de encriptación y almacenamiento.
        </p>
      </div>

      {/* Copyright */}
      <div className="text-xs sm:text-sm" style={{ color: '#7A776F' }}>
        © {currentYear} NutriMarvin Funcional • Todos los derechos reservados.
      </div>
    </footer>
  );
}
