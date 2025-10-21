import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/Latino_man_tablet_metabolismo_f95a9523.png";

export default function HeroSection() {
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight"
                style={{ color: '#556B2F' }}
              >
                Tu cuerpo no está roto.<br />Solo necesita dirección.
              </h1>
              
              <p 
                className="text-lg sm:text-xl leading-relaxed"
                style={{ color: '#3A3A3A' }}
              >
                Descubre cómo equilibrar tu glucosa, reducir la inflamación y recuperar tu energía natural 
                con un enfoque funcional diseñado para <strong>revertir la diabetes tipo 2 desde la raíz</strong>.
              </p>

              <p 
                className="text-base leading-relaxed"
                style={{ color: '#3A3A3A' }}
              >
                Durante 7 días tendrás acceso gratuito a tu diagnóstico funcional, guía personalizada 
                y acompañamiento paso a paso para entender lo que tu cuerpo realmente necesita para sanar.
              </p>

              <div className="pt-4">
                <Link href="/diagnostico">
                  <Button 
                    size="lg"
                    data-testid="button-diagnostico-hero"
                    style={{
                      backgroundColor: '#A15C38',
                      color: 'white',
                      padding: '0.9rem 1.8rem',
                      fontSize: '1.05rem',
                      fontWeight: 600
                    }}
                    className="hover:opacity-90 transition-opacity"
                  >
                    Comenzar mi prueba gratuita de 7 días
                  </Button>
                </Link>
                
                <p 
                  className="text-sm mt-3"
                  style={{ color: '#666666' }}
                >
                  Incluye diagnóstico funcional + registro diario + chat guiado
                </p>
              </div>

              {/* Línea divisoria */}
              <hr className="border-t border-gray-300 my-8" />

              {/* Cita inspiradora */}
              <p 
                className="text-base italic"
                style={{ color: '#777777' }}
              >
                "Revertir la diabetes no es un milagro, es un proceso funcional que comienza entendiendo tu cuerpo."
              </p>
            </motion.div>

            {/* Columna derecha - Imagen */}
            <motion.div 
              className="hidden lg:flex justify-center items-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
            Tu cuerpo no está roto.<br />Solo necesita dirección.
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
            Recupera tu equilibrio natural y aprende a <strong>revertir la diabetes tipo 2</strong> desde la raíz 
            con una guía funcional práctica y personalizada.
          </p>

          <p 
            style={{ 
              fontSize: '0.95rem', 
              color: '#5b5b5b',
              marginTop: '0.8rem'
            }}
          >
            Acceso gratuito por 7 días: diagnóstico, registro diario y chat guiado.
          </p>

          <div className="text-center" style={{ marginTop: '1.5rem' }}>
            <Link href="/diagnostico">
              <Button
                data-testid="button-diagnostico-hero-mobile"
                style={{
                  backgroundColor: '#b7492f',
                  color: '#fff',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
                className="hover:opacity-90 transition-opacity inline-block"
              >
                Comenzar prueba gratuita
              </Button>
            </Link>
          </div>

          <p 
            className="text-center italic"
            style={{ 
              marginTop: '1rem', 
              fontSize: '0.85rem', 
              color: '#777'
            }}
          >
            "Entender tu cuerpo es el primer paso para sanarlo."
          </p>
        </motion.div>
      </section>
    </>
  );
}
