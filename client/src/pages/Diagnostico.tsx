import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiagnosticoWizard from "@/components/DiagnosticoWizard";

export default function Diagnostico() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 to-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Diagnóstico de Salud Metabólica
            </h1>
            <p className="text-lg text-muted-foreground">
              Responde estas preguntas para obtener un análisis personalizado de tu situación actual
            </p>
          </div>
          <DiagnosticoWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
