import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PreRegistro() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    edad: "",
    sexo: "",
    diagnostico: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.nombre || !formData.email || !formData.edad || !formData.sexo || !formData.diagnostico) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    // Guardar en localStorage para usar en diagnóstico/resultados
    localStorage.setItem('NM_pre', JSON.stringify({
      nombre: formData.nombre,
      email: formData.email,
      edad: formData.edad,
      sexo: formData.sexo,
      dx: formData.diagnostico,
      ts: Date.now()
    }));

    toast({
      title: "Datos guardados",
      description: "Continuando al diagnóstico funcional...",
    });

    // Redirigir al diagnóstico
    setTimeout(() => {
      setLocation("/diagnostico");
    }, 800);
  };

  const handleCancel = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <div 
          className="max-w-3xl mx-auto rounded-xl p-6 sm:p-8"
          style={{ 
            backgroundColor: '#FFFFFF',
            border: '1px solid #E6E3D9',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
          }}
        >
          <h1 
            className="text-2xl sm:text-3xl font-bold text-center mb-2"
            style={{ color: '#556B2F' }}
          >
            Tu cuerpo no está roto — solo está protegiéndose.
          </h1>
          <p 
            className="text-center mb-6 sm:mb-8 text-sm sm:text-base"
            style={{ color: '#6F6E66' }}
          >
            Antes de empezar, deja tus datos para personalizar tu diagnóstico.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Nombre y Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="nombre" 
                  className="block font-semibold mb-2"
                  style={{ color: '#3A3A3A' }}
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg text-base"
                  style={{ 
                    border: '1px solid #E6E3D9',
                    backgroundColor: '#FFFFFF'
                  }}
                  data-testid="input-nombre"
                  required
                />
              </div>
              <div>
                <label 
                  htmlFor="email" 
                  className="block font-semibold mb-2"
                  style={{ color: '#3A3A3A' }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg text-base"
                  style={{ 
                    border: '1px solid #E6E3D9',
                    backgroundColor: '#FFFFFF'
                  }}
                  data-testid="input-email"
                  required
                />
                <p className="text-xs mt-1.5" style={{ color: '#6F6E66' }}>
                  Usamos tu correo para enviarte tu mini-guía (opcional).
                </p>
              </div>
            </div>

            {/* Edad y Sexo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="edad" 
                  className="block font-semibold mb-2"
                  style={{ color: '#3A3A3A' }}
                >
                  Edad
                </label>
                <input
                  id="edad"
                  name="edad"
                  type="number"
                  min="16"
                  max="99"
                  placeholder="Ej. 42"
                  value={formData.edad}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg text-base"
                  style={{ 
                    border: '1px solid #E6E3D9',
                    backgroundColor: '#FFFFFF'
                  }}
                  data-testid="input-edad"
                  required
                />
              </div>
              <div>
                <label 
                  htmlFor="sexo" 
                  className="block font-semibold mb-2"
                  style={{ color: '#3A3A3A' }}
                >
                  Sexo
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg text-base"
                  style={{ 
                    border: '1px solid #E6E3D9',
                    backgroundColor: '#FFFFFF'
                  }}
                  data-testid="select-sexo"
                  required
                >
                  <option value="">Selecciona</option>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                  <option value="Otro">Otro / Prefiero no decir</option>
                </select>
              </div>
            </div>

            {/* Diagnóstico */}
            <div>
              <label 
                htmlFor="diagnostico" 
                className="block font-semibold mb-2"
                style={{ color: '#3A3A3A' }}
              >
                ¿Tienes diagnóstico?
              </label>
              <select
                id="diagnostico"
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg text-base"
                style={{ 
                  border: '1px solid #E6E3D9',
                  backgroundColor: '#FFFFFF'
                }}
                data-testid="select-diagnostico"
                required
              >
                <option value="">Selecciona</option>
                <option value="ninguno">Ninguno</option>
                <option value="prediabetes">Prediabetes</option>
                <option value="dm2">Diabetes tipo 2</option>
                <option value="resistencia_insulina">Resistencia a la insulina</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex gap-3 flex-wrap pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-3 rounded-lg font-bold text-base transition-colors"
                style={{ backgroundColor: '#F1EDE4', color: '#3A3A3A' }}
                data-testid="button-cancelar"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-lg font-bold text-white text-base transition-colors"
                style={{ backgroundColor: '#A15C38' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8C4E30')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#A15C38')}
                data-testid="button-continuar"
              >
                Continuar al diagnóstico
              </button>
            </div>

            {/* Aviso de privacidad */}
            <div 
              className="text-xs sm:text-sm text-center pt-2"
              style={{ color: '#A6A28B' }}
            >
              Privacidad y confidencialidad: tus datos son usados solo para personalizar tu experiencia.{' '}
              <a 
                href="/privacidad" 
                className="underline"
                style={{ color: '#A15C38' }}
              >
                Leer política completa
              </a>
              .
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
