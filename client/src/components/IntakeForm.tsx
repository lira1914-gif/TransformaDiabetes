import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface IntakeData {
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigo_postal: string;
  telefono_dia: string;
  telefono_celular: string;
  telefono_noche: string;
  email: string;
  referido_por: string;
  edad: string;
  fecha_nacimiento: string;
  peso_actual: string;
  peso_hace_ano: string;
  altura: string;
  tipo_sangre: string;
  peso_nacer: string;
  orden_nacimiento: string;
  estado_civil: string;
  ocupacion: string;
  viajes_fuera: string;
  cambios_recientes: string;
  sistema_gastrointestinal: string;
  sistema_cardiovascular: string;
  sistema_hormonal: string;
  sistema_inmunologico: string;
  alimentos_regulares: string;
  dieta_especial: string;
  porcentaje_comidas_caseras: string;
  alimentos_evitados: string;
  sintomas_despues_comer: string;
  frecuencia_evacuaciones: string;
  consistencia_evacuaciones: string;
  color_evacuaciones: string;
  historial_intoxicaciones: string;
  exposicion_quimicos: string;
  ultima_visita_dental: string;
  amalgamas_mercurio: string;
  problemas_encias: string;
  satisfecho_sueno: string;
  horas_sueno: string;
  tiempo_conciliar_sueno: string;
  estado_animo: string;
  nivel_energia: string;
  momento_mejor_bienestar: string;
  apoyo_familiar: string;
  rol_espiritualidad: string;
  informacion_adicional: string;
  a1c: string;
  colesterol_total: string;
  hdl: string;
  ldl: string;
  trigliceridos: string;
  hemoglobina: string;
  otros_analisis: string;
}

interface IntakeFormProps {
  onComplete: () => void;
}

export default function IntakeForm({ onComplete }: IntakeFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IntakeData>({
    nombre: "",
    direccion: "",
    ciudad: "",
    estado: "",
    pais: "",
    codigo_postal: "",
    telefono_dia: "",
    telefono_celular: "",
    telefono_noche: "",
    email: "",
    referido_por: "",
    edad: "",
    fecha_nacimiento: "",
    peso_actual: "",
    peso_hace_ano: "",
    altura: "",
    tipo_sangre: "",
    peso_nacer: "",
    orden_nacimiento: "",
    estado_civil: "",
    ocupacion: "",
    viajes_fuera: "",
    cambios_recientes: "",
    sistema_gastrointestinal: "",
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
    nivel_energia: "5",
    momento_mejor_bienestar: "",
    apoyo_familiar: "",
    rol_espiritualidad: "",
    informacion_adicional: "",
    a1c: "",
    colesterol_total: "",
    hdl: "",
    ldl: "",
    trigliceridos: "",
    hemoglobina: "",
    otros_analisis: ""
  });

  const saveIntakeMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/intake-form', data);
    },
    onSuccess: () => {
      localStorage.setItem('tm_intake_done', 'true');
      toast({
        title: "✅ Historial guardado",
        description: "Tu información ha sido registrada correctamente en nuestra base de datos.",
      });
      onComplete();
    },
    onError: (error: any) => {
      console.error('Error guardando intake form:', error);
      toast({
        title: "❌ Error al guardar",
        description: "Hubo un problema guardando tu información. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('intakeTransformaDiabetes');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Obtener userId de localStorage
    const userId = localStorage.getItem('tm_user_id');
    
    if (!userId) {
      toast({
        title: "❌ Error",
        description: "No se pudo identificar tu cuenta. Por favor vuelve a iniciar sesión.",
        variant: "destructive",
      });
      return;
    }

    // Guardar en localStorage como backup
    localStorage.setItem('intakeTransformaDiabetes', JSON.stringify(formData));
    
    // Mapear snake_case a camelCase para el backend
    const apiData = {
      userId,
      nombre: formData.nombre,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      estado: formData.estado,
      pais: formData.pais,
      codigoPostal: formData.codigo_postal,
      telefonoDia: formData.telefono_dia,
      telefonoCelular: formData.telefono_celular,
      telefonoNoche: formData.telefono_noche,
      email: formData.email,
      referidoPor: formData.referido_por,
      edad: formData.edad,
      fechaNacimiento: formData.fecha_nacimiento,
      pesoActual: formData.peso_actual,
      pesoHaceAno: formData.peso_hace_ano,
      altura: formData.altura,
      tipoSangre: formData.tipo_sangre,
      pesoNacer: formData.peso_nacer,
      ordenNacimiento: formData.orden_nacimiento,
      estadoCivil: formData.estado_civil,
      ocupacion: formData.ocupacion,
      viajesFuera: formData.viajes_fuera,
      cambiosRecientes: formData.cambios_recientes,
      sistemaGastrointestinal: formData.sistema_gastrointestinal,
      sistemaCardiovascular: formData.sistema_cardiovascular,
      sistemaHormonal: formData.sistema_hormonal,
      sistemaInmunologico: formData.sistema_inmunologico,
      alimentosRegulares: formData.alimentos_regulares,
      dietaEspecial: formData.dieta_especial,
      porcentajeComidasCaseras: formData.porcentaje_comidas_caseras,
      alimentosEvitados: formData.alimentos_evitados,
      sintomasDespuesComer: formData.sintomas_despues_comer,
      frecuenciaEvacuaciones: formData.frecuencia_evacuaciones,
      consistenciaEvacuaciones: formData.consistencia_evacuaciones,
      colorEvacuaciones: formData.color_evacuaciones,
      historialIntoxicaciones: formData.historial_intoxicaciones,
      exposicionQuimicos: formData.exposicion_quimicos,
      ultimaVisitaDental: formData.ultima_visita_dental,
      amalgamasMercurio: formData.amalgamas_mercurio,
      problemasEncias: formData.problemas_encias,
      satisfechoSueno: formData.satisfecho_sueno,
      horasSueno: formData.horas_sueno,
      tiempoConciliarSueno: formData.tiempo_conciliar_sueno,
      estadoAnimo: formData.estado_animo,
      nivelEnergia: formData.nivel_energia,
      momentoMejorBienestar: formData.momento_mejor_bienestar,
      apoyoFamiliar: formData.apoyo_familiar,
      rolEspiritualidad: formData.rol_espiritualidad,
      informacionAdicional: formData.informacion_adicional,
      a1c: formData.a1c,
      colesterolTotal: formData.colesterol_total,
      hdl: formData.hdl,
      ldl: formData.ldl,
      trigliceridos: formData.trigliceridos,
      hemoglobina: formData.hemoglobina,
      otrosAnalisis: formData.otros_analisis
    };
    
    // Enviar a PostgreSQL
    saveIntakeMutation.mutate(apiData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '.7rem',
    border: '1px solid #E6E3D9',
    borderRadius: '6px',
    marginTop: '.3rem'
  };

  const labelStyle = {
    color: '#3A3A3A',
    fontWeight: 500
  };

  const sectionTitleStyle = {
    color: '#A15C38',
    fontSize: '1.2rem',
    fontWeight: 600,
    marginTop: '2rem',
    marginBottom: '1rem',
    paddingBottom: '.5rem',
    borderBottom: '2px solid #E6E3D9'
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
          🌿 Formulario de Ingreso
        </h2>
        <p style={{ color: '#6F6E66', textAlign: 'center', marginBottom: '1rem' }}>
          Esta información es estrictamente confidencial y será utilizada únicamente para fines de evaluación nutricional funcional.
        </p>
        <div style={{
          background: '#FFF9E6',
          border: '1px solid #F0C75E',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#8B6914', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
            ℹ️ <strong>Nota:</strong> No estás obligado/a a llenar todos los campos, pero <strong>entre más información tengamos, mejor</strong> podremos crear un cuadro completo de tu salud para personalizar tus recomendaciones.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          
          {/* INFORMACIÓN PERSONAL */}
          <h3 style={sectionTitleStyle}>Información Personal</h3>

          <div>
            <label style={labelStyle}>Nombre completo: *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              data-testid="input-nombre"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              data-testid="input-direccion"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Ciudad:</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                data-testid="input-ciudad"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Estado:</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                data-testid="input-estado"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>País:</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                data-testid="input-pais"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Código Postal:</label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
                data-testid="input-codigo-postal"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Teléfono (día):</label>
              <input
                type="tel"
                name="telefono_dia"
                value={formData.telefono_dia}
                onChange={handleChange}
                data-testid="input-telefono-dia"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Teléfono (celular):</label>
              <input
                type="tel"
                name="telefono_celular"
                value={formData.telefono_celular}
                onChange={handleChange}
                data-testid="input-telefono-celular"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Teléfono (noche):</label>
              <input
                type="tel"
                name="telefono_noche"
                value={formData.telefono_noche}
                onChange={handleChange}
                data-testid="input-telefono-noche"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Correo electrónico: *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              data-testid="input-email"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Referido por:</label>
            <input
              type="text"
              name="referido_por"
              value={formData.referido_por}
              onChange={handleChange}
              data-testid="input-referido-por"
              style={inputStyle}
            />
          </div>

          {/* HISTORIA GENERAL */}
          <h3 style={sectionTitleStyle}>Historia General</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Edad: *</label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                required
                data-testid="input-edad"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Fecha de nacimiento:</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                data-testid="input-fecha-nacimiento"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Peso actual (opcional):</label>
              <input
                type="text"
                name="peso_actual"
                value={formData.peso_actual}
                onChange={handleChange}
                placeholder="Ej. 70 kg"
                data-testid="input-peso-actual"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Peso hace un año (opcional):</label>
              <input
                type="text"
                name="peso_hace_ano"
                value={formData.peso_hace_ano}
                onChange={handleChange}
                placeholder="Ej. 75 kg"
                data-testid="input-peso-hace-ano"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Altura:</label>
              <input
                type="text"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                placeholder="Ej. 1.65 m"
                data-testid="input-altura"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tipo de sangre (si se conoce):</label>
              <input
                type="text"
                name="tipo_sangre"
                value={formData.tipo_sangre}
                onChange={handleChange}
                placeholder="Ej. O+"
                data-testid="input-tipo-sangre"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Peso al nacer (si se conoce):</label>
              <input
                type="text"
                name="peso_nacer"
                value={formData.peso_nacer}
                onChange={handleChange}
                placeholder="Ej. 3.5 kg"
                data-testid="input-peso-nacer"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Orden de nacimiento:</label>
              <input
                type="text"
                name="orden_nacimiento"
                value={formData.orden_nacimiento}
                onChange={handleChange}
                placeholder="Ej. Primero de 3 hermanos"
                data-testid="input-orden-nacimiento"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Estado civil:</label>
              <select
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleChange}
                data-testid="select-estado-civil"
                style={inputStyle}
              >
                <option value="">Seleccionar...</option>
                <option value="Soltero/a">Soltero/a</option>
                <option value="Casado/a">Casado/a</option>
                <option value="Divorciado/a">Divorciado/a</option>
                <option value="Viudo/a">Viudo/a</option>
                <option value="Unión libre">Unión libre</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ocupación:</label>
              <input
                type="text"
                name="ocupacion"
                value={formData.ocupacion}
                onChange={handleChange}
                data-testid="input-ocupacion"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>¿Ha vivido o viajado fuera de su país? ¿Dónde y cuándo?</label>
            <textarea
              name="viajes_fuera"
              value={formData.viajes_fuera}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-viajes-fuera"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>¿Cambios importantes recientes en la vida?</label>
            <textarea
              name="cambios_recientes"
              value={formData.cambios_recientes}
              onChange={handleChange}
              rows={2}
              placeholder="Ej. Cambio de trabajo, mudanza, pérdida familiar, etc."
              data-testid="textarea-cambios-recientes"
              style={inputStyle}
            />
          </div>

          {/* ESTADO DE SALUD GENERAL */}
          <h3 style={sectionTitleStyle}>Estado de Salud General</h3>

          <div>
            <label style={labelStyle}>Sistema gastrointestinal:</label>
            <p style={{ fontSize: '0.85rem', color: '#6F6E66', marginTop: '.2rem' }}>
              Describa condiciones relevantes (reflujo, gastritis, colitis, SII, etc.)
            </p>
            <textarea
              name="sistema_gastrointestinal"
              value={formData.sistema_gastrointestinal}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-sistema-gastrointestinal"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Sistema cardiovascular:</label>
            <p style={{ fontSize: '0.85rem', color: '#6F6E66', marginTop: '.2rem' }}>
              Describa condiciones relevantes (presión alta, colesterol, etc.)
            </p>
            <textarea
              name="sistema_cardiovascular"
              value={formData.sistema_cardiovascular}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-sistema-cardiovascular"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Sistema hormonal y metabólico:</label>
            <p style={{ fontSize: '0.85rem', color: '#6F6E66', marginTop: '.2rem' }}>
              Describa condiciones relevantes (diabetes, tiroides, SOP, menopausia, etc.)
            </p>
            <textarea
              name="sistema_hormonal"
              value={formData.sistema_hormonal}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-sistema-hormonal"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Sistema inmunológico:</label>
            <p style={{ fontSize: '0.85rem', color: '#6F6E66', marginTop: '.2rem' }}>
              Describa condiciones relevantes (alergias, autoinmunes, infecciones recurrentes, etc.)
            </p>
            <textarea
              name="sistema_inmunologico"
              value={formData.sistema_inmunologico}
              onChange={handleChange}
              rows={2}
              data-testid="textarea-sistema-inmunologico"
              style={inputStyle}
            />
          </div>

          {/* ESTADO NUTRICIONAL */}
          <h3 style={sectionTitleStyle}>Estado Nutricional</h3>

          <div>
            <label style={labelStyle}>Alimentos consumidos regularmente:</label>
            <textarea
              name="alimentos_regulares"
              value={formData.alimentos_regulares}
              onChange={handleChange}
              rows={2}
              placeholder="Ej. Pan, arroz, pollo, frutas, verduras..."
              data-testid="textarea-alimentos-regulares"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>¿Sigue alguna dieta especial?</label>
            <input
              type="text"
              name="dieta_especial"
              value={formData.dieta_especial}
              onChange={handleChange}
              placeholder="Ej. Vegetariana, keto, baja en carbohidratos, etc."
              data-testid="input-dieta-especial"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Porcentaje de comidas caseras:</label>
            <select
              name="porcentaje_comidas_caseras"
              value={formData.porcentaje_comidas_caseras}
              onChange={handleChange}
              data-testid="select-porcentaje-comidas-caseras"
              style={inputStyle}
            >
              <option value="">Seleccionar...</option>
              <option value="0-25%">0-25%</option>
              <option value="25-50%">25-50%</option>
              <option value="50-75%">50-75%</option>
              <option value="75-100%">75-100%</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Alimentos evitados y síntomas asociados:</label>
            <textarea
              name="alimentos_evitados"
              value={formData.alimentos_evitados}
              onChange={handleChange}
              rows={2}
              placeholder="Ej. Lácteos → hinchazón, Gluten → fatiga..."
              data-testid="textarea-alimentos-evitados"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Síntomas inmediatos o retardados después de comer:</label>
            <textarea
              name="sintomas_despues_comer"
              value={formData.sintomas_despues_comer}
              onChange={handleChange}
              rows={2}
              placeholder="Ej. Hinchazón, somnolencia, acidez..."
              data-testid="textarea-sintomas-despues-comer"
              style={inputStyle}
            />
          </div>

          {/* SALUD INTESTINAL */}
          <h3 style={sectionTitleStyle}>Salud Intestinal</h3>

          <div>
            <label style={labelStyle}>Frecuencia de evacuaciones:</label>
            <select
              name="frecuencia_evacuaciones"
              value={formData.frecuencia_evacuaciones}
              onChange={handleChange}
              data-testid="select-frecuencia-evacuaciones"
              style={inputStyle}
            >
              <option value="Una vez al día">Una vez al día</option>
              <option value="Dos veces al día">Dos veces al día</option>
              <option value="Tres o más veces al día">Tres o más veces al día</option>
              <option value="Cada dos días">Cada dos días</option>
              <option value="Menos de tres veces por semana">Menos de tres veces por semana</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Consistencia de evacuaciones:</label>
            <p style={{ fontSize: '0.85rem', color: '#6F6E66', marginTop: '.2rem' }}>
              Según escala de Bristol (1=dura, 4=ideal, 7=líquida)
            </p>
            <input
              type="text"
              name="consistencia_evacuaciones"
              value={formData.consistencia_evacuaciones}
              onChange={handleChange}
              placeholder="Ej. Tipo 3-4 (Bristol)"
              data-testid="input-consistencia-evacuaciones"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Color de evacuaciones:</label>
            <input
              type="text"
              name="color_evacuaciones"
              value={formData.color_evacuaciones}
              onChange={handleChange}
              placeholder="Ej. Marrón normal, claro, oscuro..."
              data-testid="input-color-evacuaciones"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Historial de intoxicaciones alimentarias:</label>
            <textarea
              name="historial_intoxicaciones"
              value={formData.historial_intoxicaciones}
              onChange={handleChange}
              rows={2}
              placeholder="¿Cuándo? ¿Qué causó? ¿Síntomas?"
              data-testid="textarea-historial-intoxicaciones"
              style={inputStyle}
            />
          </div>

          {/* FACTORES DE TOXICIDAD Y SALUD ORAL */}
          <h3 style={sectionTitleStyle}>Factores de Toxicidad y Salud Oral</h3>

          <div>
            <label style={labelStyle}>Exposición a químicos o moho:</label>
            <textarea
              name="exposicion_quimicos"
              value={formData.exposicion_quimicos}
              onChange={handleChange}
              rows={2}
              placeholder="Ej. Trabajo con químicos, moho en casa, pesticidas..."
              data-testid="textarea-exposicion-quimicos"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Última visita dental:</label>
            <input
              type="text"
              name="ultima_visita_dental"
              value={formData.ultima_visita_dental}
              onChange={handleChange}
              placeholder="Ej. Hace 6 meses"
              data-testid="input-ultima-visita-dental"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>¿Tiene amalgamas de mercurio?</label>
            <select
              name="amalgamas_mercurio"
              value={formData.amalgamas_mercurio}
              onChange={handleChange}
              data-testid="select-amalgamas-mercurio"
              style={inputStyle}
            >
              <option value="">Seleccionar...</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
              <option value="No sé">No sé</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>¿Problemas de encías?</label>
            <textarea
              name="problemas_encias"
              value={formData.problemas_encias}
              onChange={handleChange}
              rows={2}
              placeholder="Ej. Sangrado, inflamación, enfermedad periodontal..."
              data-testid="textarea-problemas-encias"
              style={inputStyle}
            />
          </div>

          {/* SALUD DEL SUEÑO */}
          <h3 style={sectionTitleStyle}>Salud del Sueño</h3>

          <div>
            <label style={labelStyle}>¿Está satisfecho con su sueño?</label>
            <select
              name="satisfecho_sueno"
              value={formData.satisfecho_sueno}
              onChange={handleChange}
              data-testid="select-satisfecho-sueno"
              style={inputStyle}
            >
              <option value="">Seleccionar...</option>
              <option value="Sí, muy satisfecho">Sí, muy satisfecho</option>
              <option value="Más o menos">Más o menos</option>
              <option value="No, insatisfecho">No, insatisfecho</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Horas de sueño:</label>
              <input
                type="text"
                name="horas_sueno"
                value={formData.horas_sueno}
                onChange={handleChange}
                placeholder="Ej. 6-7 horas"
                data-testid="input-horas-sueno"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tiempo en conciliar el sueño:</label>
              <input
                type="text"
                name="tiempo_conciliar_sueno"
                value={formData.tiempo_conciliar_sueno}
                onChange={handleChange}
                placeholder="Ej. 15 minutos"
                data-testid="input-tiempo-conciliar-sueno"
                style={inputStyle}
              />
            </div>
          </div>

          {/* ESTADO EMOCIONAL */}
          <h3 style={sectionTitleStyle}>Estado Emocional</h3>

          <div>
            <label style={labelStyle}>Estado de ánimo general:</label>
            <select
              name="estado_animo"
              value={formData.estado_animo}
              onChange={handleChange}
              data-testid="select-estado-animo"
              style={inputStyle}
            >
              <option value="">Seleccionar...</option>
              <option value="Positivo y estable">Positivo y estable</option>
              <option value="Variable">Variable</option>
              <option value="Bajo o deprimido">Bajo o deprimido</option>
              <option value="Ansioso">Ansioso</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Nivel de energía (1–10): {formData.nivel_energia}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              name="nivel_energia"
              value={formData.nivel_energia}
              onChange={handleChange}
              data-testid="input-nivel-energia"
              style={{ width: '100%', marginTop: '.5rem' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Momento de vida con mejor bienestar:</label>
            <textarea
              name="momento_mejor_bienestar"
              value={formData.momento_mejor_bienestar}
              onChange={handleChange}
              rows={2}
              placeholder="¿Cuándo se sintió mejor? ¿Qué era diferente?"
              data-testid="textarea-momento-mejor-bienestar"
              style={inputStyle}
            />
          </div>

          {/* OTROS FACTORES */}
          <h3 style={sectionTitleStyle}>Otros Factores</h3>

          <div>
            <label style={labelStyle}>Apoyo familiar/social:</label>
            <textarea
              name="apoyo_familiar"
              value={formData.apoyo_familiar}
              onChange={handleChange}
              rows={2}
              placeholder="¿Tiene apoyo? ¿Vive solo/a o acompañado/a?"
              data-testid="textarea-apoyo-familiar"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Rol de la espiritualidad en su vida:</label>
            <textarea
              name="rol_espiritualidad"
              value={formData.rol_espiritualidad}
              onChange={handleChange}
              rows={2}
              placeholder="¿Practica alguna religión o espiritualidad?"
              data-testid="textarea-rol-espiritualidad"
              style={inputStyle}
            />
          </div>

          {/* ANÁLISIS DE SANGRE (SI TIENE DISPONIBLES) */}
          <h3 style={sectionTitleStyle}>Análisis de Sangre (si tiene disponibles)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>A1C (%):</label>
              <input
                type="text"
                name="a1c"
                value={formData.a1c}
                onChange={handleChange}
                placeholder="Ej. 6.5"
                data-testid="input-a1c"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Hemoglobina:</label>
              <input
                type="text"
                name="hemoglobina"
                value={formData.hemoglobina}
                onChange={handleChange}
                placeholder="Ej. 14.5 g/dL"
                data-testid="input-hemoglobina"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Colesterol total:</label>
              <input
                type="text"
                name="colesterol_total"
                value={formData.colesterol_total}
                onChange={handleChange}
                placeholder="Ej. 200 mg/dL"
                data-testid="input-colesterol-total"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Triglicéridos:</label>
              <input
                type="text"
                name="trigliceridos"
                value={formData.trigliceridos}
                onChange={handleChange}
                placeholder="Ej. 150 mg/dL"
                data-testid="input-trigliceridos"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>HDL (colesterol bueno):</label>
              <input
                type="text"
                name="hdl"
                value={formData.hdl}
                onChange={handleChange}
                placeholder="Ej. 45 mg/dL"
                data-testid="input-hdl"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>LDL (colesterol malo):</label>
              <input
                type="text"
                name="ldl"
                value={formData.ldl}
                onChange={handleChange}
                placeholder="Ej. 120 mg/dL"
                data-testid="input-ldl"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Otros análisis relevantes:</label>
            <textarea
              name="otros_analisis"
              value={formData.otros_analisis}
              onChange={handleChange}
              rows={2}
              placeholder="Vitamina D, B12, ferritina, TSH, etc."
              data-testid="textarea-otros-analisis"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Información adicional relevante:</label>
            <textarea
              name="informacion_adicional"
              value={formData.informacion_adicional}
              onChange={handleChange}
              rows={3}
              placeholder="Cualquier otra información que considere importante..."
              data-testid="textarea-informacion-adicional"
              style={inputStyle}
            />
          </div>

          <Button
            type="submit"
            data-testid="button-guardar-historial"
            disabled={saveIntakeMutation.isPending}
            style={{
              backgroundColor: saveIntakeMutation.isPending ? '#ccc' : '#A15C38',
              color: 'white',
              padding: '.9rem 1.5rem',
              fontWeight: 600,
              marginTop: '1rem',
              cursor: saveIntakeMutation.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {saveIntakeMutation.isPending ? 'Guardando...' : 'Guardar mi historial funcional'}
          </Button>

          <p style={{ fontSize: '0.85rem', color: '#6F6E66', textAlign: 'center', marginTop: '1rem' }}>
            Esta información es estrictamente confidencial y será utilizada únicamente para personalizar tus recomendaciones nutricionales.
          </p>
        </form>
      </div>
    </section>
  );
}
