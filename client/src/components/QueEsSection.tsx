import { Activity, Heart, Sparkles } from "lucide-react";

export default function QueEsSection() {
  return (
    <section id="que-es" className="py-16 md:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary text-center mb-12">
          ¿Qué es la Reversión de DM2?
        </h2>
        
        <div className="space-y-8 text-base md:text-lg leading-relaxed text-foreground">
          <p>
            La reversión de la Diabetes Tipo 2 no es un sueño, es una realidad científicamente comprobada. 
            A través de cambios estratégicos en tu alimentación y estilo de vida, puedes restaurar la sensibilidad 
            a la insulina y normalizar tus niveles de glucosa en sangre.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-accent/50">
              <div className="p-3 rounded-full bg-primary/10">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Mejora Metabólica</h3>
              <p className="text-sm text-muted-foreground">
                Restaura tu metabolismo y sensibilidad a la insulina
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-accent/50">
              <div className="p-3 rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Salud Cardiovascular</h3>
              <p className="text-sm text-muted-foreground">
                Reduce riesgos y fortalece tu corazón
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-accent/50">
              <div className="p-3 rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Energía y Vitalidad</h3>
              <p className="text-sm text-muted-foreground">
                Recupera tu energía y bienestar diario
              </p>
            </div>
          </div>
          
          <p>
            La clave está en entender que la diabetes tipo 2 es una condición reversible cuando abordamos 
            sus causas raíz: la resistencia a la insulina y la inflamación crónica. Con el enfoque correcto, 
            puedes recuperar el control de tu salud.
          </p>
        </div>
      </div>
    </section>
  );
}
