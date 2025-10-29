import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CuestionarioData {
  nombre: string;
  email: string;
  edad: string;
  peso_actual: string;
  altura: string;
  preocupacion_principal: string;
  estado_actual: string;
  objetivo: string;
  tiene_diabetes: string;
  nivel_energia: string;
  sintomas_principales: string;
}

export default function CuestionarioBreve() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState<CuestionarioData>({
    nombre: "",
    email: "",
    edad: "",
    peso_actual: "",
    altura: "",
    preocupacion_principal: "",
    estado_actual: "",
    objetivo: "",
    tiene_diabetes: "",
    nivel_energia: "5",
    sintomas_principales: "",
  });

  useEffect(() => {
    // Generar o recuperar userId para trial
    let userId = localStorage.getItem('tm_user_id');
    if (!userId) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      userId = `trial_${timestamp}_${random}`;
      localStorage.setItem('tm_user_id', userId);
    }
  }, []);

  const saveFormMutation = useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('tm_user_id');
      
      // Enviar datos simplificados al endpoint de intake-form
      const intakeData = {
        userId,
        nombre: data.nombre,
        email: data.email,
        edad: data.edad,
        peso_actual: data.peso_actual,
        altura: data.altura,
        nivel_energia: data.nivel_energia,
        sistema_gastrointestinal: data.sintomas_principales,
        informacion_adicional: `Preocupación principal: ${data.preocupacion_principal}\nEstado actual: ${data.estado_actual}\nObjetivo: ${data.objetivo}\nDiabetes: ${data.tiene_diabetes}`,
        // Campos requeridos con valores por defecto
        direccion: "",
        ciudad: "",
        estado: "",
        pais: "",
        codigo_postal: "",
        telefono_dia: "",
        telefono_celular: "",
        telefono_noche: "",
        referido_por: "Cuestionario simplificado web",
        fecha_nacimiento: "",
        peso_hace_ano: "",
        tipo_sangre: "",
        peso_nacer: "",
        orden_nacimiento: "",
        estado_civil: "",
        ocupacion: "",
        viajes_fuera: "",
        cambios_recientes: "",
        sistema_cardiovascular: "",
        sistema_hormonal: "",
        sistema_inmunologico: "",
        alimentos_regulares: "",
        dieta_especial: "",
        porcentaje_comidas_caseras: "",
        alimentos_evitados: "",
        sintomas_despues_comer: "",
        frecuencia_evacuaciones: "Una vez al día",
        consistencia_evacuaciones: "",
        color_evacuaciones: "",
        historial_intoxicaciones: "",
        exposicion_quimicos: "",
        ultima_visita_dental: "",
        amalgamas_mercurio: "",
        problemas_encias: "",
        satisfecho_sueno: "",
        horas_sueno: "",
        tiempo_conciliar_sueno: "",
        estado_animo: "",
        momento_mejor_bienestar: "",
        apoyo_familiar: "",
        rol_espiritualidad: "",
        a1c: "",
        colesterol_total: "",
        hdl: "",
        ldl: "",
        trigliceridos: "",
        hemoglobina: "",
        otros_analisis: ""
      };

      const response = await apiRequest('POST', '/api/intake-form', intakeData);
      return await response.json();
    },
    onSuccess: async (data: any) => {
      // Marcar intake como completado
      localStorage.setItem('tm_intake_done', 'true');
      
      // Actualizar userId si viene del servidor
      const userId = data.userId || localStorage.getItem('tm_user_id');
      if (data.userId) {
        localStorage.setItem('tm_user_id', data.userId);
      }
      
      // Guardar fecha de inicio del trial
      if (!localStorage.getItem('tm_trial_start')) {
        localStorage.setItem('tm_trial_start', String(Date.now()));
      }
      
      toast({
        title: "🧠 Analizando tu información...",
        description: "Estamos creando tu guía funcional personalizada. Esto puede tomar 15-20 segundos.",
        duration: 25000,
      });
      
      try {
        // Generar reporte con módulo 1
        await apiRequest('POST', '/api/generate-report', {
          userId,
          moduleNumber: 1
        });
        
        localStorage.setItem('tm_informe_ready', 'true');
        
        toast({
          title: "🎉 ¡Listo!",
          description: "Tu guía funcional está lista. Te mostraremos los resultados ahora...",
        });
        
        setTimeout(() => {
          setLocation('/onboarding/informe-inicial');
        }, 1000);
      } catch (error) {
        console.error('Error generando reporte:', error);
        toast({
          title: "⚠️ Error generando informe",
          description: "Hubo un problema. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('Error guardando cuestionario:', error);
      toast({
        title: "❌ Error al guardar",
        description: "Hubo un problema guardando tu información. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
  });

  const handleChange = (field: keyof CuestionarioData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validación por paso
    if (currentStep === 1) {
      if (!formData.nombre || !formData.email) {
        toast({
          title: "Campos requeridos",
          description: "Por favor completa nombre y email para continuar.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.preocupacion_principal || !formData.estado_actual || !formData.objetivo) {
        toast({
          title: "Campos requeridos",
          description: "Por favor responde las 3 preguntas para continuar.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.tiene_diabetes || !formData.sintomas_principales) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa toda la información para obtener tu guía personalizada.",
        variant: "destructive",
      });
      return;
    }
    
    saveFormMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div 
          className="max-w-2xl mx-auto px-4 sm:px-6"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E6E3D9',
            padding: '2.5rem',
            margin: '2rem auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
          }}
        >
          {/* Indicador de progreso */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium" style={{ color: '#6F6E66' }}>
                Paso {currentStep} de {totalSteps}
              </span>
              <span className="text-sm font-medium" style={{ color: '#556B2F' }}>
                {Math.round((currentStep / totalSteps) * 100)}% completado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: '#556B2F',
                  width: `${(currentStep / totalSteps) * 100}%`
                }}
              />
            </div>
          </div>

          <h1 
            className="text-2xl md:text-3xl font-bold text-center mb-6"
            style={{ color: '#556B2F' }}
          >
            {currentStep === 1 && "Cuéntanos sobre ti"}
            {currentStep === 2 && "Tu situación de salud"}
            {currentStep === 3 && "Información adicional"}
          </h1>

          <form className="space-y-6">
            {/* PASO 1: Información personal */}
            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="nombre" className="text-sm font-medium" style={{ color: '#3A3A3A' }}>
                    ¿Cuál es tu nombre? *
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    placeholder="Ej: María García"
                    className="mt-1"
                    data-testid="input-nombre"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#3A3A3A' }}>
                    ¿Cuál es tu email? *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="mt-1"
                    data-testid="input-email"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edad" className="text-sm font-medium" style={{ color: '#3A3A3A' }}>
                      Edad
                    </Label>
                    <Input
                      id="edad"
                      type="number"
                      value={formData.edad}
                      onChange={(e) => handleChange('edad', e.target.value)}
                      placeholder="45"
                      className="mt-1"
                      data-testid="input-edad"
                    />
                  </div>

                  <div>
                    <Label htmlFor="peso" className="text-sm font-medium" style={{ color: '#3A3A3A' }}>
                      Peso (kg)
                    </Label>
                    <Input
                      id="peso"
                      type="number"
                      value={formData.peso_actual}
                      onChange={(e) => handleChange('peso_actual', e.target.value)}
                      placeholder="75"
                      className="mt-1"
                      data-testid="input-peso"
                    />
                  </div>

                  <div>
                    <Label htmlFor="altura" className="text-sm font-medium" style={{ color: '#3A3A3A' }}>
                      Altura (cm)
                    </Label>
                    <Input
                      id="altura"
                      type="number"
                      value={formData.altura}
                      onChange={(e) => handleChange('altura', e.target.value)}
                      placeholder="165"
                      className="mt-1"
                      data-testid="input-altura"
                    />
                  </div>
                </div>
              </>
            )}

            {/* PASO 2: Preguntas de diagnóstico */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: '#3A3A3A' }}>
                    1️⃣ ¿Qué área de tu salud te preocupa más últimamente? *
                  </Label>
                  <RadioGroup
                    value={formData.preocupacion_principal}
                    onValueChange={(value) => handleChange('preocupacion_principal', value)}
                  >
                    {["Glucosa / resistencia a la insulina", "Digestión / inflamación", "Hormonas / peso", "Estrés / sueño"].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                        <RadioGroupItem value={option} id={option} data-testid={`radio-preocupacion-${option}`} />
                        <Label htmlFor={option} className="cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: '#3A3A3A' }}>
                    2️⃣ ¿Qué describe mejor tu estado actual? *
                  </Label>
                  <RadioGroup
                    value={formData.estado_actual}
                    onValueChange={(value) => handleChange('estado_actual', value)}
                  >
                    {[
                      "Me cuesta bajar el azúcar o mantenerla estable",
                      "Tengo antojos frecuentes de azúcar o carbohidratos",
                      "Siento inflamación abdominal o digestiva",
                      "Estoy cansado aunque duerma bien"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                        <RadioGroupItem value={option} id={option} data-testid={`radio-estado-${option}`} />
                        <Label htmlFor={option} className="cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: '#3A3A3A' }}>
                    3️⃣ ¿Qué te gustaría lograr? *
                  </Label>
                  <RadioGroup
                    value={formData.objetivo}
                    onValueChange={(value) => handleChange('objetivo', value)}
                  >
                    {[
                      "Controlar mis niveles de azúcar",
                      "Revertir mi resistencia a la insulina o diabetes tipo 2",
                      "Reducir la inflamación y el cansancio",
                      "Recuperar mi energía y equilibrio hormonal"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                        <RadioGroupItem value={option} id={option} data-testid={`radio-objetivo-${option}`} />
                        <Label htmlFor={option} className="cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {/* PASO 3: Información médica */}
            {currentStep === 3 && (
              <>
                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: '#3A3A3A' }}>
                    ¿Tienes diagnóstico de diabetes tipo 2? *
                  </Label>
                  <RadioGroup
                    value={formData.tiene_diabetes}
                    onValueChange={(value) => handleChange('tiene_diabetes', value)}
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                      <RadioGroupItem value="Si" id="diabetes-si" data-testid="radio-diabetes-si" />
                      <Label htmlFor="diabetes-si" className="cursor-pointer flex-1">
                        Sí, tengo diagnóstico confirmado
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                      <RadioGroupItem value="Prediabetes" id="diabetes-pre" data-testid="radio-diabetes-pre" />
                      <Label htmlFor="diabetes-pre" className="cursor-pointer flex-1">
                        Tengo prediabetes o resistencia a la insulina
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                      <RadioGroupItem value="No" id="diabetes-no" data-testid="radio-diabetes-no" />
                      <Label htmlFor="diabetes-no" className="cursor-pointer flex-1">
                        No, pero me preocupa mi salud metabólica
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="energia" className="text-base font-semibold mb-3 block" style={{ color: '#3A3A3A' }}>
                    ¿Cómo calificarías tu nivel de energía general? (1 = muy bajo, 10 = excelente)
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm" style={{ color: '#6F6E66' }}>1</span>
                    <Input
                      id="energia"
                      type="range"
                      min="1"
                      max="10"
                      value={formData.nivel_energia}
                      onChange={(e) => handleChange('nivel_energia', e.target.value)}
                      className="flex-1"
                      data-testid="input-energia"
                    />
                    <span className="text-sm" style={{ color: '#6F6E66' }}>10</span>
                    <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: '#556B2F' }}>
                      {formData.nivel_energia}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sintomas" className="text-base font-semibold mb-2 block" style={{ color: '#3A3A3A' }}>
                    Describe brevemente los síntomas principales que experimentas *
                  </Label>
                  <p className="text-sm mb-2" style={{ color: '#6F6E66' }}>
                    Por ejemplo: cansancio después de comer, inflamación abdominal, antojos de azúcar, etc.
                  </p>
                  <Textarea
                    id="sintomas"
                    value={formData.sintomas_principales}
                    onChange={(e) => handleChange('sintomas_principales', e.target.value)}
                    placeholder="Describe tus síntomas principales aquí..."
                    rows={4}
                    className="mt-1"
                    data-testid="input-sintomas"
                  />
                </div>
              </>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between items-center pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  data-testid="button-atras"
                >
                  ← Atrás
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto"
                  style={{
                    backgroundColor: '#556B2F',
                    color: 'white'
                  }}
                  data-testid="button-siguiente"
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saveFormMutation.isPending}
                  className="ml-auto"
                  style={{
                    backgroundColor: '#A15C38',
                    color: 'white'
                  }}
                  data-testid="button-enviar"
                >
                  {saveFormMutation.isPending ? "Generando tu guía..." : "Ver mi guía funcional 🎯"}
                </Button>
              )}
            </div>
          </form>

          <p 
            className="text-xs text-center mt-6"
            style={{ color: '#6F6E66' }}
          >
            🔒 Tu información está protegida y solo se usa para personalizar tu guía funcional
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
