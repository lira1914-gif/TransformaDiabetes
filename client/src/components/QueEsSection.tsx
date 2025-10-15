import { Activity, Heart, Sparkles } from "lucide-react";

export default function QueEsSection() {
  return (
    <section id="que-es" className="py-16 md:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          className="text-4xl md:text-5xl font-serif font-semibold text-center mb-12"
          style={{ color: '#5E6647' }}
        >
          ¿Qué significa revertir la diabetes desde la raíz?
        </h2>
        
        <div className="space-y-8 text-base md:text-lg leading-relaxed text-foreground">
          <p>
            Revertir la diabetes tipo 2 no es un milagro, es un proceso fisiológico posible cuando entiendes lo que tu cuerpo necesita. 
            A través de cambios conscientes en tu alimentación, descanso y estilo de vida, puedes restaurar tu sensibilidad a la insulina y recuperar equilibrio, energía y claridad mental.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-[#F7F4EE] shadow-sm hover:shadow-md transition-shadow hover-elevate">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(106, 117, 85, 0.1)' }}>
                <Activity className="h-8 w-8" style={{ color: '#6A7555' }} />
              </div>
              <h3 className="font-semibold text-lg">Mejora Metabólica</h3>
              <p className="text-sm text-muted-foreground">
                Restaura tu metabolismo, mejora la sensibilidad a la insulina y enseña a tu cuerpo a usar la glucosa como fuente de energía.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-[#F7F4EE] shadow-sm hover:shadow-md transition-shadow hover-elevate">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(106, 117, 85, 0.1)' }}>
                <Heart className="h-8 w-8" style={{ color: '#6A7555' }} />
              </div>
              <h3 className="font-semibold text-lg">Salud Cardiovascular</h3>
              <p className="text-sm text-muted-foreground">
                Fortalece tu corazón reduciendo la inflamación y equilibrando tus niveles de azúcar y presión.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-[#F7F4EE] shadow-sm hover:shadow-md transition-shadow hover-elevate">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(106, 117, 85, 0.1)' }}>
                <Sparkles className="h-8 w-8" style={{ color: '#6A7555' }} />
              </div>
              <h3 className="font-semibold text-lg">Energía y Vitalidad</h3>
              <p className="text-sm text-muted-foreground">
                Recupera la claridad mental, el descanso profundo y la energía estable que tu cuerpo merece.
              </p>
            </div>
          </div>
          
          <p className="mt-8" style={{ color: '#5E6647' }}>
            La clave está en comprender que la diabetes tipo 2 no es una sentencia, sino una respuesta adaptativa de tu cuerpo. 
            Cuando abordas las causas raíz —la resistencia a la insulina y la inflamación crónica—, el cuerpo puede volver a su equilibrio natural.
          </p>
        </div>
      </div>
    </section>
  );
}
