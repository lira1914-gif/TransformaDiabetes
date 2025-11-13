import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatReminderStatus } from "@/types/trial";

export default function ChatReminderBanner() {
  const [, navigate] = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);
  
  const userId = localStorage.getItem('tm_user_id');

  // Obtener fecha actual en formato YYYYMMDD
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const dismissKey = `tm_chat_reminder_dismissed_${today}`;

  // Verificar si ya fue dismissado hoy
  const wasDismissedToday = localStorage.getItem(dismissKey) === 'true';

  const { data: reminderStatus } = useQuery<ChatReminderStatus>({
    queryKey: ['/api/chat-reminder-status', userId],
    enabled: !!userId && !isDismissed && !wasDismissedToday,
  });

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, 'true');
    setIsDismissed(true);
  };

  const handleGoToChat = () => {
    navigate('/chat-semanal');
  };

  // No mostrar si:
  // - No hay userId
  // - Ya fue dismissado en state
  // - Ya fue dismissado en localStorage hoy
  // - No necesita recordatorio
  if (!userId || isDismissed || wasDismissedToday || !reminderStatus?.needsReminder) {
    return null;
  }

  // Preparar texto de horas
  const hoursText = reminderStatus.hoursSinceLastChat 
    ? `Hace ${reminderStatus.hoursSinceLastChat} horas` 
    : 'Hace tiempo';

  return (
    <Card 
      className="mx-4 mb-4 border-accent/30 bg-accent/5"
      data-testid="banner-chat-reminder"
    >
      <div className="flex items-center gap-3 p-4">
        <MessageCircle 
          className="h-6 w-6 text-accent flex-shrink-0" 
          data-testid="icon-message-circle"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground" data-testid="text-reminder-message">
            {hoursText} que no hablas con Marvin. ¿Cómo te sientes hoy?
          </p>
        </div>
        <Button 
          onClick={handleGoToChat}
          size="sm"
          className="flex-shrink-0"
          data-testid="button-go-to-chat"
        >
          Ir al chat
        </Button>
        <Button 
          onClick={handleDismiss}
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          data-testid="button-dismiss-reminder"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
