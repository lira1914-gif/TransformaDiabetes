import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Suscripcion() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirigir al home con scroll a sección de suscripción
    setLocation("/");
    setTimeout(() => {
      const element = document.getElementById("suscripcion");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [setLocation]);

  return null;
}
