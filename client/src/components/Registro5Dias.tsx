import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import MensajeFinalRegistro from "./MensajeFinalRegistro";

interface DiaRegistro {
  dia: number;
  comida: string;
  heces: string;
  sueno: string;
  energia: string;
}

export default function Registro5Dias() {
  const { toast } = useToast();
  const [showMensajeFinal, setShowMensajeFinal] = useState(false);
  const mensajeFinalRef = useRef<HTMLDivElement>(null);
  const [dias, setDias] = useState<DiaRegistro[]>([
    {
      dia: 1,
      comida: "",
      heces: "Normal (una o más veces al día)",
      sueno: "Profundo y reparador",
      energia: "Con energía y claridad"
    }
  ]);

  // Cargar datos guardados de localStorage al montar el componente
  useEffect(() => {
    const datosGuardados = localStorage.getItem('registro5dias');
    if (datosGuardados) {
      try {
        const diasGuardados = JSON.parse(datosGuardados);
        if (Array.isArray(diasGuardados) && diasGuardados.length > 0) {
          setDias(diasGuardados);
        }
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }, []);

  const agregarDia = () => {
    if (dias.length >= 5) {
      toast({
        title: "Límite alcanzado",
        description: "El registro máximo es de 5 días 🌿",
        variant: "destructive"
      });
      return;
    }
    setDias([...dias, {
      dia: dias.length + 1,
      comida: "",
      heces: "Normal (una o más veces al día)",
      sueno: "Profundo y reparador",
      energia: "Con energía y claridad"
    }]);
  };

  const actualizarDia = (index: number, campo: keyof DiaRegistro, valor: string) => {
    const nuevosDias = [...dias];
    nuevosDias[index] = { ...nuevosDias[index], [campo]: valor };
    setDias(nuevosDias);
  };

  useEffect(() => {
    if (showMensajeFinal && mensajeFinalRef.current) {
      setTimeout(() => {
        mensajeFinalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [showMensajeFinal]);

  const guardarRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar en localStorage
    localStorage.setItem('registro5dias', JSON.stringify(dias));
    toast({
      title: "✅ Registro guardado",
      description: "Tu registro funcional ha sido completado correctamente.",
    });
    // Mostrar mensaje final
    setShowMensajeFinal(true);
  };

  return (
    <section 
      id="registro5dias"
      style={{
        marginTop: '3rem',
        animation: 'fadeInUp 1s ease forwards'
      }}
    >
      <div style={{
        margin: '4rem auto',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid #E6E3D9',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        maxWidth: '850px'
      }}>
        <h1 style={{ color: '#556B2F', textAlign: 'center' }}>
          🗓️ Tu Registro Funcional de 5 Días
        </h1>
        <p style={{ 
          color: '#3A3A3A', 
          textAlign: 'center', 
          maxWidth: '650px', 
          margin: '1rem auto',
          lineHeight: 1.6 
        }}>
          Anota con calma lo que comes, cómo duermes y cómo eliminas cada día.
          No se trata de perfección, sino de observar cómo responde tu cuerpo.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <form id="formRegistro" onSubmit={guardarRegistro}>
            <div className="dias" style={{ display: 'grid', gap: '1.5rem' }}>
              {dias.map((dia, index) => (
                <div 
                  key={index}
                  className="dia"
                  style={{
                    border: '1px solid #E6E3D9',
                    borderRadius: '10px',
                    padding: '1rem',
                    background: '#FDFCF9'
                  }}
                >
                  <h3 style={{ color: '#A15C38', marginBottom: '1rem' }}>
                    Día {dia.dia}
                  </h3>

                  <label style={{ display: 'block', color: '#3A3A3A', marginBottom: '.5rem' }}>
                    🍽️ ¿Qué comiste hoy (desayuno, comida, cena, snacks)?
                  </label>
                  <textarea
                    name={`comida${dia.dia}`}
                    data-testid={`textarea-comida-dia-${dia.dia}`}
                    rows={3}
                    value={dia.comida}
                    onChange={(e) => actualizarDia(index, 'comida', e.target.value)}
                    style={{
                      width: '100%',
                      margin: '.5rem 0',
                      border: '1px solid #E6E3D9',
                      borderRadius: '6px',
                      padding: '.6rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />

                  <label style={{ display: 'block', color: '#3A3A3A', marginBottom: '.5rem', marginTop: '1rem' }}>
                    💩 ¿Cómo fue tu digestión y eliminación?
                  </label>
                  <select
                    name={`heces${dia.dia}`}
                    data-testid={`select-heces-dia-${dia.dia}`}
                    value={dia.heces}
                    onChange={(e) => actualizarDia(index, 'heces', e.target.value)}
                    style={{
                      width: '100%',
                      margin: '.5rem 0',
                      border: '1px solid #E6E3D9',
                      borderRadius: '6px',
                      padding: '.6rem',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option>Normal (una o más veces al día)</option>
                    <option>Estreñimiento (menos de una vez al día)</option>
                    <option>Diárea o urgencia</option>
                    <option>Hinchazón o gases</option>
                    <option>No observé cambios</option>
                  </select>

                  <label style={{ display: 'block', color: '#3A3A3A', marginBottom: '.5rem', marginTop: '1rem' }}>
                    😴 ¿Cómo dormiste?
                  </label>
                  <select
                    name={`sueno${dia.dia}`}
                    data-testid={`select-sueno-dia-${dia.dia}`}
                    value={dia.sueno}
                    onChange={(e) => actualizarDia(index, 'sueno', e.target.value)}
                    style={{
                      width: '100%',
                      margin: '.5rem 0',
                      border: '1px solid #E6E3D9',
                      borderRadius: '6px',
                      padding: '.6rem',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option>Profundo y reparador</option>
                    <option>Interrumpido o con insomnio</option>
                    <option>Me costó dormir</option>
                    <option>Muy poco descanso</option>
                  </select>

                  <label style={{ display: 'block', color: '#3A3A3A', marginBottom: '.5rem', marginTop: '1rem' }}>
                    ⚖️ ¿Cómo te sentiste hoy en general?
                  </label>
                  <select
                    name={`energia${dia.dia}`}
                    data-testid={`select-energia-dia-${dia.dia}`}
                    value={dia.energia}
                    onChange={(e) => actualizarDia(index, 'energia', e.target.value)}
                    style={{
                      width: '100%',
                      margin: '.5rem 0',
                      border: '1px solid #E6E3D9',
                      borderRadius: '6px',
                      padding: '.6rem',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option>Con energía y claridad</option>
                    <option>Cansado o con niebla mental</option>
                    <option>Con altibajos durante el día</option>
                    <option>Sin energía o desmotivado</option>
                  </select>
                </div>
              ))}
            </div>

            {dias.length < 5 && (
              <button
                type="button"
                onClick={agregarDia}
                data-testid="button-agregar-dia"
                style={{
                  margin: '2rem auto',
                  display: 'block',
                  background: '#A15C38',
                  color: '#fff',
                  padding: '1rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#8B4D2F'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#A15C38'}
              >
                ➕ Agregar siguiente día
              </button>
            )}

            <button
              type="submit"
              data-testid="button-guardar-registro"
              style={{
                margin: '1rem auto',
                display: 'block',
                background: '#556B2F',
                color: '#fff',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#4A5C26'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#556B2F'}
            >
              Guardar mi registro de 5 días
            </button>
          </form>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          color: '#556B2F', 
          fontStyle: 'italic',
          lineHeight: 1.6
        }}>
          🌿 "Observar es el primer paso para sanar.
          <br />
          Tu cuerpo siempre te está hablando." 🌿
        </div>
      </div>

      {/* Mensaje Final después de completar el registro */}
      {showMensajeFinal && (
        <div ref={mensajeFinalRef}>
          <MensajeFinalRegistro />
        </div>
      )}
    </section>
  );
}
