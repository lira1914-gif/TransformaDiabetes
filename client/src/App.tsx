import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import PreRegistro from "@/pages/PreRegistro";
import Diagnostico from "@/pages/Diagnostico";
import Resultados from "@/pages/Resultados";
import Bienvenida from "@/pages/Bienvenida";
import Perfil from "@/pages/Perfil";
import Analisis from "@/pages/Analisis";
import Guia from "@/pages/Guia";
import Privacidad from "@/pages/Privacidad";
import Terminos from "@/pages/Terminos";
import Reembolsos from "@/pages/Reembolsos";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pre-registro" component={PreRegistro} />
      <Route path="/diagnostico" component={Diagnostico} />
      <Route path="/resultados" component={Resultados} />
      <Route path="/bienvenida" component={Bienvenida} />
      <Route path="/perfil" component={Perfil} />
      <Route path="/analisis" component={Analisis} />
      <Route path="/guia" component={Guia} />
      <Route path="/privacidad" component={Privacidad} />
      <Route path="/terminos" component={Terminos} />
      <Route path="/reembolsos" component={Reembolsos} />
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
