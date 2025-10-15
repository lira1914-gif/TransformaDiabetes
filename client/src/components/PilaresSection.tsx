import { Leaf, Activity, Sunrise } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PilaresSection() {
  const pilares = [
    {
      icon: Leaf,
      title: "Nutrición Funcional",
      description: "Alimentos reales que nutren, sanan y restauran tu metabolismo.\nAprende qué comer, cuándo comer y por qué cada elección influye en tu glucosa y energía.",
      iconColor: "#6A7555"
    },
    {
      icon: Activity,
      title: "Movimiento Consciente",
      description: "Ejercicio adaptado a tu condición que mejora la sensibilidad a la insulina, fortalece tu cuerpo y calma tu sistema nervioso.\nNo más agotamiento: moverte también puede ser medicina.",
      iconColor: "#7A8B6E"
    },
    {
      icon: Sunrise,
      title: "Gestión del Estrés",
      description: "El descanso, la calma y la respiración también regulan tu glucosa.\nAprende a bajar el cortisol y a recuperar la paz interna que tu metabolismo necesita para sanar.",
      iconColor: "#C46B4E"
    }
  ];

  return (
    <section 
      id="pilares" 
      className="py-16 md:py-24"
      style={{
        background: 'linear-gradient(to bottom, #FDFCF9 0%, #F8F6F1 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl md:text-4xl font-serif font-semibold mb-4"
            style={{ color: '#5E6647' }}
          >
            Los 3 Pilares de la Reversión
          </h2>
          <p 
            className="text-lg mx-auto"
            style={{ 
              color: '#7A7A6F',
              maxWidth: '70ch'
            }}
          >
            Tres caminos que equilibran tu metabolismo, restauran tu energía y devuelven a tu cuerpo su capacidad natural de sanar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pilares.map((pilar, index) => {
            const Icon = pilar.icon;
            return (
              <Card 
                key={index} 
                className="hover-elevate transition-all hover:scale-[1.03]"
              >
                <CardHeader>
                  <div className="mb-4 p-3 rounded-full bg-accent w-fit">
                    <Icon 
                      className="h-10 w-10" 
                      strokeWidth={2}
                      style={{ color: pilar.iconColor }}
                    />
                  </div>
                  <CardTitle className="text-2xl font-semibold">{pilar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
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
