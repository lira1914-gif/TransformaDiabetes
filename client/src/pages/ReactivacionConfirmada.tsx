import { useLocation } from "wouter";
import { Heart, CheckCircle, FileText, Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReactivacionConfirmada() {
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
                style={{ backgroundColor: '#E8F5E9' }}
              >
                <Heart className="w-8 h-8" style={{ color: '#6B7041' }} />
              </div>
            </div>

            {/* Title */}
            <h1 
              className="text-3xl sm:text-4xl font-bold mb-4" 
              style={{ color: '#3E3E2E' }}
            >
              ¡Nos alegra tenerte de vuelta!
            </h1>

            {/* Intro Message */}
            <div className="mb-8 space-y-4 text-left">
              <p className="text-lg leading-relaxed" style={{ color: '#6F6E66' }}>
                Tu cuerpo no se rindió, solo pidió una pausa.
                Y hoy estás eligiendo seguir entendiendo lo que necesita, desde la raíz.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#6F6E66' }}>
                Has reactivado tu suscripción a TransformaDiabetes,
                y con eso se desbloquean nuevamente tus módulos funcionales, informes personalizados y acompañamiento educativo.
              </p>
            </div>

            {/* Process Continuation Section */}
            <div 
              className="rounded-lg p-6 mb-8 text-left"
              style={{ 
                backgroundColor: '#F0EDE4',
                border: '1px solid #E6E3D9'
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#3E3E2E' }}>
                <CheckCircle className="w-5 h-5" style={{ color: '#6B7041' }} />
                Tu proceso continuará desde donde lo dejaste
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold" style={{ color: '#6B7041' }}></span>
                  <p className="text-sm" style={{ color: '#6F6E66' }}>
                    Mantendrás tu historial y tus informes anteriores.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold" style={{ color: '#6B7041' }}></span>
                  <p className="text-sm" style={{ color: '#6F6E66' }}>
                    Podrás volver a acceder a tu módulo actual y los próximos.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold" style={{ color: '#6B7041' }}></span>
                  <p className="text-sm" style={{ color: '#6F6E66' }}>
                    En los siguientes días, recibirás una actualización automática con tus nuevos contenidos educativos.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mb-8">
              <button
                onClick={() => setLocation("/perfil")}
                className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition text-base flex items-center justify-center gap-2 mx-auto"
                style={{ 
                  backgroundColor: '#6B7041',
                  color: '#FFFFFF',
                  border: 'none'
                }}
                data-testid="button-ir-panel"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5A5E35')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6B7041')}
              >
                Ir a mi panel de usuario
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Reminder Message */}
            <div 
              className="rounded-lg p-6 mb-8 text-left"
              style={{ 
                backgroundColor: '#E8F5E9',
                border: '2px solid #6B7041'
              }}
            >
              <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#3E3E2E' }}>
                <Heart className="w-4 h-4" style={{ color: '#6B7041' }} />
                Recuerda:
              </p>
              <p className="text-lg italic font-medium mb-3 text-center" style={{ color: '#6B7041' }}>
                "Tu cuerpo no está roto, solo está buscando equilibrio."
              </p>
              <p className="text-sm leading-relaxed text-center" style={{ color: '#6F6E66' }}>
                Cada pausa es también parte del proceso de sanar.
              </p>
            </div>

            {/* Contact Section */}
            <div 
              className="rounded-lg p-6 mb-8 text-left"
              style={{ backgroundColor: '#FFF9E6', border: '1px solid #FFE082' }}
            >
              <p className="text-sm leading-relaxed" style={{ color: '#6F6E66' }}>
                Si reactivaste por error o tienes dudas sobre tu estado de cuenta,
                puedes escribirnos a{" "}
                <a 
                  href="mailto:contacto@transformadiabetes.com"
                  className="font-semibold underline"
                  style={{ color: '#6B7041' }}
                >
                  contacto@transformadiabetes.com
                </a>
                {" "}y con gusto te ayudaremos a confirmar tu suscripción.
              </p>
            </div>

            {/* Closing Message */}
            <div className="pt-6 border-t" style={{ borderColor: '#E6E3D9' }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#6B7041' }}>
                Bienvenido nuevamente a tu proceso funcional
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#6F6E66' }}>
                Este espacio está diseñado para acompañarte,
                sin juicios, sin prisas, y con la certeza de que el cuerpo siempre puede volver al equilibrio.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
