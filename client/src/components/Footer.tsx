import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Facebook, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">NutriMarvin</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Transformando vidas a través de la nutrición funcional y el poder de la reversión de DM2.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Diagnóstico Gratuito
                </Link>
              </li>
              <li>
                <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Descargar Guía
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Recibe consejos semanales de salud
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="tu@email.com" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                data-testid="input-newsletter"
              />
              <Button 
                variant="secondary" 
                size="icon"
                data-testid="button-newsletter-submit"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-xs text-primary-foreground/60">
            © 2025 NutriMarvin. Todos los derechos reservados.
          </p>
          <p className="text-xs text-primary-foreground/60 mt-2">
            Esta información es de carácter educativo y no sustituye el consejo médico profesional. 
            Consulta siempre con tu médico antes de realizar cambios en tu tratamiento.
          </p>
        </div>
      </div>
    </footer>
  );
}
