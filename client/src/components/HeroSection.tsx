import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import heroImage from "@assets/generated_images/Latino_man_tablet_metabolismo_f95a9523.png";

export default function HeroSection() {
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null);

  // Detectar idioma: primero localStorage, luego default a español
  const getInitialLanguage = () => {
    const savedLang = localStorage.getItem('tm_language');
    if (savedLang) return savedLang === 'en';
    // Default siempre español
    return false;
  };

  const [isEnglish, setIsEnglish] = useState(getInitialLanguage);

  // Escuchar cambios de idioma desde el header
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      setIsEnglish(e.detail.isEnglish);
    };
    
    window.addEventListener('languageChange' as any, handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChange' as any, handleLanguageChange);
    };
  }, []);
  
  const getTooltipText = () => {
    if (isEnglish) {
      return "✨ Start your functional transformation today";
    }
    return "✨ Empieza tu transformación funcional hoy";
  };

  const getHeroTitle = () => {
    if (isEnglish) {
      return "Your body isn't broken — it just needs the right support to heal from the root.";
    }
    return "Tu cuerpo no está roto, solo necesita apoyo para sanar desde la raíz.";
  };

  const getHeroSubtitle = () => {
    if (isEnglish) {
      return "Discover how to balance your body and reverse diabetes from the root.";
    }
    return "Descubre cómo equilibrar tu cuerpo y revertir la diabetes desde la raíz.";
  };

  const getHeroDescription = () => {
    if (isEnglish) {
      return "For 7 days, you'll have free access to your functional diagnosis, personalized guidance, and step-by-step support to understand what your body really needs to heal.";
    }
    return "Durante 7 días tendrás acceso gratuito a tu diagnóstico funcional, guía personalizada y acompañamiento paso a paso para entender lo que tu cuerpo realmente necesita para sanar.";
  };

  const getButtonText = () => {
    if (isEnglish) {
      return "Start my free 7-day trial";
    }
    return "Comenzar mi prueba gratuita de 7 días";
  };

  const getButtonSubtext = () => {
    if (isEnglish) {
      return "Includes functional diagnosis + daily tracking + guided chat";
    }
    return "Incluye diagnóstico funcional + registro diario + chat guiado";
  };

  const getInspirationalQuote = () => {
    if (isEnglish) {
      return "Your body doesn't need perfection, it needs consistent support.";
    }
    return "Tu cuerpo no necesita perfección, necesita apoyo constante.";
  };

  const getFinalQuote = () => {
    if (isEnglish) {
      return "Reversing diabetes isn't a miracle, it's a functional process that begins with understanding your body.";
    }
    return "Revertir la diabetes no es un milagro, es un proceso funcional que comienza entendiendo tu cuerpo.";
  };

  const tooltipText = getTooltipText();
  const heroTitle = getHeroTitle();
  const heroSubtitle = getHeroSubtitle();
  const heroDescription = getHeroDescription();
  const buttonText = getButtonText();
  const buttonSubtext = getButtonSubtext();
  const inspirationalQuote = getInspirationalQuote();
  const finalQuote = getFinalQuote();

  const handleMobileTouch = (e: React.TouchEvent) => {
    // Si ya está visible, ocultarlo
    if (showMobileTooltip) {
      setShowMobileTooltip(false);
      if (tooltipTimer) clearTimeout(tooltipTimer);
      return;
    }
    
    // Mostrar tooltip
    setShowMobileTooltip(true);
    
    // Ocultar después de 2 segundos
    const timer = setTimeout(() => {
      setShowMobileTooltip(false);
    }, 2000);
    
    setTooltipTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (tooltipTimer) clearTimeout(tooltipTimer);
    };
  }, [tooltipTimer]);
  return (
    <>
      {/* VERSIÓN DESKTOP - Oculta en móvil, visible en md (768px) en adelante */}
      <section 
        className="hidden md:flex min-h-[80vh] items-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(250,248,244,0.95) 0%, rgba(238,235,225,0.9) 100%)',
        }}
      >
        {/* Fondo decorativo sutil */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm5.656 0L50.142 12.487l-1.414 1.414L36.244 1.414 37.656 0zm-16.97 0l13.314 13.314-1.414 1.414L20.686 2.828 19.272 1.414 20.686 0z' fill='%23556B2F' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda - Texto */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight"
                style={{ color: '#556B2F' }}
              >
                {heroTitle}
              </h1>
              
              <p 
                className="text-lg sm:text-xl leading-relaxed"
                style={{ color: '#3A3A3A' }}
              >
                {heroSubtitle}
              </p>

              <p 
                className="text-base leading-relaxed"
                style={{ color: '#3A3A3A' }}
              >
                {heroDescription}
              </p>

              <div className="pt-4">
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Link href="/cuestionario">
                        <Button 
                          size="lg"
                          data-testid="button-cuestionario-hero"
                          style={{
                            backgroundColor: '#A15C38',
                            color: 'white',
                            padding: '0.9rem 1.8rem',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(161, 92, 56, 0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          className="hover:brightness-110 hover:-translate-y-1 hover:shadow-xl"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(161, 92, 56, 0.35)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(161, 92, 56, 0.2)';
                          }}
                        >
                          {buttonText}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom"
                      className="animate-in fade-in-50 zoom-in-95"
                      style={{
                        backgroundColor: 'white',
                        color: '#556B2F',
                        border: '1px solid rgba(85, 107, 47, 0.1)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}
                    >
                      <span>{tooltipText}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <p 
                  className="text-sm mt-3"
                  style={{ color: '#666666' }}
                >
                  {buttonSubtext}
                </p>
                
                {/* Línea inspiradora para conversión */}
                <p 
                  className="text-sm mt-4 italic font-medium"
                  style={{ color: '#556B2F' }}
                >
                  {inspirationalQuote}
                </p>
              </div>

              {/* Línea divisoria */}
              <hr className="border-t border-gray-300 my-8" />

              {/* Cita inspiradora */}
              <p 
                className="text-base italic"
                style={{ color: '#777777' }}
              >
                "{finalQuote}"
              </p>
            </motion.div>

            {/* Columna derecha - Imagen */}
            <motion.div 
              className="hidden lg:flex justify-center items-center"
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
              <div 
                className="relative rounded-lg overflow-hidden shadow-2xl"
                style={{
                  maxWidth: '480px',
                  width: '100%',
                }}
              >
                <img
                  src={heroImage}
                  alt="Persona viendo tablet con información de salud"
                  className="w-full h-auto object-cover"
                  style={{
                    aspectRatio: '4/3',
                  }}
                />
                {/* Overlay sutil */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(85,107,47,0.05) 0%, rgba(161,92,56,0.05) 100%)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VERSIÓN MÓVIL - Visible en móvil, oculta en md (768px) en adelante */}
      <section 
        className="block md:hidden text-left py-10 px-5 relative"
        style={{
          background: 'linear-gradient(135deg, rgba(250,248,244,0.95) 0%, rgba(238,235,225,0.9) 100%)',
          maxWidth: '600px',
          margin: 'auto'
        }}
      >
        {/* Fondo decorativo sutil */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm5.656 0L50.142 12.487l-1.414 1.414L36.244 1.414 37.656 0zm-16.97 0l13.314 13.314-1.414 1.414L20.686 2.828 19.272 1.414 20.686 0z' fill='%23556B2F' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 
            className="font-serif font-bold leading-tight"
            style={{ 
              fontSize: '1.9rem', 
              color: '#3d4a2f',
              lineHeight: '1.3'
            }}
          >
            {heroTitle}
          </h1>

          <p 
            className="leading-relaxed"
            style={{ 
              fontSize: '1rem', 
              color: '#5b5b5b',
              marginTop: '0.8rem',
              lineHeight: '1.6'
            }}
          >
            {heroSubtitle}
          </p>

          <p 
            style={{ 
              fontSize: '0.95rem', 
              color: '#5b5b5b',
              marginTop: '0.8rem'
            }}
          >
            {isEnglish 
              ? "Free access for 7 days: diagnosis, daily tracking, and guided chat."
              : "Acceso gratuito por 7 días: diagnóstico, registro diario y chat guiado."
            }
          </p>

          <div className="text-center relative" style={{ marginTop: '1.5rem' }}>
            <div onTouchStart={handleMobileTouch}>
              <Link href="/cuestionario">
                <Button
                  data-testid="button-cuestionario-hero-mobile"
                  style={{
                    backgroundColor: '#b7492f',
                    color: '#fff',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(183, 73, 47, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className="hover:brightness-110 hover:-translate-y-1 hover:shadow-xl inline-block"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(183, 73, 47, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(183, 73, 47, 0.2)';
                  }}
                >
                  {isEnglish ? "Start free trial" : "Comenzar prueba gratuita"}
                </Button>
              </Link>
            </div>
            
            {/* Tooltip para móvil */}
            {showMobileTooltip && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-50 animate-in fade-in-50 zoom-in-95"
                style={{
                  backgroundColor: 'white',
                  color: '#2d6a4f',
                  border: '1px solid rgba(45, 106, 79, 0.15)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tooltipText}</span>
              </div>
            )}
          </div>

          <p 
            className="text-center italic font-medium"
            style={{ 
              marginTop: '1rem', 
              fontSize: '0.85rem', 
              color: '#2d6a4f'
            }}
          >
            {inspirationalQuote}
          </p>
        </motion.div>
      </section>
    </>
  );
}
