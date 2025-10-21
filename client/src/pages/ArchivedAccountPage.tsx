import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, ArrowRight, MessageCircle } from "lucide-react";

// Declarar tipo para Chatbase
declare global {
  interface Window {
    Chatbase?: {
      open: () => void;
    };
  }
}

interface ArchivedAccountPageProps {
  userName?: string;
}

export default function ArchivedAccountPage({ userName }: ArchivedAccountPageProps) {
  const [, setLocation] = useLocation();

  const handleReactivate = () => {
    setLocation("/onboarding/checkout");
  };

  const handleSupport = () => {
    // Abre el chat de soporte de Chatbase
    if (window.Chatbase) {
      window.Chatbase.open();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardContent className="pt-12 pb-8 px-8">
          {/* Ícono de hoja */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Título principal */}
          <h1 
            className="text-3xl font-serif text-center text-primary mb-6"
            data-testid="heading-archived"
          >
            Tu cuenta ha sido archivada
          </h1>

          {/* Texto principal */}
          <div className="space-y-4 text-center mb-8">
            <p className="text-lg">
              Hola <strong>{userName || "usuario"}</strong>,
            </p>
            
            <p className="text-base leading-relaxed text-muted-foreground">
              Tu periodo de prueba de 7 días finalizó y tu cuenta fue archivada automáticamente 
              para proteger tus datos y tu progreso.
            </p>

            <p className="text-base leading-relaxed">
              <strong>No has perdido nada:</strong> tus registros, respuestas y reportes están 
              guardados y listos para continuar cuando decidas reactivarte.
            </p>
          </div>

          {/* Botón de reactivación */}
          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={handleReactivate}
              className="text-base px-8 py-6 h-auto"
              data-testid="button-reactivate"
            >
              Reactivar mi acceso ahora por $5 USD/mes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-sm text-center text-muted-foreground mb-4">
            y retoma desde donde quedaste con tu informe funcional y chat personalizado.
          </p>

          {/* Enlace de soporte */}
          <div className="flex justify-center items-center gap-2 mb-8 pt-4 border-t">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              ¿Necesitas ayuda para volver a acceder?{" "}
              <button
                onClick={handleSupport}
                className="text-primary hover:underline font-medium"
                data-testid="button-support"
              >
                Nuestro equipo de soporte puede asistirte aquí mismo
              </button>
            </p>
          </div>

          {/* Frase de cierre */}
          <div className="bg-primary/5 rounded-lg p-6 text-center border-l-4 border-primary">
            <p className="text-base italic text-primary leading-relaxed">
              "Sanar no es empezar de cero,<br />
              es retomar el camino con más claridad."
            </p>
            <span className="text-2xl mt-2 inline-block">🌱</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
