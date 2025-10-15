import { Link } from "wouter";
import ctaImage from "@assets/image_1760560894345.png";

export default function CTASection() {
  return (
    <section className="py-12 md:py-20 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/diagnostico">
          <div className="relative cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src={ctaImage} 
              alt="Tu cuerpo no necesita control, necesita comprensión - Haz tu diagnóstico gratuito ahora"
              className="w-full h-auto rounded-2xl shadow-lg"
              data-testid="image-cta-diagnostico"
            />
            <div 
              className="absolute inset-0 rounded-2xl"
              data-testid="button-diagnostico-cta"
              aria-label="Ir al diagnóstico gratuito"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
