import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/generated_images/TransformaDiabetes_complete_logo_with_tagline_2f0190f6.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const handleInicioClick = (e: React.MouseEvent) => {
    if (location === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
          href="/pre-registro" 
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
          href="/pre-registro"
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
            href="/pre-registro" 
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
            href="/pre-registro"
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
