import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function HistoriasSection() {
  const testimonios = [
    {
      nombre: "María G.",
      edad: 52,
      resultado: "HbA1c de 8.5% a 5.4% en 4 meses",
      testimonio: "Después de 10 años medicándome, hoy estoy libre de fármacos. El enfoque de NutriMarvin me devolvió la esperanza y mi salud.",
    },
    {
      nombre: "Carlos R.",
      edad: 48,
      resultado: "Pérdida de 18kg y normalización de glucosa",
      testimonio: "Pensé que estaba condenado a vivir con diabetes. Hoy comprendo que mi cuerpo tiene una capacidad increíble de sanarse.",
    },
  ];

  return (
    <section id="historias" className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary mb-4">
            Historias de Éxito
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Personas reales que han transformado su salud y recuperado su libertad
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonios.map((testimonio, index) => (
            <Card key={index} className="relative overflow-visible">
              <CardContent className="pt-6 space-y-4">
                <Quote className="h-10 w-10 text-primary/20" />
                <p className="text-base leading-relaxed italic text-foreground">
                  "{testimonio.testimonio}"
                </p>
                <div className="pt-4 border-t">
                  <p className="font-semibold text-primary">
                    {testimonio.nombre}, {testimonio.edad} años
                  </p>
                  <p className="text-sm text-chart-3 font-medium mt-1">
                    {testimonio.resultado}
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
