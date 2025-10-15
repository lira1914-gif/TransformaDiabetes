import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function HistoriasSection() {
  const testimonios = [
    {
      nombre: "Peter B.",
      edad: 57,
      quote: "Llegué con una A1c de 11.5% y más de 65 libras de sobrepeso.\nEn menos de 6 meses, mi glucosa se estabilizó, bajé 40 libras y, por primera vez en años, duermo sin dolor.\nLo que aprendí con NutriMarvin cambió mi relación con la comida y conmigo mismo.",
      resultado: "HbA1c de 11.5% → 6.5% | -40 lb",
      nota: "Energía, descanso y libertad del miedo al azúcar.",
    },
    {
      nombre: "José Luis M.",
      edad: 50,
      quote: "Pensé que la diabetes era para siempre. Hoy entiendo que mi cuerpo no estaba roto, solo necesitaba apoyo.\nMis niveles se normalizaron, mi energía regresó y ya no vivo con niebla mental.\nAprendí a escuchar las señales de mi cuerpo.",
      resultado: "HbA1c de 9.2% → 5.7% | -22 lb",
      nota: "Claridad mental y control estable de glucosa.",
    },
    {
      nombre: "Marvin L.",
      edad: 56,
      quote: "Después de años de medicación, neuropatía y cansancio, decidí aplicar lo que predico.\nBajé mi A1c de 12.5% a 5.5%, recuperé sensibilidad en mis pies y volví a sentir energía.\nEste enfoque funcional no solo cambió mi salud, sino también mi propósito.",
      resultado: "HbA1c de 12.5% → 5.5% | -40 lb",
      nota: "Reversión completa, sin medicamentos.",
    },
  ];

  return (
    <section 
      id="historias" 
      className="py-16 md:py-24"
      style={{
        background: 'linear-gradient(to bottom, #FDFCF9 0%, #F8F6F1 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl md:text-5xl font-serif font-semibold mb-4"
            style={{ color: '#5E6647' }}
          >
            Historias de Éxito Real
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: '#7A7A6F' }}
          >
            Personas que recuperaron su salud, energía y libertad con un enfoque funcional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonios.map((testimonio, index) => (
            <Card 
              key={index} 
              className="relative overflow-visible rounded-xl shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ backgroundColor: '#FCFBF9' }}
            >
              <CardContent className="p-6 space-y-4">
                <Quote className="h-8 w-8" style={{ color: '#C6C6A6' }} />
                <p 
                  className="text-base leading-relaxed italic font-serif whitespace-pre-line"
                  style={{ color: '#3A3A38' }}
                >
                  "{testimonio.quote}"
                </p>
                <div className="pt-4 space-y-2">
                  <p className="font-bold text-foreground">
                    {testimonio.nombre}, {testimonio.edad} años
                  </p>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: '#6B8A5A' }}
                  >
                    {testimonio.resultado}
                  </p>
                  <p 
                    className="text-sm italic"
                    style={{ color: '#8C847A' }}
                  >
                    {testimonio.nota}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
