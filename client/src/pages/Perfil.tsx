import { useState } from "react";
import { useLocation } from "wouter";
import { User, Calendar, Activity, Weight, Ruler, ClipboardList } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function Perfil() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
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
              className="max-w-2xl mx-auto rounded-lg p-4 text-left text-sm"
              style={{ backgroundColor: '#FFF9E6', border: '1px solid #FFE082' }}
            >
              <p style={{ color: '#6F6E66' }}>
                <strong>Aviso importante:</strong> Esta herramienta es únicamente educativa y no almacena datos médicos. 
                No sustituye la consulta con un profesional de salud. Para un seguimiento médico real, consulta a tu médico.
              </p>
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
