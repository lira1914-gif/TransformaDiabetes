import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Activity, AlertCircle, CheckCircle, AlertTriangle, Droplet, Heart, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AnalisisValues {
  a1c: string;
  glucosaAyunas: string;
  colesterolTotal: string;
  ldl: string;
  hdl: string;
  trigliceridos: string;
  hemoglobina: string;
}

interface Interpretacion {
  valor: string;
  rango: string;
  estado: 'normal' | 'alerta' | 'alto' | 'bajo';
  mensaje: string;
  recomendacion: string;
}

export default function Analisis() {
  const [location] = useLocation();
  const [generoUsuario, setGeneroUsuario] = useState<string>('femenino');

  const [valores, setValores] = useState<AnalisisValues>({
    a1c: "",
    glucosaAyunas: "",
    colesterolTotal: "",
    ldl: "",
    hdl: "",
    trigliceridos: "",
    hemoglobina: "",
  });

  const [resultados, setResultados] = useState<Record<string, Interpretacion> | null>(null);

  useEffect(() => {
    // Get gender from URL params if available
    const params = new URLSearchParams(window.location.search);
    const genero = params.get('genero');
    if (genero) {
      setGeneroUsuario(genero);
    }
  }, [location]);

  const interpretarA1C = (valor: number): Interpretacion => {
    if (valor < 5.7) {
      return {
        valor: valor.toString(),
        rango: "Normal: < 5.7%",
        estado: 'normal',
        mensaje: "Tu A1C está en rango normal",
        recomendacion: "Mantén tus hábitos actuales de alimentación y actividad física.",
      };
    } else if (valor >= 5.7 && valor < 6.5) {
      return {
        valor: valor.toString(),
        rango: "Prediabetes: 5.7% - 6.4%",
        estado: 'alerta',
        mensaje: "Estás en rango de prediabetes",
        recomendacion: "Reduce azúcares y carbohidratos refinados. Aumenta proteína y grasas saludables. El ejercicio post-comida ayuda mucho.",
      };
    } else {
      return {
        valor: valor.toString(),
        rango: "Diabetes: ≥ 6.5%",
        estado: 'alto',
        mensaje: "Estás en rango de diabetes",
        recomendacion: "Consulta con tu médico. Reduce drásticamente azúcares y carbohidratos. Prioriza proteínas, grasas saludables y vegetales.",
      };
    }
  };

  const interpretarGlucosa = (valor: number): Interpretacion => {
    if (valor < 100) {
      return {
        valor: valor.toString(),
        rango: "Normal: < 100 mg/dL",
        estado: 'normal',
        mensaje: "Glucosa en ayunas normal",
        recomendacion: "Mantén una dieta equilibrada baja en azúcares refinados.",
      };
    } else if (valor >= 100 && valor < 126) {
      return {
        valor: valor.toString(),
        rango: "Prediabetes: 100-125 mg/dL",
        estado: 'alerta',
        mensaje: "Glucosa en ayunas elevada (prediabetes)",
        recomendacion: "Reduce carbohidratos refinados. Ayuno intermitente y caminatas post-comida pueden ayudar.",
      };
    } else {
      return {
        valor: valor.toString(),
        rango: "Diabetes: ≥ 126 mg/dL",
        estado: 'alto',
        mensaje: "Glucosa en ayunas alta (diabetes)",
        recomendacion: "Requiere atención médica. Dieta baja en carbohidratos y monitoreo constante.",
      };
    }
  };

  const interpretarColesterol = (valor: number): Interpretacion => {
    if (valor < 200) {
      return {
        valor: valor.toString(),
        rango: "Deseable: < 200 mg/dL",
        estado: 'normal',
        mensaje: "Colesterol total en rango deseable",
        recomendacion: "Continúa con una dieta rica en omega-3, fibra y grasas saludables.",
      };
    } else if (valor >= 200 && valor < 240) {
      return {
        valor: valor.toString(),
        rango: "Límite alto: 200-239 mg/dL",
        estado: 'alerta',
        mensaje: "Colesterol total en límite alto",
        recomendacion: "Reduce grasas saturadas y trans. Aumenta omega-3 (pescado, nueces, aguacate).",
      };
    } else {
      return {
        valor: valor.toString(),
        rango: "Alto: ≥ 240 mg/dL",
        estado: 'alto',
        mensaje: "Colesterol total alto",
        recomendacion: "Consulta a tu médico. Elimina grasas trans, reduce saturadas. Prioriza omega-3 y fibra soluble.",
      };
    }
  };

  const interpretarLDL = (valor: number): Interpretacion => {
    if (valor < 100) {
      return {
        valor: valor.toString(),
        rango: "Óptimo: < 100 mg/dL",
        estado: 'normal',
        mensaje: "LDL (colesterol malo) óptimo",
        recomendacion: "Excelente. Mantén tu alimentación actual.",
      };
    } else if (valor >= 100 && valor < 130) {
      return {
        valor: valor.toString(),
        rango: "Casi óptimo: 100-129 mg/dL",
        estado: 'normal',
        mensaje: "LDL en rango casi óptimo",
        recomendacion: "Buen control. Continúa evitando grasas trans y azúcares.",
      };
    } else if (valor >= 130 && valor < 160) {
      return {
        valor: valor.toString(),
        rango: "Límite alto: 130-159 mg/dL",
        estado: 'alerta',
        mensaje: "LDL en límite alto",
        recomendacion: "Reduce carbohidratos refinados y aumenta fibra soluble (avena, legumbres).",
      };
    } else {
      return {
        valor: valor.toString(),
        rango: "Alto: ≥ 160 mg/dL",
        estado: 'alto',
        mensaje: "LDL alto",
        recomendacion: "Consulta a tu médico. Dieta antiinflamatoria y ejercicio regular son clave.",
      };
    }
  };

  const interpretarHDL = (valor: number, genero: string): Interpretacion => {
    const minimo = genero === 'masculino' ? 40 : 50;
    
    if (valor >= 60) {
      return {
        valor: valor.toString(),
        rango: `Protector: ≥ 60 mg/dL`,
        estado: 'normal',
        mensaje: "HDL (colesterol bueno) protector",
        recomendacion: "Excelente nivel. Protege contra enfermedades cardíacas.",
      };
    } else if (valor >= minimo) {
      return {
        valor: valor.toString(),
        rango: `Normal: ≥ ${minimo} mg/dL`,
        estado: 'normal',
        mensaje: "HDL en rango aceptable",
        recomendacion: "Aumenta omega-3 y ejercicio aeróbico para subir HDL.",
      };
    } else {
      return {
        valor: valor.toString(),
        rango: `Bajo: < ${minimo} mg/dL`,
        estado: 'bajo',
        mensaje: "HDL bajo (riesgo cardiovascular)",
        recomendacion: "Aumenta grasas saludables (aguacate, aceite de oliva, nueces) y ejercicio regular.",
      };
    }
  };

  const interpretarTrigliceridos = (valor: number): Interpretacion => {
    if (valor < 150) {
      return {
        valor: valor.toString(),
        rango: "Normal: < 150 mg/dL",
        estado: 'normal',
        mensaje: "Triglicéridos normales",
        recomendacion: "Mantén tu dieta baja en azúcares y carbohidratos refinados.",
      };
    } else if (valor >= 150 && valor < 200) {
      return {
        valor: valor.toString(),
        rango: "Límite alto: 150-199 mg/dL",
        estado: 'alerta',
        mensaje: "Triglicéridos en límite alto",
        recomendacion: "Reduce azúcares, alcohol y carbohidratos. Aumenta omega-3.",
      };
    } else if (valor >= 200 && valor < 500) {
      return {
        valor: valor.toString(),
        rango: "Alto: 200-499 mg/dL",
        estado: 'alto',
        mensaje: "Triglicéridos altos",
        recomendacion: "Elimina azúcares y alcohol. Dieta baja en carbohidratos es esencial.",
      };
    } else {
      return {
        valor: valor.toString(),
        rango: "Muy alto: ≥ 500 mg/dL",
        estado: 'alto',
        mensaje: "Triglicéridos muy altos (riesgo de pancreatitis)",
        recomendacion: "Atención médica urgente. Dieta muy baja en carbohidratos y grasas.",
      };
    }
  };

  const interpretarHemoglobina = (valor: number, genero: string): Interpretacion => {
    const rangoMin = genero === 'masculino' ? 13.5 : 12.0;
    const rangoMax = genero === 'masculino' ? 17.5 : 15.5;

    if (valor < rangoMin) {
      return {
        valor: valor.toString(),
        rango: `Normal: ${rangoMin}-${rangoMax} g/dL`,
        estado: 'bajo',
        mensaje: "Hemoglobina baja (posible anemia)",
        recomendacion: "Aumenta hierro (carnes rojas, espinacas, legumbres) y vitamina C. Consulta a tu médico.",
      };
    } else if (valor >= rangoMin && valor <= rangoMax) {
      return {
        valor: valor.toString(),
        rango: `Normal: ${rangoMin}-${rangoMax} g/dL`,
        estado: 'normal',
        mensaje: "Hemoglobina en rango normal",
        recomendacion: "Nivel saludable. Mantén una dieta equilibrada.",
      };
    } else {
      return {
        valor: valor.toString(),
        rango: `Normal: ${rangoMin}-${rangoMax} g/dL`,
        estado: 'alto',
        mensaje: "Hemoglobina elevada",
        recomendacion: "Consulta a tu médico. Puede indicar deshidratación o policitemia.",
      };
    }
  };

  const handleAnalizar = () => {
    const interpretaciones: Record<string, Interpretacion> = {};

    if (valores.a1c) {
      interpretaciones.a1c = interpretarA1C(parseFloat(valores.a1c));
    }
    if (valores.glucosaAyunas) {
      interpretaciones.glucosaAyunas = interpretarGlucosa(parseFloat(valores.glucosaAyunas));
    }
    if (valores.colesterolTotal) {
      interpretaciones.colesterolTotal = interpretarColesterol(parseFloat(valores.colesterolTotal));
    }
    if (valores.ldl) {
      interpretaciones.ldl = interpretarLDL(parseFloat(valores.ldl));
    }
    if (valores.hdl) {
      interpretaciones.hdl = interpretarHDL(parseFloat(valores.hdl), generoUsuario);
    }
    if (valores.trigliceridos) {
      interpretaciones.trigliceridos = interpretarTrigliceridos(parseFloat(valores.trigliceridos));
    }
    if (valores.hemoglobina) {
      interpretaciones.hemoglobina = interpretarHemoglobina(parseFloat(valores.hemoglobina), generoUsuario);
    }

    setResultados(interpretaciones);
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'normal':
        return <CheckCircle className="w-5 h-5" style={{ color: '#4CAF50' }} />;
      case 'alerta':
        return <AlertTriangle className="w-5 h-5" style={{ color: '#FF9800' }} />;
      case 'alto':
        return <AlertCircle className="w-5 h-5" style={{ color: '#F44336' }} />;
      case 'bajo':
        return <AlertCircle className="w-5 h-5" style={{ color: '#2196F3' }} />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'normal':
        return '#E8F5E9';
      case 'alerta':
        return '#FFF3E0';
      case 'alto':
      case 'bajo':
        return '#FFEBEE';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 
              className="text-3xl sm:text-4xl font-bold mb-3" 
              style={{ color: '#3E3E2E' }}
            >
              Interpretación de Análisis de Sangre
            </h1>
            <p className="text-base sm:text-lg" style={{ color: '#6F6E66' }}>
              Ingresa tus valores de laboratorio para obtener una interpretación personalizada
            </p>
          </div>

          {/* Input Form */}
          <div 
            className="rounded-xl p-6 sm:p-8 mb-8"
            style={{ 
              backgroundColor: '#F8F7F3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* A1C */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#4B4B3B' }}>
                  <Droplet className="w-4 h-4" style={{ color: '#6B7041' }} />
                  Hemoglobina A1C (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={valores.a1c}
                  onChange={(e) => setValores({ ...valores, a1c: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                  placeholder="Ej: 5.8"
                  data-testid="input-a1c"
                />
              </div>

              {/* Glucosa */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#4B4B3B' }}>
                  <Zap className="w-4 h-4" style={{ color: '#6B7041' }} />
                  Glucosa en Ayunas (mg/dL)
                </label>
                <input
                  type="number"
                  value={valores.glucosaAyunas}
                  onChange={(e) => setValores({ ...valores, glucosaAyunas: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                  placeholder="Ej: 105"
                  data-testid="input-glucosa"
                />
              </div>

              {/* Colesterol Total */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#4B4B3B' }}>
                  <Heart className="w-4 h-4" style={{ color: '#6B7041' }} />
                  Colesterol Total (mg/dL)
                </label>
                <input
                  type="number"
                  value={valores.colesterolTotal}
                  onChange={(e) => setValores({ ...valores, colesterolTotal: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                  placeholder="Ej: 210"
                  data-testid="input-colesterol"
                />
              </div>

              {/* LDL */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                  LDL (Colesterol Malo) (mg/dL)
                </label>
                <input
                  type="number"
                  value={valores.ldl}
                  onChange={(e) => setValores({ ...valores, ldl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                  placeholder="Ej: 140"
                  data-testid="input-ldl"
                />
              </div>

              {/* HDL */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                  HDL (Colesterol Bueno) (mg/dL)
                </label>
                <input
                  type="number"
                  value={valores.hdl}
                  onChange={(e) => setValores({ ...valores, hdl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                  placeholder="Ej: 45"
                  data-testid="input-hdl"
                />
              </div>

              {/* Triglicéridos */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                  Triglicéridos (mg/dL)
                </label>
                <input
                  type="number"
                  value={valores.trigliceridos}
                  onChange={(e) => setValores({ ...valores, trigliceridos: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                  placeholder="Ej: 180"
                  data-testid="input-trigliceridos"
                />
              </div>

              {/* Hemoglobina */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#4B4B3B' }}>
                  <Activity className="w-4 h-4" style={{ color: '#6B7041' }} />
                  Hemoglobina (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={valores.hemoglobina}
                  onChange={(e) => setValores({ ...valores, hemoglobina: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ borderColor: '#D4D3CC', backgroundColor: '#FFFFFF' }}
                  placeholder="Ej: 13.5"
                  data-testid="input-hemoglobina"
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleAnalizar}
                className="px-10 py-3 rounded-lg font-bold transition text-base"
                style={{ 
                  backgroundColor: '#A15C38',
                  color: '#FFFFFF'
                }}
                data-testid="button-analizar"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8C4E30'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A15C38'}
              >
                Analizar Resultados
              </button>
            </div>
          </div>

          {/* Results */}
          {resultados && Object.keys(resultados).length > 0 && (
            <div className="space-y-4">
              <h2 
                className="text-2xl font-bold mb-6 text-center" 
                style={{ color: '#3E3E2E' }}
              >
                Tus Resultados
              </h2>

              {Object.entries(resultados).map(([key, interp]) => (
                <div
                  key={key}
                  className="rounded-lg p-6"
                  style={{ 
                    backgroundColor: getEstadoColor(interp.estado),
                    border: `2px solid ${interp.estado === 'normal' ? '#4CAF50' : interp.estado === 'alerta' ? '#FF9800' : '#F44336'}`
                  }}
                  data-testid={`resultado-${key}`}
                >
                  <div className="flex items-start gap-3">
                    {getEstadoIcon(interp.estado)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg" style={{ color: '#3E3E2E' }}>
                          {key === 'a1c' ? 'Hemoglobina A1C' :
                           key === 'glucosaAyunas' ? 'Glucosa en Ayunas' :
                           key === 'colesterolTotal' ? 'Colesterol Total' :
                           key === 'ldl' ? 'LDL (Colesterol Malo)' :
                           key === 'hdl' ? 'HDL (Colesterol Bueno)' :
                           key === 'trigliceridos' ? 'Triglicéridos' :
                           'Hemoglobina'}
                        </h3>
                        <span className="font-bold" style={{ color: '#6B7041' }}>
                          {interp.valor} {key === 'a1c' ? '%' : key === 'hemoglobina' ? 'g/dL' : 'mg/dL'}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: '#6F6E66' }}>
                        {interp.rango}
                      </p>
                      <p className="font-semibold mb-2" style={{ color: '#4B4B3B' }}>
                        {interp.mensaje}
                      </p>
                      <p className="text-sm" style={{ color: '#6F6E66' }}>
                        <strong>Recomendación:</strong> {interp.recomendacion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div 
                className="rounded-lg p-6 mt-8"
                style={{ backgroundColor: '#EFEDE8' }}
              >
                <p className="text-sm text-center" style={{ color: '#6F6E66' }}>
                  <strong>Nota importante:</strong> Esta interpretación es educativa y no sustituye la consulta médica profesional. 
                  Siempre consulta con tu médico sobre tus resultados de laboratorio.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
