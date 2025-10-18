import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface DiaRegistro {
  dia: number;
  comida: string;
  heces: string;
  sueno: string;
  energia: string;
}

export default function Registro5Dias() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [diaActual, setDiaActual] = useState(1);
  const [diasCompletados, setDiasCompletados] = useState<DiaRegistro[]>([]);
  
  const [formData, setFormData] = useState({
    comida: "",
    heces: "Normal (una o más veces al día)",
    sueno: "Profundo y reparador",
    energia: "Con energía y claridad"
  });

  // Cargar datos guardados al montar
  useEffect(() => {
    console.log('🟢 Registro5Dias.tsx montado');
    const datosGuardados = localStorage.getItem('registro5dias');
    console.log('Datos guardados:', datosGuardados);
    
    if (datosGuardados) {
      try {
        const diasGuardados = JSON.parse(datosGuardados);
        console.log('Días guardados parseados:', diasGuardados);
        
        if (Array.isArray(diasGuardados) && diasGuardados.length > 0) {
          setDiasCompletados(diasGuardados);
          setDiaActual(diasGuardados.length + 1);
          console.log('Día actual:', diasGuardados.length + 1);
          
          // Si ya completó los 5 días, redirigir a Mes1
          if (diasGuardados.length >= 5) {
            console.log('🔴 Ya completó 5 días, redirigiendo a Mes1');
            localStorage.setItem('tm_registro_dias', '5');
            setLocation('/onboarding/mes1');
          }
        }
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    } else {
      console.log('✅ No hay datos guardados, mostrando Día 1');
    }
  }, [setLocation]);

  const handleChange = (campo: string, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const guardarDia = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.comida.trim()) {
      toast({
        title: "Campo incompleto",
        description: "Por favor completa el campo de comida antes de guardar.",
        variant: "destructive"
      });
      return;
    }
    
    // Crear el registro del día
    const nuevoDia: DiaRegistro = {
      dia: diaActual,
      ...formData
    };
    
    const nuevosDias = [...diasCompletados, nuevoDia];
    
    // Guardar en localStorage
    localStorage.setItem('registro5dias', JSON.stringify(nuevosDias));
    localStorage.setItem('tm_registro_dias', String(nuevosDias.length));
    
    // Actualizar estado
    setDiasCompletados(nuevosDias);
    
    if (nuevosDias.length >= 5) {
      // Completó los 5 días
      toast({
        title: "✅ Registro completo",
        description: "Has completado tus 5 días de registro funcional.",
      });
      setTimeout(() => {
        setLocation('/onboarding/mes1');
      }, 1500);
    } else {
      // Pasar al siguiente día
      toast({
        title: "✅ Día guardado",
        description: `Día ${diaActual} registrado correctamente. Continúa con el día ${diaActual + 1}.`,
      });
      setDiaActual(diaActual + 1);
      // Resetear el formulario para el próximo día
      setFormData({
        comida: "",
        heces: "Normal (una o más veces al día)",
        sueno: "Profundo y reparador",
        energia: "Con energía y claridad"
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
        <button
          onClick={() => setLocation('/onboarding/mes1')}
          style={{
            marginTop: '1.5rem',
            background: '#556B2F',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Continuar al Mes 1 →
        </button>
      </div>
    );
  }

  return (
    <section 
      id="registro5dias"
      style={{
        marginTop: '3rem',
        animation: 'fadeInUp 1s ease forwards'
      }}
    >
      <div style={{
        margin: '2rem auto',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #E6E3D9',
        borderRadius: '12px',
        padding: '2.5rem 2rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        maxWidth: '700px'
      }}>
        <h1 style={{ 
          color: '#556B2F', 
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}>
          🗓️ Registro Funcional - Día {diaActual}
        </h1>
        
        {/* Progreso */}
        <div style={{
          textAlign: 'center',
          margin: '1.5rem auto',
          padding: '1rem',
          background: '#F8F6F1',
          borderRadius: '8px'
        }}>
          <p style={{ 
            color: '#556B2F', 
            fontWeight: 600,
            fontSize: '1rem',
            marginBottom: '.5rem'
          }}>
            Día {diaActual} de 5
          </p>
          <progress 
            value={diaActual} 
            max={5}
            style={{
              width: '100%',
              height: '16px'
            }}
          />
          <p style={{ 
            color: '#6F6E66', 
            fontSize: '.9rem',
            marginTop: '.5rem'
          }}>
            {5 - diaActual} {5 - diaActual === 1 ? 'día restante' : 'días restantes'}
          </p>
        </div>
        
        <p style={{ 
          color: '#6a6a6a', 
          textAlign: 'center',
          margin: '1rem auto 2rem',
          lineHeight: 1.6,
          fontStyle: 'italic'
        }}>
          Anota con calma lo que comes, cómo duermes y cómo eliminas.
          No se trata de perfección, sino de observar.
        </p>

        <form onSubmit={guardarDia}>
          {/* Comida */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#556B2F',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>
              🍽️ ¿Qué comiste hoy?
            </label>
            <textarea
              data-testid={`textarea-comida-dia-${diaActual}`}
              value={formData.comida}
              onChange={(e) => handleChange('comida', e.target.value)}
              placeholder="Desayuno: yogur natural y frutas. Comida: ensalada con pollo. Cena: pescado al horno. Snacks: nueces."
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '120px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Heces */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#556B2F',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>
              💩 ¿Cómo fue tu digestión y eliminación?
            </label>
            <select
              value={formData.heces}
              onChange={(e) => handleChange('heces', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="Normal (una o más veces al día)">Normal (una o más veces al día)</option>
              <option value="Estreñimiento (menos de una vez al día)">Estreñimiento (menos de una vez al día)</option>
              <option value="Diarrea o heces sueltas">Diarrea o heces sueltas</option>
              <option value="Con gases o inflamación">Con gases o inflamación</option>
            </select>
          </div>

          {/* Sueño */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: '#556B2F',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>
              😴 ¿Cómo dormiste?
            </label>
            <select
              value={formData.sueno}
              onChange={(e) => handleChange('sueno', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="Profundo y reparador">Profundo y reparador</option>
              <option value="Interrumpido varias veces">Interrumpido varias veces</option>
              <option value="Ligero y poco reparador">Ligero y poco reparador</option>
              <option value="Con dificultad para conciliar">Con dificultad para conciliar</option>
            </select>
          </div>

          {/* Energía */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: '#556B2F',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>
              ⚡ ¿Cómo te sentiste hoy en general?
            </label>
            <select
              value={formData.energia}
              onChange={(e) => handleChange('energia', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="Con energía y claridad">Con energía y claridad</option>
              <option value="Cansado pero funcional">Cansado pero funcional</option>
              <option value="Muy fatigado">Muy fatigado</option>
              <option value="Con ansiedad o nerviosismo">Con ansiedad o nerviosismo</option>
            </select>
          </div>

          <button 
            type="submit"
            data-testid="button-guardar-registro"
            style={{
              display: 'block',
              margin: '0 auto',
              background: '#556B2F',
              color: '#fff',
              padding: '14px 32px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#4A5C26'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#556B2F'}
          >
            {diaActual < 5 ? `Guardar Día ${diaActual} →` : 'Completar Registro →'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          color: '#6F6E66',
          fontSize: '0.9rem',
          marginTop: '2rem',
          fontStyle: 'italic'
        }}>
          🌿 "Observar es el primer paso para sanar. Tu cuerpo siempre te está hablando."
        </p>
      </div>
    </section>
  );
}
