import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import PreRegistro from "@/pages/PreRegistro";
import Diagnostico from "@/pages/Diagnostico";
import Resultados from "@/pages/Resultados";
import Suscripcion from "@/pages/Suscripcion";
import Bienvenida from "@/pages/Bienvenida";
import Perfil from "@/pages/Perfil";
import Analisis from "@/pages/Analisis";
import Guia from "@/pages/Guia";
import ChatSemanal from "@/pages/ChatSemanal";
import Modulo1 from "@/pages/Modulo1";
import Privacidad from "@/pages/Privacidad";
import Terminos from "@/pages/Terminos";
import Reembolsos from "@/pages/Reembolsos";
import CancelacionConfirmada from "@/pages/CancelacionConfirmada";
import ReactivacionConfirmada from "@/pages/ReactivacionConfirmada";
import NotFound from "@/pages/not-found";

import OnboardingCheckout from "@/pages/onboarding/Checkout";
import OnboardingBienvenida from "@/pages/onboarding/Bienvenida";
import OnboardingBienvenidaTrial from "@/pages/onboarding/BienvenidaTrial";
import OnboardingMotivacion from "@/pages/onboarding/Motivacion";
import OnboardingFormularioSalud from "@/pages/onboarding/FormularioSalud";
import OnboardingIntake from "@/pages/onboarding/IntakeFormPage";
import OnboardingMensaje from "@/pages/onboarding/Mensaje";
import OnboardingMes1 from "@/pages/onboarding/Mes1";
import OnboardingInforme from "@/pages/onboarding/Informe";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pre-registro" component={PreRegistro} />
      <Route path="/diagnostico" component={Diagnostico} />
      <Route path="/resultados" component={Resultados} />
      <Route path="/suscripcion" component={Suscripcion} />
      <Route path="/bienvenida" component={Bienvenida} />
      <Route path="/perfil" component={Perfil} />
      <Route path="/analisis" component={Analisis} />
      <Route path="/guia" component={Guia} />
      <Route path="/chat-semanal" component={ChatSemanal} />
      <Route path="/modulo-1" component={Modulo1} />
      <Route path="/privacidad" component={Privacidad} />
      <Route path="/terminos" component={Terminos} />
      <Route path="/reembolsos" component={Reembolsos} />
      <Route path="/cancelacion-confirmada" component={CancelacionConfirmada} />
      <Route path="/reactivacion-confirmada" component={ReactivacionConfirmada} />
      
      <Route path="/onboarding/checkout" component={OnboardingCheckout} />
      <Route path="/onboarding/bienvenida" component={OnboardingBienvenida} />
      <Route path="/onboarding/bienvenida-trial" component={OnboardingBienvenidaTrial} />
      <Route path="/onboarding/motivacion" component={OnboardingMotivacion} />
      <Route path="/onboarding/formulario-salud" component={OnboardingFormularioSalud} />
      <Route path="/onboarding/intake" component={OnboardingIntake} />
      <Route path="/onboarding/mensaje" component={OnboardingMensaje} />
      <Route path="/onboarding/mes1" component={OnboardingMes1} />
      <Route path="/onboarding/informe-inicial" component={OnboardingInforme} />
      <Route path="/onboarding/informe" component={OnboardingInforme} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
