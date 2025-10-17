import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface IntakeData {
  nombre: string;
  edad: string;
  sexo: string;
  email: string;
  diagnosticos: string;
  medicamentos: string;
  suplementos: string;
  historial_familiar: string;
  evacuaciones: string;
  digestivos: string;
  sueno: string;
  energia: string;
  alimentacion: string;
  actividad: string;
  estres: string;
  comentarios: string;
}

interface IntakeFormProps {
  onComplete: () => void;
}

export default function IntakeForm({ onComplete }: IntakeFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IntakeData>({
    nombre: "",
    edad: "",
    sexo: "Femenino",
    email: "",
    diagnosticos: "",
    medicamentos: "",
    suplementos: "",
    historial_familiar: "",
    evacuaciones: "Una vez al día",
    digestivos: "",
    sueno: "",
    energia: "5",
    alimentacion: "",
    actividad: "Moderado",
    estres: "Medio",
    comentarios: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem('intakeTransformaDiabetes');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('intakeTransformaDiabetes', JSON.stringify(formData));
    
    toast({
      title: "✅ Historial guardado",
      description: "Tu información ha sido registrada. Ahora puedes comenzar tu diario de 5 días.",
    });

    onComplete();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section
      style={{
        backgroundColor: '#FAF8F4',
        padding: '3rem 1.5rem',
        borderTop: '1px solid #E6E3D9',
        marginTop: '2rem',
        borderRadius: '12px'
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: 'auto',
          background: '#FFFFFF',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(0,0,0,.05)'
        }}
      >
        <h2 style={{ color: '#556B2F', textAlign: 'center', marginBottom: '1rem' }}>
          🌿 Tu Historia Funcional
        </h2>
        <p style={{ color: '#6F6E66', textAlign: 'center', marginBottom: '2rem' }}>
          Antes de comenzar tu diario funcional, cuéntame un poco sobre ti.
          <br />
          Tu información es confidencial y nos ayuda a personalizar tus recomendaciones.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Nombre completo:</label>
            <br />
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              data-testid="input-nombre"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Edad:</label>
              <br />
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                data-testid="input-edad"
                style={{
                  width: '100%',
                  padding: '.7rem',
                  border: '1px solid #E6E3D9',
                  borderRadius: '6px',
                  marginTop: '.3rem'
                }}
              />
            </div>
            <div>
              <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Sexo:</label>
              <br />
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                data-testid="select-sexo"
                style={{
                  width: '100%',
                  padding: '.7rem',
                  border: '1px solid #E6E3D9',
                  borderRadius: '6px',
                  marginTop: '.3rem'
                }}
              >
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Prefiero no decir">Prefiero no decir</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Correo electrónico:</label>
            <br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              data-testid="input-email"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Diagnósticos médicos conocidos:</label>
            <br />
            <textarea
              name="diagnosticos"
              value={formData.diagnosticos}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-diagnosticos"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Medicamentos actuales:</label>
            <br />
            <textarea
              name="medicamentos"
              value={formData.medicamentos}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-medicamentos"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Suplementos que toma:</label>
            <br />
            <textarea
              name="suplementos"
              value={formData.suplementos}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-suplementos"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>
              Historial familiar (diabetes, tiroides, autoinmunes, etc.):
            </label>
            <br />
            <textarea
              name="historial_familiar"
              value={formData.historial_familiar}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-historial-familiar"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Frecuencia de evacuaciones:</label>
            <br />
            <select
              name="evacuaciones"
              value={formData.evacuaciones}
              onChange={handleChange}
              data-testid="select-evacuaciones"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            >
              <option value="Una vez al día">Una vez al día</option>
              <option value="Dos veces al día">Dos veces al día</option>
              <option value="Cada dos días">Cada dos días</option>
              <option value="Menos de tres veces por semana">Menos de tres veces por semana</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>¿Presentas síntomas digestivos?</label>
            <br />
            <textarea
              name="digestivos"
              value={formData.digestivos}
              onChange={handleChange}
              rows={2}
              placeholder="Ejemplo: hinchazón, reflujo, estreñimiento..."
              data-testid="textarea-digestivos"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Horas promedio de sueño:</label>
            <br />
            <input
              type="number"
              name="sueno"
              value={formData.sueno}
              onChange={handleChange}
              placeholder="Ej. 7"
              data-testid="input-sueno"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>
              Nivel de energía (1–10): {formData.energia}
            </label>
            <br />
            <input
              type="range"
              min="1"
              max="10"
              name="energia"
              value={formData.energia}
              onChange={handleChange}
              data-testid="input-energia"
              style={{ width: '100%', marginTop: '.5rem' }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>
              Describe lo que comiste en los últimos 3–5 días:
            </label>
            <br />
            <textarea
              name="alimentacion"
              value={formData.alimentacion}
              onChange={handleChange}
              rows={4}
              data-testid="textarea-alimentacion"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Nivel de actividad física:</label>
            <br />
            <select
              name="actividad"
              value={formData.actividad}
              onChange={handleChange}
              data-testid="select-actividad"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            >
              <option value="Bajo">Bajo</option>
              <option value="Moderado">Moderado</option>
              <option value="Alto">Alto</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Nivel de estrés:</label>
            <br />
            <select
              name="estres"
              value={formData.estres}
              onChange={handleChange}
              data-testid="select-estres"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            >
              <option value="Bajo">Bajo</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#3A3A3A', fontWeight: 500 }}>Comentarios o metas personales:</label>
            <br />
            <textarea
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-comentarios"
              style={{
                width: '100%',
                padding: '.7rem',
                border: '1px solid #E6E3D9',
                borderRadius: '6px',
                marginTop: '.3rem'
              }}
            />
          </div>

          <Button
            type="submit"
            data-testid="button-guardar-historial"
            style={{
              backgroundColor: '#A15C38',
              color: 'white',
              padding: '.9rem 1.5rem',
              fontWeight: 600
            }}
          >
            Guardar mi historial
          </Button>
        </form>
      </div>
    </section>
  );
}
