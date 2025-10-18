import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface MomentoDia {
  momento: string;
  comida: string;
  estado_animo: string;
  evacuaciones: string;
}

interface DiaRegistroDetallado {
  dia: number;
  fecha: string;
  hora_dormir: string;
  hora_despertar: string;
  veces_desperto: string;
  momentos: MomentoDia[];
}

export default function Registro5DiasDetallado() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [diaActual, setDiaActual] = useState(1);
  const [diasCompletados, setDiasCompletados] = useState<DiaRegistroDetallado[]>([]);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora_dormir: "",
    hora_despertar: "",
    veces_desperto: "0",
    manana_comida: "",
    manana_animo: "",
    manana_evacuaciones: "",
    media_manana_comida: "",
    media_manana_animo: "",
    media_manana_evacuaciones: "",
    almuerzo_comida: "",
    almuerzo_animo: "",
    almuerzo_evacuaciones: "",
    media_tarde_comida: "",
    media_tarde_animo: "",
    media_tarde_evacuaciones: "",
    cena_comida: "",
    cena_animo: "",
    cena_evacuaciones: "",
    noche_comida: "",
    noche_animo: "",
    noche_evacuaciones: ""
  });

  useEffect(() => {
    console.log('🟢 Registro5DiasDetallado montado');
    const datosGuardados = localStorage.getItem('registro5dias_detallado');
    
    if (datosGuardados) {
      try {
        const diasGuardados = JSON.parse(datosGuardados);
        
        if (Array.isArray(diasGuardados) && diasGuardados.length > 0) {
          setDiasCompletados(diasGuardados);
          
          if (diasGuardados.length >= 5) {
            console.log('✅ Ya completó 5 días, mostrando pantalla de completado');
            setDiaActual(6);
          } else {
            setDiaActual(diasGuardados.length + 1);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const guardarDia = (e: React.FormEvent) => {
    e.preventDefault();
    
    // No requerimos validación estricta - el disclaimer indica que no es obligatorio llenar todo
    // La persona puede guardar el día aunque esté vacío si así lo desea
    
    const nuevoDia: DiaRegistroDetallado = {
      dia: diaActual,
      fecha: formData.fecha,
      hora_dormir: formData.hora_dormir,
      hora_despertar: formData.hora_despertar,
      veces_desperto: formData.veces_desperto,
      momentos: [
        {
          momento: "Mañana",
          comida: formData.manana_comida,
          estado_animo: formData.manana_animo,
          evacuaciones: formData.manana_evacuaciones
        },
        {
          momento: "Media mañana",
          comida: formData.media_manana_comida,
          estado_animo: formData.media_manana_animo,
          evacuaciones: formData.media_manana_evacuaciones
        },
        {
          momento: "Almuerzo",
          comida: formData.almuerzo_comida,
          estado_animo: formData.almuerzo_animo,
          evacuaciones: formData.almuerzo_evacuaciones
        },
        {
          momento: "Media tarde",
          comida: formData.media_tarde_comida,
          estado_animo: formData.media_tarde_animo,
          evacuaciones: formData.media_tarde_evacuaciones
        },
        {
          momento: "Cena",
          comida: formData.cena_comida,
          estado_animo: formData.cena_animo,
          evacuaciones: formData.cena_evacuaciones
        },
        {
          momento: "Noche",
          comida: formData.noche_comida,
          estado_animo: formData.noche_animo,
          evacuaciones: formData.noche_evacuaciones
        }
      ]
    };
    
    const nuevosDias = [...diasCompletados, nuevoDia];
    
    localStorage.setItem('registro5dias_detallado', JSON.stringify(nuevosDias));
    localStorage.setItem('tm_registro_dias', String(nuevosDias.length));
    
    setDiasCompletados(nuevosDias);
    
    if (nuevosDias.length >= 5) {
      toast({
        title: "✅ Registro completo",
        description: "Has completado tus 5 días de registro funcional.",
      });
      setTimeout(() => {
        setLocation('/onboarding/mes1');
      }, 1500);
    } else {
      toast({
        title: "✅ Día guardado",
        description: `Día ${diaActual} registrado correctamente. Continúa con el día ${diaActual + 1}.`,
      });
      setDiaActual(diaActual + 1);
      // Resetear formulario para el próximo día
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        hora_dormir: "",
        hora_despertar: "",
        veces_desperto: "0",
        manana_comida: "",
        manana_animo: "",
        manana_evacuaciones: "",
        media_manana_comida: "",
        media_manana_animo: "",
        media_manana_evacuaciones: "",
        almuerzo_comida: "",
        almuerzo_animo: "",
        almuerzo_evacuaciones: "",
        media_tarde_comida: "",
        media_tarde_animo: "",
        media_tarde_evacuaciones: "",
        cena_comida: "",
        cena_animo: "",
        cena_evacuaciones: "",
        noche_comida: "",
        noche_animo: "",
        noche_evacuaciones: ""
      });
    }
  };

  const reiniciarRegistro = () => {
    if (confirm('¿Seguro que deseas borrar todos los datos de registro?')) {
      localStorage.removeItem('registro5dias_detallado');
      localStorage.removeItem('tm_registro_dias');
      setDiasCompletados([]);
      setDiaActual(1);
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        hora_dormir: "",
        hora_despertar: "",
        veces_desperto: "0",
        manana_comida: "",
        manana_animo: "",
        manana_evacuaciones: "",
        media_manana_comida: "",
        media_manana_animo: "",
        media_manana_evacuaciones: "",
        almuerzo_comida: "",
        almuerzo_animo: "",
        almuerzo_evacuaciones: "",
        media_tarde_comida: "",
        media_tarde_animo: "",
        media_tarde_evacuaciones: "",
        cena_comida: "",
        cena_animo: "",
        cena_evacuaciones: "",
        noche_comida: "",
        noche_animo: "",
        noche_evacuaciones: ""
      });
      toast({
        title: "✅ Registro reiniciado",
        description: "Empezando desde el día 1",
      });
    }
  };

  if (diaActual > 5) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: '#fff',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#556B2F' }}>✅ Registro Completado</h2>
        <p>Has completado tus 5 días de registro funcional.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => setLocation('/onboarding/mes1')}
            style={{
              background: '#556B2F',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Ver mi progreso
          </button>
          <button
            onClick={reiniciarRegistro}
            style={{
              background: '#dc2626',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reiniciar registro
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '.7rem',
    border: '1px solid #E6E3D9',
    borderRadius: '6px',
    marginTop: '.3rem'
  };

  const labelStyle = {
    color: '#3A3A3A',
    fontWeight: 500,
    fontSize: '0.95rem'
  };

  const momentoStyle = {
    background: '#FAF8F4',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #E6E3D9'
  };

  return (
    <section style={{
      backgroundColor: '#FFFDF8',
      padding: '2rem 1rem',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: 'auto',
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0,0,0,.05)'
      }}>
        <h2 style={{ color: '#556B2F', textAlign: 'center', marginBottom: '0.5rem' }}>
          📝 Diario Funcional - Día {diaActual} de 5
        </h2>
        <p style={{ color: '#6F6E66', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Registra tu comida, estado de ánimo y evacuaciones para cada momento del día
        </p>
        <div style={{
          background: '#FFF9E6',
          border: '1px solid #F0C75E',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#8B6914', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
            ℹ️ <strong>Nota:</strong> No es necesario llenar todos los momentos del día. Entre más detalle registres, mejor podremos identificar patrones en tu salud.
          </p>
        </div>

        <form onSubmit={guardarDia} style={{ display: 'grid', gap: '1.5rem' }}>
          
          {/* Información del día */}
          <div style={{ 
            background: '#F0EDE6', 
            padding: '1.5rem', 
            borderRadius: '8px',
            border: '2px solid #A15C38'
          }}>
            <h3 style={{ color: '#A15C38', marginBottom: '1rem', fontSize: '1.1rem' }}>
              Información General del Día
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Fecha:</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  data-testid="input-fecha"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Hora de dormir (noche anterior):</label>
                  <input
                    type="text"
                    name="hora_dormir"
                    value={formData.hora_dormir}
                    onChange={handleChange}
                    placeholder="Ej. 10:30 PM"
                    data-testid="input-hora-dormir"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Hora de despertar:</label>
                  <input
                    type="text"
                    name="hora_despertar"
                    value={formData.hora_despertar}
                    onChange={handleChange}
                    placeholder="Ej. 6:30 AM"
                    data-testid="input-hora-despertar"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Veces que se despertó durante la noche:</label>
                <input
                  type="number"
                  name="veces_desperto"
                  value={formData.veces_desperto}
                  onChange={handleChange}
                  min="0"
                  data-testid="input-veces-desperto"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Mañana */}
          <div style={momentoStyle}>
            <h4 style={{ color: '#A15C38', marginBottom: '1rem' }}>☀️ Mañana</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Comida:</label>
                <textarea
                  name="manana_comida"
                  value={formData.manana_comida}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej. Huevos revueltos, pan integral, café..."
                  data-testid="textarea-manana-comida"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Estado de ánimo:</label>
                <input
                  type="text"
                  name="manana_animo"
                  value={formData.manana_animo}
                  onChange={handleChange}
                  placeholder="Ej. Con energía, cansado, alegre..."
                  data-testid="input-manana-animo"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Evacuaciones:</label>
                <input
                  type="text"
                  name="manana_evacuaciones"
                  value={formData.manana_evacuaciones}
                  onChange={handleChange}
                  placeholder="Ej. Normal, tipo 3-4 Bristol, sin evacuaciones..."
                  data-testid="input-manana-evacuaciones"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Media mañana */}
          <div style={momentoStyle}>
            <h4 style={{ color: '#A15C38', marginBottom: '1rem' }}>🍎 Media mañana</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Comida:</label>
                <textarea
                  name="media_manana_comida"
                  value={formData.media_manana_comida}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej. Fruta, yogurt, té..."
                  data-testid="textarea-media-manana-comida"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Estado de ánimo:</label>
                <input
                  type="text"
                  name="media_manana_animo"
                  value={formData.media_manana_animo}
                  onChange={handleChange}
                  placeholder="Ej. Normal, hambriento, enfocado..."
                  data-testid="input-media-manana-animo"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Evacuaciones:</label>
                <input
                  type="text"
                  name="media_manana_evacuaciones"
                  value={formData.media_manana_evacuaciones}
                  onChange={handleChange}
                  placeholder="Ej. Normal, sin evacuaciones..."
                  data-testid="input-media-manana-evacuaciones"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Almuerzo */}
          <div style={momentoStyle}>
            <h4 style={{ color: '#A15C38', marginBottom: '1rem' }}>🍽️ Almuerzo</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Comida:</label>
                <textarea
                  name="almuerzo_comida"
                  value={formData.almuerzo_comida}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej. Pollo, arroz, ensalada, agua..."
                  data-testid="textarea-almuerzo-comida"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Estado de ánimo:</label>
                <input
                  type="text"
                  name="almuerzo_animo"
                  value={formData.almuerzo_animo}
                  onChange={handleChange}
                  placeholder="Ej. Satisfecho, con energía..."
                  data-testid="input-almuerzo-animo"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Evacuaciones:</label>
                <input
                  type="text"
                  name="almuerzo_evacuaciones"
                  value={formData.almuerzo_evacuaciones}
                  onChange={handleChange}
                  placeholder="Ej. Normal, sin evacuaciones..."
                  data-testid="input-almuerzo-evacuaciones"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Media tarde */}
          <div style={momentoStyle}>
            <h4 style={{ color: '#A15C38', marginBottom: '1rem' }}>☕ Media tarde</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Comida:</label>
                <textarea
                  name="media_tarde_comida"
                  value={formData.media_tarde_comida}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej. Café, galletas, frutos secos..."
                  data-testid="textarea-media-tarde-comida"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Estado de ánimo:</label>
                <input
                  type="text"
                  name="media_tarde_animo"
                  value={formData.media_tarde_animo}
                  onChange={handleChange}
                  placeholder="Ej. Cansado, con antojos..."
                  data-testid="input-media-tarde-animo"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Evacuaciones:</label>
                <input
                  type="text"
                  name="media_tarde_evacuaciones"
                  value={formData.media_tarde_evacuaciones}
                  onChange={handleChange}
                  placeholder="Ej. Normal, sin evacuaciones..."
                  data-testid="input-media-tarde-evacuaciones"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Cena */}
          <div style={momentoStyle}>
            <h4 style={{ color: '#A15C38', marginBottom: '1rem' }}>🌙 Cena</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Comida:</label>
                <textarea
                  name="cena_comida"
                  value={formData.cena_comida}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej. Pescado, verduras, sopa..."
                  data-testid="textarea-cena-comida"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Estado de ánimo:</label>
                <input
                  type="text"
                  name="cena_animo"
                  value={formData.cena_animo}
                  onChange={handleChange}
                  placeholder="Ej. Relajado, cansado..."
                  data-testid="input-cena-animo"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Evacuaciones:</label>
                <input
                  type="text"
                  name="cena_evacuaciones"
                  value={formData.cena_evacuaciones}
                  onChange={handleChange}
                  placeholder="Ej. Normal, sin evacuaciones..."
                  data-testid="input-cena-evacuaciones"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Noche */}
          <div style={momentoStyle}>
            <h4 style={{ color: '#A15C38', marginBottom: '1rem' }}>🌃 Noche (tarde)</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Comida:</label>
                <textarea
                  name="noche_comida"
                  value={formData.noche_comida}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej. Infusión, snack ligero..."
                  data-testid="textarea-noche-comida"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Estado de ánimo:</label>
                <input
                  type="text"
                  name="noche_animo"
                  value={formData.noche_animo}
                  onChange={handleChange}
                  placeholder="Ej. Cansado, listo para dormir..."
                  data-testid="input-noche-animo"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Evacuaciones:</label>
                <input
                  type="text"
                  name="noche_evacuaciones"
                  value={formData.noche_evacuaciones}
                  onChange={handleChange}
                  placeholder="Ej. Normal, sin evacuaciones..."
                  data-testid="input-noche-evacuaciones"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            data-testid="button-guardar-dia"
            style={{
              background: '#A15C38',
              color: '#fff',
              padding: '1rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#8A4D2F'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#A15C38'}
          >
            Guardar Día {diaActual}
          </button>

          {/* Botón de desarrollo para reiniciar */}
          {diasCompletados.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #E6E3D9' }}>
              <button
                type="button"
                onClick={reiniciarRegistro}
                data-testid="button-reiniciar-registro"
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  padding: '.6rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                🗑️ Reiniciar registro (desarrollo)
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
