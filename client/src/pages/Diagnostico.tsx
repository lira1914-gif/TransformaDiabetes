import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Answer {
  questionIndex: number;
  answer: string;
}

export default function Diagnostico() {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    // Leer datos del pre-registro
    const preData = localStorage.getItem('NM_pre');
    if (preData) {
      try {
        const pre = JSON.parse(preData);
        if (pre.nombre) {
          setUserName(pre.nombre);
        }
      } catch (e) {
        console.error('Error parsing pre-registration data:', e);
      }
    }
  }, []);

  const questions = [
    {
      emoji: "1️⃣",
      text: "¿Qué área de tu salud te preocupa más últimamente?",
      options: [
        "Glucosa / resistencia a la insulina",
        "Digestión / inflamación",
        "Hormonas / peso",
        "Estrés / sueño"
      ]
    },
    {
      emoji: "2️⃣",
      text: "¿Qué describe mejor tu estado actual?",
      options: [
        "Me cuesta bajar el azúcar o mantenerla estable",
        "Tengo antojos frecuentes de azúcar o carbohidratos",
        "Siento inflamación abdominal o digestiva",
        "Estoy cansado aunque duerma bien"
      ]
    },
    {
      emoji: "3️⃣",
      text: "¿Qué te gustaría lograr?",
      options: [
        "Controlar mis niveles de azúcar",
        "Revertir mi resistencia a la insulina o diabetes tipo 2",
        "Reducir la inflamación y el cansancio",
        "Recuperar mi energía y equilibrio hormonal"
      ]
    }
  ];

  const handleAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionIndex === questionIndex);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionIndex, answer };
    } else {
      newAnswers.push({ questionIndex, answer });
    }
    
    setAnswers(newAnswers);
  };

  const handleContinue = () => {
    if (answers.length === questions.length) {
      // Guardar respuestas en localStorage
      localStorage.setItem('NM_diagnostico_simple', JSON.stringify(answers));
      // Redirigir a resultados
      setLocation("/resultados");
    }
  };

  const isComplete = answers.length === questions.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div 
          className="max-w-3xl mx-auto px-4 sm:px-6"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E6E3D9',
            padding: '2rem',
            margin: '2rem auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
          }}
        >
          {userName ? (
            <h1 
              className="text-2xl md:text-3xl font-bold text-center mb-2"
              style={{ color: '#556B2F' }}
            >
              Hola, {userName} 👋
              <br />
              Vamos a conocer cómo se está comunicando tu cuerpo.
            </h1>
          ) : (
            <h1 
              className="text-2xl md:text-3xl font-bold text-center mb-2"
              style={{ color: '#556B2F' }}
            >
              Tu diagnóstico funcional
            </h1>
          )}
          
          <p 
            className="text-center mb-6"
            style={{ color: '#6F6E66' }}
          >
            Responde con calma. Solo te tomará 1–2 minutos.
          </p>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: '#FDFCF9',
                  border: '1px solid #E6E3D9'
                }}
              >
                <p 
                  className="font-semibold mb-3"
                  style={{ color: '#3A3A3A' }}
                >
                  {question.emoji} {question.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = answers.find(
                      a => a.questionIndex === index && a.answer === option
                    );
                    
                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswer(index, option)}
                        className="px-4 py-2 rounded-md transition-colors"
                        style={{
                          border: '1px solid #E6E3D9',
                          backgroundColor: isSelected ? '#556B2F' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#3A3A3A',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#F4F2EC';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }
                        }}
                        data-testid={`button-option-${index}-${optionIndex}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handleContinue}
              disabled={!isComplete}
              className="w-full md:w-auto mx-auto block px-6 py-3 rounded-lg font-bold text-white transition-all"
              style={{
                backgroundColor: isComplete ? '#A15C38' : '#D1B9A8',
                cursor: isComplete ? 'pointer' : 'not-allowed',
                marginTop: '2rem'
              }}
              onMouseEnter={(e) => {
                if (isComplete) {
                  e.currentTarget.style.backgroundColor = '#8C4E30';
                }
              }}
              onMouseLeave={(e) => {
                if (isComplete) {
                  e.currentTarget.style.backgroundColor = '#A15C38';
                }
              }}
              data-testid="button-ver-resultado"
            >
              Ver mi resultado funcional
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
