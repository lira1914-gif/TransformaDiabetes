import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

export default function FormularioSalud() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    edad: '',
    genero: '',
    diagnostico: '',
    medicamentos: '',
    sintomas: '',
    objetivos: '',
    alergias: '',
    habitos: ''
  });

  useEffect(() => {
    // Verificar que el usuario haya completado los pasos previos
    const motivacionDone = localStorage.getItem('tm_motivacion_done');
    
    if (!motivacionDone) {
      setLocation('/onboarding/bienvenida');
      return;
    }

    // Cargar datos guardados si existen
    const savedData = localStorage.getItem('tm_formulario_salud');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading form data:', e);
      }
    }
  }, [setLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Guardar en localStorage
    localStorage.setItem('tm_formulario_salud', JSON.stringify(formData));
    localStorage.setItem('tm_formulario_done', 'true');
    
    // Navegar al siguiente paso (Mensaje)
    setLocation('/onboarding/mensaje');
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        background: '#FAF8F4',
        padding: '2rem 1rem'
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          background: '#fffdf8',
          border: '1px solid #E6E3D9',
          borderRadius: '12px',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 22px rgba(0,0,0,0.08)',
          animation: 'fadeInUp 1.2s ease forwards'
        }}
      >
        <h1 style={{ 
          color: '#30452b', 
          textAlign: 'center', 
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          🩺 Formulario Personal de Salud
        </h1>

        <p style={{ 
          textAlign: 'center', 
          color: '#6a6a6a',
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          Esta información nos ayudará a comprender tu historia, síntomas y hábitos actuales. 
          Es 100% confidencial y educativa.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#30452b', 
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Edad
            </label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              required
              data-testid="input-edad"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#30452b', 
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Género
            </label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
              data-testid="select-genero"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleccionar...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#30452b', 
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Diagnóstico de Diabetes Tipo 2
            </label>
            <textarea
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              placeholder="¿Cuándo te diagnosticaron? ¿Qué valores tenías?"
              data-testid="textarea-diagnostico"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#30452b', 
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Medicamentos actuales
            </label>
            <textarea
              name="medicamentos"
              value={formData.medicamentos}
              onChange={handleChange}
              placeholder="Lista todos los medicamentos que tomas actualmente"
              data-testid="textarea-medicamentos"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#30452b', 
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Síntomas principales
            </label>
            <textarea
              name="sintomas"
              value={formData.sintomas}
              onChange={handleChange}
              placeholder="Fatiga, sed excesiva, visión borrosa, etc."
              required
              data-testid="textarea-sintomas"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#30452b', 
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Objetivos principales
            </label>
            <textarea
              name="objetivos"
              value={formData.objetivos}
              onChange={handleChange}
              placeholder="¿Qué esperas lograr con este programa?"
              required
              data-testid="textarea-objetivos"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#30452b', 
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Alergias o intolerancias alimentarias
            </label>
            <textarea
              name="alergias"
              value={formData.alergias}
              onChange={handleChange}
              placeholder="Lactosa, gluten, frutos secos, etc."
              data-testid="textarea-alergias"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#30452b', 
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Hábitos actuales
            </label>
            <textarea
              name="habitos"
              value={formData.habitos}
              onChange={handleChange}
              placeholder="Ejercicio, sueño, estrés, consumo de alcohol/tabaco..."
              data-testid="textarea-habitos"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E6E3D9',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <button 
            type="submit"
            data-testid="button-guardar-formulario"
            style={{
              display: 'block',
              margin: '0 auto',
              background: '#a36d4f',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#8f5b3f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#a36d4f'}
          >
            Guardar y continuar →
          </button>

          <p style={{ 
            textAlign: 'center', 
            color: '#777',
            fontSize: '0.9rem',
            marginTop: '1.5rem',
            lineHeight: 1.6
          }}>
            *Esta información es confidencial y solo será usada para personalizar tus recomendaciones funcionales.*
          </p>
        </form>
      </div>
    </div>
  );
}
