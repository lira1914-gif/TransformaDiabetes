import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, ClipboardList, Calendar, MessageCircle } from "lucide-react";

export default function BienvenidaTrial() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <Card className="border-2" style={{ borderColor: '#6B7041' }}>
          <CardContent className="p-8 sm:p-12">
            {/* Icono principal */}
            <div className="flex justify-center mb-6">
              <div 
                className="p-4 rounded-full"
                style={{ backgroundColor: 'rgba(107, 112, 65, 0.1)' }}
              >
                <Sprout className="w-12 h-12" style={{ color: '#6B7041' }} />
              </div>
            </div>

            {/* Título */}
            <h1 
              className="text-3xl sm:text-4xl font-serif font-bold text-center mb-6"
              style={{ color: '#556B2F' }}
            >
              Tu transformación funcional comienza aquí
            </h1>

            {/* Descripción principal */}
            <p 
              className="text-lg text-center mb-8 leading-relaxed"
              style={{ color: '#3A3A3A' }}
            >
              Durante los próximos <strong>7 días</strong> tendrás acceso gratuito a tu diagnóstico funcional, 
              tu registro diario y un chat guiado.
            </p>

            <p 
              className="text-lg text-center mb-10 leading-relaxed"
              style={{ color: '#3A3A3A' }}
            >
              Completa tu historial de salud y hábitos para comenzar tu evaluación personalizada.
            </p>

            {/* Características incluidas */}
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center text-center">
                <div 
                  className="p-3 rounded-full mb-3"
                  style={{ backgroundColor: 'rgba(107, 112, 65, 0.1)' }}
                >
                  <ClipboardList className="w-6 h-6" style={{ color: '#6B7041' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: '#3A3A3A' }}>
                  Diagnóstico completo
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div 
                  className="p-3 rounded-full mb-3"
                  style={{ backgroundColor: 'rgba(107, 112, 65, 0.1)' }}
                >
                  <Calendar className="w-6 h-6" style={{ color: '#6B7041' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: '#3A3A3A' }}>
                  Registro diario (5 días)
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div 
                  className="p-3 rounded-full mb-3"
                  style={{ backgroundColor: 'rgba(107, 112, 65, 0.1)' }}
                >
                  <MessageCircle className="w-6 h-6" style={{ color: '#6B7041' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: '#3A3A3A' }}>
                  Chat guiado
                </p>
              </div>
            </div>

            {/* Botón principal */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setLocation("/onboarding/intake")}
                data-testid="button-empezar-diagnostico"
                style={{
                  backgroundColor: '#A15C38',
                  color: 'white',
                  padding: '1rem 2.5rem',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
                className="hover:opacity-90 transition-opacity"
              >
                Empezar mi diagnóstico gratuito
              </Button>
            </div>

            {/* Nota final */}
            <p 
              className="text-sm text-center mt-6"
              style={{ color: '#6F6E66' }}
            >
              Sin tarjeta de crédito requerida para tu prueba gratuita
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
