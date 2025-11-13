import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Menu } from "lucide-react";
import logoImage from "@assets/generated_images/TransformaDiabetes_complete_logo_with_tagline_2f0190f6.png";
import TrialCounter from "./TrialCounter";
import { TrialStatus } from "@/types/trial";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Obtener estado del trial para controlar visibilidad del Chat Semanal
  const userId = localStorage.getItem('tm_user_id');
  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });
  
  // Determinar si mostrar header completo o minimalista
  const informeCompletado = localStorage.getItem('tm_informe_ready') === 'true';
  const mostrarHeaderCompleto = informeCompletado;
  
  // Idioma: español por default
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('tm_language') || 'es';
  });

  const handleInicioClick = (e: React.MouseEvent) => {
    if (location === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    localStorage.setItem('tm_language', newLang);
    
    // Disparar evento para que HeroSection se actualice
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { isEnglish: newLang === 'en' }
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Header minimalista (solo logo) - antes de completar cuestionario
  if (!mostrarHeaderCompleto) {
    return (
      <header 
        className="sticky top-0 z-[1000] flex items-center justify-center px-4 sm:px-6 py-4 border-b"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottomColor: '#E6E3D9'
        }}
      >
        {/* Logo / Nombre - centrado */}
        <Link href="/" className="flex items-center">
          <img 
            src={logoImage} 
            alt="TransformaDiabetes - Nutrición funcional para revertir desde la raíz" 
            className="h-12 sm:h-14"
          />
        </Link>
      </header>
    );
  }

  // Header completo (con navegación) - después de completar cuestionario
  return (
    <header 
      className="sticky top-0 z-[1000] flex items-center justify-between flex-wrap px-4 sm:px-6 py-4 border-b"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E6E3D9'
      }}
    >
      {/* Logo / Nombre */}
      <Link href="/" className="flex items-center">
        <img 
          src={logoImage} 
          alt="TransformaDiabetes - Nutrición funcional para revertir desde la raíz" 
          className="h-12 sm:h-14"
        />
      </Link>

      {/* Botón Menú Móvil */}
      <button
        id="menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden"
        style={{ 
          background: 'none',
          border: 'none',
          color: '#4B4B3B',
          cursor: 'pointer',
          padding: '4px'
        }}
        data-testid="button-mobile-menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Selector de Idioma - Solo en Landing */}
      {location === "/" && (
        <button
          onClick={toggleLanguage}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md transition-all hover:opacity-80"
          style={{
            backgroundColor: 'rgba(85, 107, 47, 0.1)',
            color: '#556B2F',
            border: '1px solid rgba(85, 107, 47, 0.2)',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
          data-testid="button-language-toggle"
        >
          <span>{language === 'es' ? 'ES' : 'EN'}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>⇄</span>
        </button>
      )}

      {/* Contador de Trial */}
      <div className="hidden md:block">
        <TrialCounter />
      </div>

      {/* Enlace Consulta Gratuita - Desktop */}
      <a
        href="https://my.practicebetter.io/#/67ee0d2ede79d5983d604c7f/bookings?s=67ee0fcade79d5983d609b52&flavor=mobileapp&step=date"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md transition-all hover:opacity-80"
        style={{
          backgroundColor: 'rgba(74, 93, 35, 0.1)',
          color: '#4a5d23',
          border: '1px solid rgba(74, 93, 35, 0.25)',
          fontSize: '0.875rem',
          fontWeight: 500,
          textDecoration: 'none',
          cursor: 'pointer'
        }}
        data-testid="link-consulta-gratuita"
      >
        <Calendar className="w-4 h-4" />
        <span>Consulta Gratuita</span>
      </a>

      {/* Menú de Navegación Desktop */}
      <nav className="hidden md:flex items-center gap-6">
        <Link 
          href="/" 
          className="font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#4B4B3B', textDecoration: 'none' }}
          data-testid="link-inicio"
          onClick={handleInicioClick}
        >
          Inicio
        </Link>
        {/* Mi Informe y Chat: visibles solo después de completar el informe inicial */}
        <Link 
          href="/onboarding/informe-inicial" 
          className="font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#4B4B3B', textDecoration: 'none' }}
          data-testid="link-informe-nav"
        >
          Mi Informe
        </Link>
        <Link 
          href="/chat-semanal" 
          className="font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#4B4B3B', textDecoration: 'none' }}
          data-testid="link-chat-nav"
        >
          Chat Semanal
        </Link>
      </nav>

      {/* CTA Desktop */}
      <div className="hidden md:block">
        <Link
          href="/cuestionario"
          className="inline-block px-4 py-2 rounded-md text-white font-semibold transition-all"
          style={{ backgroundColor: '#A15C38', textDecoration: 'none' }}
          data-testid="button-cta-cuestionario"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8C4E30'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A15C38'}
        >
          Comenzar evaluación
        </Link>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="w-full md:hidden mt-4 flex flex-col gap-3">
          {/* Contador de Trial (móvil) */}
          <div className="mb-2">
            <TrialCounter />
          </div>
          
          {/* Enlace Consulta Gratuita - Móvil */}
          <a
            href="https://my.practicebetter.io/#/67ee0d2ede79d5983d604c7f/bookings?s=67ee0fcade79d5983d609b52&flavor=mobileapp&step=date"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all hover:opacity-80 mb-2"
            style={{
              backgroundColor: 'rgba(74, 93, 35, 0.1)',
              color: '#4a5d23',
              border: '1px solid rgba(74, 93, 35, 0.25)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            data-testid="link-consulta-gratuita-mobile"
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda tu Consulta Gratuita</span>
          </a>
          
          {/* Selector de Idioma (móvil) - Solo en Landing */}
          {location === "/" && (
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all hover:opacity-80 mb-2"
              style={{
                backgroundColor: 'rgba(85, 107, 47, 0.1)',
                color: '#556B2F',
                border: '1px solid rgba(85, 107, 47, 0.2)',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
              data-testid="button-language-toggle-mobile"
            >
              <span>{language === 'es' ? 'Español' : 'English'}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>⇄</span>
            </button>
          )}
          
          <Link 
            href="/" 
            className="font-medium py-2"
            style={{ color: '#4B4B3B', textDecoration: 'none' }}
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleInicioClick(e);
            }}
            data-testid="link-mobile-inicio"
          >
            Inicio
          </Link>
          <Link 
            href="/onboarding/informe-inicial" 
            className="font-medium py-2"
            style={{ color: '#4B4B3B', textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
            data-testid="link-mobile-informe"
          >
            Mi Informe
          </Link>
          <Link 
            href="/chat-semanal" 
            className="font-medium py-2"
            style={{ color: '#4B4B3B', textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
            data-testid="link-mobile-chat"
          >
            Chat Semanal
          </Link>
          <Link
            href="/cuestionario"
            className="inline-block px-4 py-2 rounded-md text-white font-semibold text-center mt-2"
            style={{ backgroundColor: '#A15C38', textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
            data-testid="button-mobile-cta-cuestionario"
          >
            Comenzar evaluación
          </Link>
        </div>
      )}
    </header>
  );
}
