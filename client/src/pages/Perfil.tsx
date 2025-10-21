import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { User, Calendar, Activity, Weight, Ruler, ClipboardList, CreditCard, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Day7TrialModal from "@/components/Day7TrialModal";
import { TrialStatus } from "@/types/trial";

export default function Perfil() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  
  // TODO: Obtener el userId real del usuario logueado
  const userId = "d48af8be-dabe-4b0e-94cb-48eadfb0fbe8"; // Usuario de prueba

  // Obtener estado del trial
  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial-status', userId],
    enabled: !!userId,
  });

  // Detectar retorno desde Stripe Portal
  useEffect(() => {
    const checkPortalReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fromPortal = urlParams.get('from');
      const previousStatus = urlParams.get('prevStatus'); // Estado previo antes de ir al portal
      
      if (fromPortal === 'portal') {
        // Usuario regresó del portal de Stripe
        // Verificar el estado de la suscripción
        try {
          const response = await fetch(`/api/users/id/${userId}`);
          const user = await response.json();
          
          const currentStatus = user.subscriptionStatus;
          
          // Detectar cancelación
          if (currentStatus === 'canceled' || currentStatus === 'cancelled') {
            // Limpiar query params y redirigir
            window.history.replaceState({}, '', '/perfil');
            setLocation('/cancelacion-confirmada');
            return;
          }
          
          // Detectar reactivación: si el estado previo era cancelado y ahora es activo
          if (previousStatus === 'canceled' && currentStatus === 'active') {
            // Enviar email de reactivación
            try {
              await apiRequest('POST', '/api/notify-reactivation', { userId });
              console.log('✅ Email de reactivación enviado');
            } catch (error) {
              console.error('Error enviando email de reactivación:', error);
              // Continuar aunque falle el email
            }
            
            // Limpiar query params y redirigir
            window.history.replaceState({}, '', '/perfil');
            setLocation('/reactivacion-confirmada');
            return;
          }
          
          // Si regresó del portal pero no hubo cambios, limpiar query params
          if (fromPortal === 'portal') {
            window.history.replaceState({}, '', '/perfil');
          }
        } catch (error) {
          console.error('Error verificando estado de suscripción:', error);
        }
      }
    };
    
    checkPortalReturn();
  }, [userId, setLocation]);
  
  const [formData, setFormData] = useState({
    edad: "",
    genero: "",
    peso: "",
    altura: "",
    actividadFisica: "",
    sintomas: [] as string[],
    historialMedico: "",
    medicamentos: "",
  });

  const sintomasOptions = [
    "Cansancio después de comer",
    "Antojos de dulce o carbohidratos",
    "Dificultad para perder peso",
    "Hinchazón abdominal",
    "Problemas digestivos",
    "Insomnio o sueño interrumpido",
    "Cambios de humor o irritabilidad",
    "Niebla mental o falta de concentración",
  ];

  const handleSintomaToggle = (sintoma: string) => {
    setFormData(prev => ({
      ...prev,
      sintomas: prev.sintomas.includes(sintoma)
        ? prev.sintomas.filter(s => s !== sintoma)
        : [...prev.sintomas, sintoma]
    }));
  };

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true);
    
    try {
      // Obtener el estado actual de la suscripción antes de ir al portal
      const userResponse = await fetch(`/api/users/id/${userId}`);
      const userData = await userResponse.json();
      const currentStatus = userData.subscriptionStatus || 'unknown';
      
      const response = await apiRequest('POST', '/api/create-portal-session', { userId, currentStatus });
      const data = await response.json();
      
      if (data.url) {
        // Redirigir al portal de Stripe
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió URL del portal");
      }
    } catch (error: any) {
      console.error("Error abriendo portal:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo abrir el portal de gestión. Intenta nuevamente.",
        variant: "destructive",
      });
      setIsLoadingPortal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Pass data via URL state to Analisis page (no storage)
      const queryParams = new URLSearchParams({
        genero: formData.genero,
      }).toString();
      
      toast({
        title: "Perfil completado",
        description: "Puedes continuar con el análisis de sangre.",
      });

      // Redirect to blood analysis page with gender param
      setTimeout(() => {
        setLocation(`/analisis?${queryParams}`);
      }, 800);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo continuar. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      
      {/* Modal del Día 7 */}
      {trialStatus && (
        <Day7TrialModal
          daysRemaining={trialStatus.daysRemaining}
          hasAccess={trialStatus.hasAccess}
          isActive={trialStatus.isActive}
        />
      )}
      
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 
              className="text-3xl sm:text-4xl font-bold mb-3" 
              style={{ color: '#3E3E2E' }}
            >
              Tu Perfil de Salud
            </h1>
            <p className="text-base sm:text-lg mb-4" style={{ color: '#6F6E66' }}>
              Completa tu información para recibir recomendaciones personalizadas
            </p>
            
            {/* Educational Disclaimer */}
            <div 
              className="max-w-2xl mx-auto rounded-lg p-4 text-left text-sm mb-8"
              style={{ backgroundColor: '#FFF9E6', border: '1px solid #FFE082' }}
            >
              <p style={{ color: '#6F6E66' }}>
                <strong>Aviso importante:</strong> Esta herramienta es únicamente educativa y no almacena datos médicos. 
                No sustituye la consulta con un profesional de salud. Para un seguimiento médico real, consulta a tu médico.
              </p>
            </div>

            {/* Trial Counter - Solo visible si está en trial */}
            {trialStatus?.isTrialing && trialStatus?.daysRemaining > 0 && (
              <div className="max-w-2xl mx-auto mb-8">
                <div 
                  className="rounded-xl p-6 text-center"
                  style={{ 
                    backgroundColor: '#F0F7E6',
                    border: '2px solid #6B7041',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-6 h-6" style={{ color: '#6B7041' }} />
                    <h3 className="text-xl font-bold" style={{ color: '#3E3E2E' }}>
                      🕓 Te quedan {trialStatus.daysRemaining} {trialStatus.daysRemaining === 1 ? 'día' : 'días'} de tu acceso gratuito
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: '#6F6E66' }}>
                    Estás explorando TransformaDiabetes sin costo. Después de tu periodo gratuito, tu suscripción se activará automáticamente por $5 USD/mes.
                  </p>
                </div>
              </div>
            )}

            {/* Trial Expired Message - Solo visible si trial expiró y no hay suscripción */}
            {trialStatus?.trialExpired && !trialStatus?.isActive && (
              <div className="max-w-2xl mx-auto mb-8">
                <div 
                  className="rounded-xl p-8 text-center"
                  style={{ 
                    backgroundColor: '#FFF9E6',
                    border: '2px solid #FFB74D',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#3E3E2E' }}>
                    🌿 Tu periodo gratuito ha finalizado
                  </h3>
                  <p className="text-base mb-6 leading-relaxed" style={{ color: '#6F6E66' }}>
                    Para continuar recibiendo tus reportes personalizados y soporte funcional, activa tu suscripción por $5 USD/mes.
                  </p>
                  <button
                    onClick={() => setLocation('/onboarding/checkout')}
                    className="px-8 py-3 rounded-lg font-semibold text-lg transition"
                    style={{ 
                      backgroundColor: '#A15C38',
                      color: '#FFFFFF',
                      border: 'none'
                    }}
                    data-testid="button-activate-subscription"
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Activar suscripción
                  </button>
                  <p className="text-xs mt-3" style={{ color: '#9A998C' }}>
                    Solo $5 USD/mes • Cancela cuando quieras
                  </p>
                </div>
              </div>
            )}

            {/* Subscription Management Section */}
            <div className="max-w-2xl mx-auto mb-8">
              <div 
                className="rounded-xl p-8 text-left"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E6E3D9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <h2 
                  className="text-2xl font-bold mb-4" 
                  style={{ color: '#3E3E2E' }}
                >
                  Gestiona tu suscripción
                </h2>
                
                <p className="text-base mb-6 leading-relaxed" style={{ color: '#6F6E66' }}>
                  Tu proceso con TransformaDiabetes está diseñado para acompañarte paso a paso, sin compromisos ni presiones.
                  Puedes actualizar tu método de pago o cancelar tu suscripción en cualquier momento, de forma segura, a través de nuestro portal de Stripe.
                </p>

                {/* Security Section */}
                <div className="mb-6 pl-4 border-l-2" style={{ borderColor: '#6B7041' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#3E3E2E' }}>
                    🔒 Seguridad y transparencia:
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6F6E66' }}>
                    El manejo de tus pagos y cancelaciones se realiza directamente con Stripe, una de las plataformas más seguras del mundo.
                    Nosotros no almacenamos datos de tus tarjetas ni realizamos cargos fuera de tu control.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="mb-6">
                  <button
                    onClick={handleManageSubscription}
                    disabled={isLoadingPortal}
                    className="w-full px-6 py-3 rounded-lg font-semibold transition text-base disabled:opacity-50"
                    style={{ 
                      backgroundColor: '#6B7041',
                      color: '#FFFFFF',
                      border: 'none'
                    }}
                    data-testid="button-manage-subscription"
                    onMouseEnter={(e) => !isLoadingPortal && (e.currentTarget.style.backgroundColor = '#5A5E35')}
                    onMouseLeave={(e) => !isLoadingPortal && (e.currentTarget.style.backgroundColor = '#6B7041')}
                  >
                    {isLoadingPortal ? "Abriendo portal seguro..." : "👉 Gestionar mi suscripción"}
                  </button>
                  <p className="text-xs mt-2 text-center" style={{ color: '#9A998C' }}>
                    (Este botón abrirá una nueva ventana segura de Stripe.)
                  </p>
                </div>

                {/* Important Note */}
                <div 
                  className="rounded-lg p-4 mb-4"
                  style={{ backgroundColor: '#F9F7F2', border: '1px solid #E6E3D9' }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: '#3E3E2E' }}>
                    Nota importante:
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6F6E66' }}>
                    Al cancelar, conservarás el acceso a tu módulo actual hasta el final del periodo que ya pagaste.
                    Podrás reactivar tu suscripción en cualquier momento si deseas continuar con tu proceso funcional.
                  </p>
                </div>

                {/* Closing Message */}
                <p className="text-base text-center italic font-medium" style={{ color: '#6B7041' }}>
                  Tu cuerpo no está roto, está buscando equilibrio.
                </p>
              </div>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="rounded-xl p-6 sm:p-8"
            style={{ 
              backgroundColor: '#F8F7F3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            {/* Basic Info */}
            <div className="mb-8">
              <h2 
                className="text-xl font-bold mb-4 flex items-center gap-2" 
                style={{ color: '#3E3E2E' }}
              >
                <User className="w-5 h-5" style={{ color: '#6B7041' }} />
                Información Básica
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                    Edad
                  </label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                    placeholder="Ej: 35"
                    required
                    data-testid="input-edad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                    Género
                  </label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                    required
                    data-testid="select-genero"
                  >
                    <option value="">Selecciona</option>
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Physical Metrics */}
            <div className="mb-8">
              <h2 
                className="text-xl font-bold mb-4 flex items-center gap-2" 
                style={{ color: '#3E3E2E' }}
              >
                <Activity className="w-5 h-5" style={{ color: '#6B7041' }} />
                Métricas Físicas
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                    <Weight className="w-4 h-4 inline mr-1" />
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                    placeholder="Ej: 70.5"
                    required
                    data-testid="input-peso"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                    <Ruler className="w-4 h-4 inline mr-1" />
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.altura}
                    onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                    placeholder="Ej: 165"
                    required
                    data-testid="input-altura"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                  Nivel de Actividad Física
                </label>
                <select
                  value={formData.actividadFisica}
                  onChange={(e) => setFormData({ ...formData, actividadFisica: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                  required
                  data-testid="select-actividad"
                >
                  <option value="">Selecciona</option>
                  <option value="sedentario">Sedentario (poco o nada de ejercicio)</option>
                  <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                  <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                  <option value="activo">Activo (ejercicio 6-7 días/semana)</option>
                  <option value="muy_activo">Muy activo (ejercicio intenso diario)</option>
                </select>
              </div>
            </div>

            {/* Symptoms */}
            <div className="mb-8">
              <h2 
                className="text-xl font-bold mb-4 flex items-center gap-2" 
                style={{ color: '#3E3E2E' }}
              >
                <ClipboardList className="w-5 h-5" style={{ color: '#6B7041' }} />
                Síntomas Actuales
              </h2>
              
              <p className="text-sm mb-4" style={{ color: '#6F6E66' }}>
                Selecciona los síntomas que experimentas actualmente
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sintomasOptions.map((sintoma) => (
                  <label
                    key={sintoma}
                    className="flex items-center gap-2 p-3 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: formData.sintomas.includes(sintoma) ? '#E8F5E9' : '#FFFFFF',
                      border: `2px solid ${formData.sintomas.includes(sintoma) ? '#6B7041' : '#D4D3CC'}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.sintomas.includes(sintoma)}
                      onChange={() => handleSintomaToggle(sintoma)}
                      className="w-4 h-4"
                      data-testid={`checkbox-${sintoma.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <span className="text-sm" style={{ color: '#4B4B3B' }}>
                      {sintoma}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Medical History */}
            <div className="mb-8">
              <h2 
                className="text-xl font-bold mb-4 flex items-center gap-2" 
                style={{ color: '#3E3E2E' }}
              >
                <Calendar className="w-5 h-5" style={{ color: '#6B7041' }} />
                Historial Médico
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                    Condiciones médicas previas o actuales
                  </label>
                  <textarea
                    value={formData.historialMedico}
                    onChange={(e) => setFormData({ ...formData, historialMedico: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                    rows={3}
                    placeholder="Ej: Prediabetes, hipotiroidismo, resistencia a la insulina..."
                    data-testid="textarea-historial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                    Medicamentos actuales
                  </label>
                  <textarea
                    value={formData.medicamentos}
                    onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                    rows={3}
                    placeholder="Ej: Metformina 500mg, Levotiroxina 50mcg..."
                    data-testid="textarea-medicamentos"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 rounded-lg font-bold transition text-base disabled:opacity-50"
                style={{ 
                  backgroundColor: '#A15C38',
                  color: '#FFFFFF'
                }}
                data-testid="button-guardar-perfil"
                onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#8C4E30')}
                onMouseLeave={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#A15C38')}
              >
                {isSaving ? "Guardando..." : "Guardar y Continuar →"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
