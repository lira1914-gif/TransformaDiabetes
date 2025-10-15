import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-accent/95 backdrop-blur supports-[backdrop-filter]:bg-accent/80 border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-serif font-bold text-primary">NutriMarvin</div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection("que-es")}
              className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors"
              data-testid="link-que-es"
            >
              ¿Qué es?
            </button>
            <button
              onClick={() => scrollToSection("pilares")}
              className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors"
              data-testid="link-pilares"
            >
              Los 3 Pilares
            </button>
            <button
              onClick={() => scrollToSection("historias")}
              className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors"
              data-testid="link-historias"
            >
              Historias
            </button>
            <Link href="/diagnostico">
              <Button variant="default" size="default" data-testid="button-diagnostico-header">
                Comenzar Diagnóstico
              </Button>
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <button
              onClick={() => scrollToSection("que-es")}
              className="block w-full text-left px-3 py-2 text-sm font-medium hover-elevate rounded-md"
              data-testid="link-mobile-que-es"
            >
              ¿Qué es?
            </button>
            <button
              onClick={() => scrollToSection("pilares")}
              className="block w-full text-left px-3 py-2 text-sm font-medium hover-elevate rounded-md"
              data-testid="link-mobile-pilares"
            >
              Los 3 Pilares
            </button>
            <button
              onClick={() => scrollToSection("historias")}
              className="block w-full text-left px-3 py-2 text-sm font-medium hover-elevate rounded-md"
              data-testid="link-mobile-historias"
            >
              Historias
            </button>
            <Link href="/diagnostico">
              <Button variant="default" size="default" className="w-full" data-testid="button-mobile-diagnostico">
                Comenzar Diagnóstico
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
