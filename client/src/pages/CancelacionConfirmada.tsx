import { useLocation } from "wouter";
import { Heart, Mail, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CancelacionConfirmada() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Main Card */}
          <div 
            className="rounded-xl p-8 sm:p-10 text-center mb-6"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: '1px solid #E6E3D9',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}
          >
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#F0EDE4' }}
              >
                <Heart className="w-8 h-8" style={{ color: '#6B7041' }} />
              </div>
            </div>

            {/* Title */}
            <h1 
              className="text-3xl sm:text-4xl font-bold mb-6" 
              style={{ color: '#3E3E2E' }}
            >
              Tu suscripción ha sido cancelada correctamente
            </h1>

            {/* Main Message */}
            <div className="mb-8 space-y-4 text-left">
              <p className="text-base leading-relaxed" style={{ color: '#6F6E66' }}>
                Gracias por haber sido parte de este proceso con TransformaDiabetes.
                Tu acceso se mantendrá activo hasta el final de tu período actual.
                Después de esa fecha, tu cuenta quedará en modo de solo lectura,
                y podrás reactivar tu suscripción en cualquier momento si decides continuar.
              </p>
            </div>

            {/* Important Reminder */}
            <div 
              className="rounded-lg p-6 mb-8 text-left"
              style={{ 
                backgroundColor: '#F0EDE4',
                border: '2px solid #6B7041'
              }}
            >
              <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#3E3E2E' }}>
                <Heart className="w-4 h-4" style={{ color: '#6B7041' }} />
                Queremos que recuerdes algo importante:
              </p>
              <p className="text-lg italic font-medium mb-4 text-center" style={{ color: '#6B7041' }}>
                "Sanar no es controlar un síntoma, es entender la raíz."
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#6F6E66' }}>
                Este camino no termina con una cancelación —
                cada conocimiento que aplicaste sigue apoyando a tu cuerpo.
              </p>
            </div>

            {/* Contact Section */}
            <div 
              className="rounded-lg p-6 mb-8 text-left"
              style={{ backgroundColor: '#FFF9E6', border: '1px solid #FFE082' }}
            >
              <p className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#3E3E2E' }}>
                <Mail className="w-4 h-4" style={{ color: '#6B7041' }} />
                ¿Necesitas ayuda?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#6F6E66' }}>
                Si cancelaste por motivos técnicos o personales,
                puedes escribirnos a{" "}
                <a 
                  href="mailto:contacto@transformadiabetes.com"
                  className="font-semibold underline"
                  style={{ color: '#6B7041' }}
                >
                  contacto@transformadiabetes.com
                </a>
                {" "}y con gusto te ayudaremos a resolver cualquier dificultad o darte opciones de reactivación.
              </p>
            </div>

            {/* Closing Message */}
            <div className="mb-8 pt-6 border-t" style={{ borderColor: '#E6E3D9' }}>
              <p className="text-lg italic font-medium mb-2" style={{ color: '#6B7041' }}>
                Tu cuerpo no está roto. Está aprendiendo a sanar.
              </p>
              <p className="text-base" style={{ color: '#6F6E66' }}>
                Gracias por confiar en este proceso,
                y recuerda que siempre puedes volver a tu espacio funcional cuando lo necesites.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setLocation("/")}
              className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition text-base flex items-center justify-center gap-2 mx-auto"
              style={{ 
                backgroundColor: '#6B7041',
                color: '#FFFFFF',
                border: 'none'
              }}
              data-testid="button-volver-inicio"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5A5E35')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6B7041')}
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
