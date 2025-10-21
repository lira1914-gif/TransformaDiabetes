import { Zap, HeartPulse, Sun } from "lucide-react";

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
            Revertir no es tapar síntomas; es entender por qué el cuerpo los genera. TransformaDiabetes combina nutrición funcional, biología del estrés y hábitos conscientes para recuperar sensibilidad a la insulina, energía y claridad mental — sin dietas extremas ni respuestas genéricas.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-[#F7F4EE] shadow-sm hover:shadow-md transition-shadow hover-elevate">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(106, 117, 85, 0.1)' }}>
                <Zap className="h-8 w-8" strokeWidth={2} style={{ color: '#6A7555' }} />
              </div>
              <h3 className="font-semibold text-lg">Mejora Metabólica</h3>
              <p className="text-sm text-muted-foreground">
                Restaura tu metabolismo, mejora la sensibilidad a la insulina y enseña a tu cuerpo a usar la glucosa como fuente de energía.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-[#F7F4EE] shadow-sm hover:shadow-md transition-shadow hover-elevate">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(106, 117, 85, 0.1)' }}>
                <HeartPulse className="h-8 w-8" strokeWidth={2} style={{ color: '#6A7555' }} />
              </div>
              <h3 className="font-semibold text-lg">Salud Cardiovascular</h3>
              <p className="text-sm text-muted-foreground">
                Fortalece tu corazón reduciendo la inflamación y equilibrando tus niveles de azúcar y presión.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-[#F7F4EE] shadow-sm hover:shadow-md transition-shadow hover-elevate">
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(106, 117, 85, 0.1)' }}>
                <Sun className="h-8 w-8" strokeWidth={2} style={{ color: '#6A7555' }} />
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
