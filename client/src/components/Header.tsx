import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/generated_images/TransformaDiabetes_complete_logo_with_tagline_2f0190f6.png";
import TrialCounter from "./TrialCounter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
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
        className="md:hidden text-2xl"
        style={{ 
          background: 'none',
          border: 'none',
          color: '#4B4B3B',
          cursor: 'pointer'
        }}
        data-testid="button-mobile-menu"
      >
        ☰
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
          <span>{language === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>⇄</span>
        </button>
      )}

      {/* Contador de Trial */}
      <div className="hidden md:block">
        <TrialCounter />
      </div>

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
        <Link 
          href="/onboarding/bienvenida-trial" 
          className="font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#4B4B3B', textDecoration: 'none' }}
          data-testid="link-diagnostico-nav"
        >
          Diagnóstico
        </Link>
        <Link 
          href="/chat-semanal" 
          className="font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#4B4B3B', textDecoration: 'none' }}
          data-testid="link-chat-nav"
        >
          Chat Semanal
        </Link>
        <Link 
          href="/onboarding/informe-inicial" 
          className="font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#4B4B3B', textDecoration: 'none' }}
          data-testid="link-informe-nav"
        >
          Mi Informe
        </Link>
        <Link 
          href="/perfil" 
          className="font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#4B4B3B', textDecoration: 'none' }}
          data-testid="link-perfil-nav"
        >
          Perfil
        </Link>
      </nav>

      {/* CTA Desktop */}
      <div className="hidden md:block">
        <Link
          href="/onboarding/bienvenida-trial"
          className="inline-block px-4 py-2 rounded-md text-white font-semibold transition-all"
          style={{ backgroundColor: '#A15C38', textDecoration: 'none' }}
          data-testid="button-cta-diagnostico"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8C4E30'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A15C38'}
        >
          Empieza tu diagnóstico
        </Link>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="w-full md:hidden mt-4 flex flex-col gap-3">
          {/* Contador de Trial (móvil) */}
          <div className="mb-2">
            <TrialCounter />
          </div>
          
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
              <span>{language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}</span>
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
            href="/onboarding/bienvenida-trial" 
            className="font-medium py-2"
            style={{ color: '#4B4B3B', textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
            data-testid="link-mobile-diagnostico"
          >
            Diagnóstico
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
            href="/onboarding/informe-inicial" 
            className="font-medium py-2"
            style={{ color: '#4B4B3B', textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
            data-testid="link-mobile-informe"
          >
            Mi Informe
          </Link>
          <Link 
            href="/perfil" 
            className="font-medium py-2"
            style={{ color: '#4B4B3B', textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
            data-testid="link-mobile-perfil"
          >
            Perfil
          </Link>
          <Link
            href="/onboarding/bienvenida-trial"
            className="inline-block px-4 py-2 rounded-md text-white font-semibold text-center mt-2"
            style={{ backgroundColor: '#A15C38', textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
            data-testid="button-mobile-cta-diagnostico"
          >
            Empieza tu diagnóstico
          </Link>
        </div>
      )}
    </header>
  );
}
