import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sprout, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModuleCheckResponse {
  unlockedModules: number[];
  newlyUnlocked: number[];
  message: string | null;
}

export default function Modulo1() {
  const [, setLocation] = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Obtener userId de localStorage
  const userId = localStorage.getItem('tm_user_id');

  // Si no hay userId, redirigir a la página de inicio
  useEffect(() => {
    if (!userId) {
      setLocation('/');
    }
  }, [userId, setLocation]);

  // Verificar módulos desbloqueados
  const { data: moduleCheck, isLoading } = useQuery<ModuleCheckResponse>({
    queryKey: ['/api/modules/check', userId],
    enabled: !!userId,
  });

  useEffect(() => {
    // Mostrar mensaje de bienvenida si es un usuario que acaba de suscribirse
    const justSubscribed = localStorage.getItem('tm_just_subscribed');
    if (justSubscribed === 'true') {
      setShowWelcome(true);
      localStorage.removeItem('tm_just_subscribed');
      
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }
  }, []);

  // Verificar si el usuario tiene acceso al Módulo 1
  const hasAccessToModule1 = moduleCheck?.unlockedModules?.includes(1) || false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#6B7041' }}></div>
            <p style={{ color: '#6F6E66' }}>Cargando módulo...</p>
          </div>
        </main>
      </div>
    );
  }

  // Si no tiene acceso, mostrar mensaje de bloqueo
  if (!hasAccessToModule1) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
        <Header />
        <main className="flex-1 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <Lock className="h-5 w-5" />
                  Módulo bloqueado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-800 mb-4">
                  Este módulo está disponible solo para suscriptores activos. Activa tu suscripción para acceder a todo el contenido educativo.
                </p>
                <Button 
                  onClick={() => setLocation('/onboarding/checkout')}
                  data-testid="button-subscribe-from-module"
                >
                  Activar suscripción ($5 USD/mes)
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <Header />
      
      {/* Mensaje de bienvenida para nuevos suscriptores */}
      {showWelcome && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4">
          <Card className="border-green-200 bg-green-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900 mb-1">
                    ¡Bienvenido a tu transformación funcional! 🌱
                  </p>
                  <p className="text-sm text-green-800">
                    Ya tienes acceso al Módulo 1. Tu camino hacia el equilibrio metabólico comienza aquí.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header del módulo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="px-3 py-1">
                Módulo 1
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-green-700 border-green-300">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Desbloqueado
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#3E3E2E' }}>
              Fundamentos de la Nutrición Funcional
            </h1>
            <p className="text-lg" style={{ color: '#6F6E66' }}>
              Tu primer paso para entender cómo tu alimentación influye en tu metabolismo y bienestar general.
            </p>
          </div>

          {/* Contenido del módulo */}
          <div 
            className="bg-white rounded-lg border p-6 md:p-8 space-y-8"
            style={{ borderColor: '#E6E3D9' }}
          >
            {/* Introducción */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-5 h-5" style={{ color: '#6B7041' }} />
                <h2 className="text-2xl font-bold" style={{ color: '#3E3E2E' }}>
                  Bienvenido a tu proceso de transformación
                </h2>
              </div>
              <p className="leading-relaxed mb-4" style={{ color: '#6F6E66' }}>
                La nutrición funcional no es una dieta temporal, es un nuevo enfoque para entender tu cuerpo. 
                En lugar de contar calorías o seguir reglas rígidas, aprenderás a identificar qué alimentos 
                te dan energía, cuáles te inflaman, y cómo personalizar tu alimentación según tus necesidades únicas.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-medium" style={{ color: '#92400E' }}>
                  💡 Recuerda: Tu cuerpo no está roto, solo necesita el apoyo correcto para volver a su equilibrio natural.
                </p>
              </div>
            </section>

            <hr style={{ borderColor: '#E6E3D9' }} />

            {/* Sección 1: Los 3 pilares metabólicos */}
            <section>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#3E3E2E' }}>
                Los 3 Pilares del Equilibrio Metabólico
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 pl-4" style={{ borderColor: '#6B7041' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#3E3E2E' }}>
                    1. Estabilidad de glucosa
                  </h4>
                  <p style={{ color: '#6F6E66' }}>
                    Mantener tu glucosa estable evita picos de insulina, reduce los antojos y te da energía sostenida 
                    durante todo el día. Esto se logra combinando proteínas, grasas saludables y fibra en cada comida.
                  </p>
                </div>

                <div className="border-l-4 pl-4" style={{ borderColor: '#A15C38' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#3E3E2E' }}>
                    2. Reducción de inflamación
                  </h4>
                  <p style={{ color: '#6F6E66' }}>
                    La inflamación crónica bloquea tu capacidad de quemar grasa y desregula tus hormonas. 
                    Eliminar alimentos procesados, azúcares y aceites refinados es clave para reducir la inflamación sistémica.
                  </p>
                </div>

                <div className="border-l-4 pl-4" style={{ borderColor: '#6B7041' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#3E3E2E' }}>
                    3. Descanso digestivo
                  </h4>
                  <p style={{ color: '#6F6E66' }}>
                    Tu cuerpo necesita ventanas de tiempo para reparar y limpiar. Espaciar tus comidas y evitar 
                    snacks constantes permite que tu sistema digestivo descanse y tu metabolismo se active.
                  </p>
                </div>
              </div>
            </section>

            <hr style={{ borderColor: '#E6E3D9' }} />

            {/* Sección 2: Alimentos que sanan */}
            <section>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#3E3E2E' }}>
                Alimentos que Apoyan tu Metabolismo
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">🥑</span>
                      Grasas saludables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: '#6F6E66' }}>
                      Aguacate, aceite de oliva extra virgen, nueces, semillas de chía. 
                      Te sacian, estabilizan tu glucosa y son antiinflamatorias.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">🥩</span>
                      Proteínas de calidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: '#6F6E66' }}>
                      Huevos orgánicos, pescado salvaje, pollo de pastoreo, legumbres. 
                      Mantienen tu músculo, regulan tu apetito y estabilizan tu energía.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">🥬</span>
                      Vegetales de hoja verde
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: '#6F6E66' }}>
                      Espinaca, kale, acelga, brócoli. Ricos en fibra, minerales y antioxidantes 
                      que apoyan la desintoxicación natural.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">🫐</span>
                      Frutas con bajo índice glucémico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: '#6F6E66' }}>
                      Arándanos, fresas, moras. Aportan antioxidantes sin elevar drásticamente 
                      tu glucosa cuando se consumen con moderación.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <hr style={{ borderColor: '#E6E3D9' }} />

            {/* Sección 3: Tu primer paso */}
            <section>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#3E3E2E' }}>
                Tu Primer Paso: Observa y Ajusta
              </h3>
              <div className="space-y-3">
                <p style={{ color: '#6F6E66' }}>
                  Durante los próximos días, presta atención a cómo te sientes después de cada comida:
                </p>
                <ul className="space-y-2 ml-5">
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#6B7041' }}>✓</span>
                    <span style={{ color: '#6F6E66' }}>¿Tienes energía sostenida o caes en un bajón?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#6B7041' }}>✓</span>
                    <span style={{ color: '#6F6E66' }}>¿Sientes inflamación abdominal o digestión pesada?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#6B7041' }}>✓</span>
                    <span style={{ color: '#6F6E66' }}>¿Tienes antojos intensos de dulce 2-3 horas después?</span>
                  </li>
                </ul>
                <p className="mt-4" style={{ color: '#6F6E66' }}>
                  Usa el <strong>chat semanal</strong> para registrar tus observaciones. Esta información te ayudará 
                  a personalizar tu plan en los próximos módulos.
                </p>
              </div>
            </section>

            {/* Call to action */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E6E3D9' }}>
              <div className="text-center">
                <p className="mb-4 font-medium" style={{ color: '#3E3E2E' }}>
                  Continúa tu aprendizaje en el chat semanal
                </p>
                <Button
                  onClick={() => setLocation('/chat-semanal')}
                  className="w-full md:w-auto"
                  data-testid="button-go-to-chat"
                >
                  Ir al chat semanal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
