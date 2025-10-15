import { Apple, Dumbbell, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PilaresSection() {
  const pilares = [
    {
      icon: Apple,
      title: "Nutrición Funcional",
      description: "Alimentos reales que nutren, sanan y restauran tu metabolismo. Aprende qué comer, cuándo comer y por qué cada elección importa.",
      color: "text-primary"
    },
    {
      icon: Dumbbell,
      title: "Movimiento Consciente",
      description: "Ejercicio adaptado a tu condición que mejora la sensibilidad a la insulina y fortalece tu cuerpo sin estrés innecesario.",
      color: "text-chart-3"
    },
    {
      icon: Brain,
      title: "Gestión del Estrés",
      description: "Técnicas probadas para reducir el cortisol y la inflamación, dos factores clave en la resistencia a la insulina.",
      color: "text-chart-2"
    }
  ];

  return (
    <section id="pilares" className="py-16 md:py-24 bg-accent/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary mb-4">
            Los 3 Pilares de la Reversión
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un enfoque integral que aborda tu salud desde múltiples ángulos para resultados duraderos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pilares.map((pilar, index) => {
            const Icon = pilar.icon;
            return (
              <Card key={index} className="hover-elevate transition-all">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-full bg-accent w-fit">
                    <Icon className={`h-8 w-8 ${pilar.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-semibold">{pilar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {pilar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
