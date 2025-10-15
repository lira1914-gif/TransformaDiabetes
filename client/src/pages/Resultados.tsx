import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, TrendingUp, Download, Star } from "lucide-react";

export default function Resultados() {
  // TODO: remove mock functionality - these would come from actual diagnostic data
  const insights = [
    {
      level: "attention",
      icon: AlertCircle,
      title: "Área de Oportunidad",
      description: "Tu alimentación actual presenta oportunidades significativas de mejora. Los alimentos procesados pueden estar contribuyendo a la resistencia a la insulina."
    },
    {
      level: "good",
      icon: CheckCircle2,
      title: "Aspecto Positivo",
      description: "Has reconocido la importancia de hacer cambios, lo cual es el primer paso crucial hacia la reversión."
    },
    {
      level: "improvement",
      icon: TrendingUp,
      title: "Potencial de Mejora",
      description: "Incrementar tu actividad física a 3-4 veces por semana puede mejorar significativamente tu sensibilidad a la insulina."
    }
  ];

  const recomendaciones = [
    "Comienza eliminando bebidas azucaradas y reemplázalas con agua o té sin azúcar",
    "Incorpora proteína de calidad en cada comida para estabilizar tu glucosa",
    "Añade vegetales de hoja verde a tus comidas principales",
    "Establece horarios regulares de comida para regular tu metabolismo",
    "Inicia con caminatas de 20 minutos después de las comidas principales"
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Tus Resultados Personalizados
            </h1>
            <p className="text-lg text-muted-foreground">
              Basado en tus respuestas, aquí está tu análisis y plan de acción
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-semibold text-primary mb-6">
                Análisis de tu Situación Actual
              </h2>
              <div className="grid gap-6">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  const colorMap = {
                    attention: "text-chart-2",
                    good: "text-chart-3",
                    improvement: "text-primary"
                  };
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full bg-accent ${colorMap[insight.level as keyof typeof colorMap]}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{insight.title}</CardTitle>
                            <p className="text-muted-foreground leading-relaxed">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-semibold text-primary mb-6">
                Tus Primeros Pasos Recomendados
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ol className="space-y-4">
                    {recomendaciones.map((recomendacion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1 flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <p className="text-foreground leading-relaxed">{recomendacion}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </section>

            <section className="bg-gradient-to-br from-primary/5 to-accent/50 rounded-lg p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-serif font-semibold text-primary mb-4">
                  ¿Listo para dar el siguiente paso?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Obtén acceso a tu plan completo personalizado y todos nuestros recursos
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-terracota hover:bg-terracota text-terracota-foreground border border-terracota"
                  data-testid="button-descargar-plan"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Plan Personalizado
                </Button>
                <Button 
                  variant="default" 
                  size="lg"
                  data-testid="button-unirse-premium"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Únete por $5/mes
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Incluye: Plan de alimentación completo • Recetas • Seguimiento de progreso • Comunidad de apoyo
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
