import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageCircle, Lock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TrialStatus } from "@/types/trial";
import Header from "@/components/Header";
import Day7TrialModal from "@/components/Day7TrialModal";
import Day6TrialModal from "@/components/Day6TrialModal";
import Day8Banner from "@/components/Day8Banner";
import Day7Banner from "@/components/Day7Banner";
import Day5Banner from "@/components/Day5Banner";

interface WeeklyCheckin {
  id: string;
  userId: string;
  inputText: string;
  responseText: string;
  emotionTags: string[];
  systemsDetected: string[];
  createdAt: string;
}

const SYSTEM_EMOJI: Record<string, string> = {
  fecar: "🥦",
  digestión: "🥦",
  sueño: "🌙",
  azúcar: "🍯",
  energía: "🌿",
  hidratación: "💧",
  estrés: "🧘"
};

export default function ChatSemanal() {
  const [message, setMessage] = useState("");
  const [, setLocation] = useLocation();
  const userId = "d48af8be-dabe-4b0e-94cb-48eadfb0fbe8"; // Usuario de prueba

  // Verificar estado del trial
  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });

  const { data: checkins, isLoading: loadingHistory } = useQuery<WeeklyCheckin[]>({
    queryKey: ['/api/weekly-checkins', userId],
    enabled: !!userId,
  });

  const sendMessage = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/weekly-checkin', { 
        userId, 
        message: text 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-checkins', userId] });
      setMessage("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage.mutate(message.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modal del Día 7 */}
      {trialStatus && (
        <Day7TrialModal
          daysRemaining={trialStatus.daysRemaining}
          hasAccess={trialStatus.hasAccess}
          isActive={trialStatus.isActive}
        />
      )}

      {/* Modal del Día 6 */}
      {trialStatus && (
        <Day6TrialModal
          daysRemaining={trialStatus.daysRemaining}
          hasAccess={trialStatus.hasAccess}
          isActive={trialStatus.isActive}
        />
      )}

      {/* Banner del Día 8+ */}
      {trialStatus && (
        <Day8Banner
          daysRemaining={trialStatus.daysRemaining}
          isActive={trialStatus.isActive}
        />
      )}

      {/* Banner del Día 7 */}
      {trialStatus && (
        <Day7Banner
          daysRemaining={trialStatus.daysRemaining}
          isActive={trialStatus.isActive}
        />
      )}

      {/* Banner del Día 5 */}
      {trialStatus && (
        <Day5Banner
          daysRemaining={trialStatus.daysRemaining}
          isActive={trialStatus.isActive}
        />
      )}
      
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Chat Semanal con Marvin Lira IA 🌿
          </h1>
          <p className="text-muted-foreground">
            Comparte cómo te sentiste esta semana y recibe orientación funcional personalizada
          </p>
        </div>

        {/* Mensaje de bloqueo si el trial expiró (día 7 o posterior) */}
        {trialStatus && trialStatus.daysRemaining === 0 && !trialStatus.isActive && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Lock className="h-5 w-5" />
                Chat bloqueado - Día 7
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-800 mb-4">
                Tu periodo gratuito de 7 días ha finalizado. Para continuar usando el chat semanal con Marvin Lira IA y recibir orientación funcional personalizada, necesitas activar tu suscripción.
              </p>
              <Button 
                onClick={() => setLocation('/onboarding/checkout')}
                className="w-full sm:w-auto"
                data-testid="button-activate-from-chat"
              >
                Activar suscripción por $5 USD/mes
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Formulario de envío y historial - Solo visible si tiene acceso (días 1-6 o suscripción activa) */}
        {trialStatus && (trialStatus.isActive || trialStatus.daysRemaining > 0) && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  ¿Cómo te sentiste esta semana?
                </CardTitle>
                <CardDescription>
                  Comparte tus síntomas, emociones o cualquier cambio que hayas notado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    data-testid="input-weekly-message"
                    placeholder="Ejemplo: Esta semana dormí mal y tuve muchos antojos de dulce..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <Button 
                    data-testid="button-send-message"
                    type="submit" 
                    disabled={!message.trim() || sendMessage.isPending}
                    className="w-full sm:w-auto"
                  >
                    {sendMessage.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Marvin está pensando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-semibold text-foreground">
                Historial de conversaciones
              </h2>

              {loadingHistory ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : !checkins || checkins.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                Aún no tienes conversaciones. ¡Comparte cómo te sientes arriba!
              </CardContent>
            </Card>
          ) : (
            checkins.map((checkin) => (
              <Card key={checkin.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium text-foreground mb-1">
                        Tu mensaje
                      </CardTitle>
                      <p className="text-sm text-muted-foreground italic">
                        "{checkin.inputText}"
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(checkin.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                        🌿
                      </div>
                      <span className="font-medium text-foreground">Marvin Lira IA</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {checkin.responseText}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3 border-t">
                    {checkin.systemsDetected.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Sistemas:
                        </span>
                        {checkin.systemsDetected.map((system, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary"
                            className="text-xs"
                            data-testid={`badge-system-${system}`}
                          >
                            {SYSTEM_EMOJI[system] || "•"} {system}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {checkin.emotionTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Emociones:
                        </span>
                        {checkin.emotionTags.map((emotion, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline"
                            className="text-xs"
                            data-testid={`badge-emotion-${emotion}`}
                          >
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
