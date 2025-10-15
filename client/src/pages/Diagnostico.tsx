import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiagnosticoWizard from "@/components/DiagnosticoWizard";
import { Button } from "@/components/ui/button";

export default function Diagnostico() {
  const [started, setStarted] = useState(false);
  const wizardRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setStarted(true);
    // Smooth scroll to wizard after a short delay to allow rendering
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center space-y-8"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h1 
              className="text-3xl md:text-5xl font-serif font-semibold animate-in fade-in duration-700"
              style={{ color: '#6B7041' }}
            >
              Descubre tu patrón funcional
            </h1>
            
            <p 
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: '#5A5A4F' }}
            >
              Tu cuerpo siempre busca equilibrio. Este diagnóstico te ayudará a reconocer qué área necesita más apoyo para recuperar tu energía y revertir la resistencia a la insulina desde la raíz.
            </p>

            <div 
              className="p-6 rounded-xl mx-auto"
              style={{ 
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                maxWidth: '700px'
              }}
            >
              <p className="text-base leading-relaxed" style={{ color: '#7A7A6F' }}>
                El siguiente diagnóstico funcional tiene 14 preguntas y te tomará menos de 3 minutos.<br />
                Tus respuestas son confidenciales y se usan únicamente con fines educativos.
              </p>
            </div>

            <p className="text-sm italic" style={{ color: '#8C847A' }}>
              Respira profundo antes de comenzar. No hay respuestas buenas o malas, solo señales que nos ayudan a entender tu cuerpo.
            </p>

            <div className="pt-6 animate-in fade-in duration-700">
              <Button 
                size="lg"
                className="rounded-xl font-medium text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105 w-[90%] max-w-[320px]"
                style={{ backgroundColor: '#6B7041' }}
                onClick={handleStart}
                data-testid="button-comenzar-diagnostico"
              >
                Comenzar Diagnóstico
              </Button>
            </div>

            <p className="text-sm pt-8" style={{ color: '#999999' }}>
              Esta herramienta es educativa y no sustituye la orientación médica profesional.
            </p>
          </div>

          {started && (
            <div 
              ref={wizardRef}
              className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <DiagnosticoWizard />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
