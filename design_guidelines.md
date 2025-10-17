# TransformaDiabetes - Revertir DM2: Design Guidelines

## Design Approach: Wellness-Focused Reference Design
Drawing inspiration from leading health platforms (Headspace, Noom, Calm) that balance educational authority with emotional warmth. This approach creates trust through clean layouts while maintaining an approachable, hopeful aesthetic essential for health transformation narratives.

**Core Principles:**
- Trust through clarity: Information hierarchy that guides without overwhelming
- Empathetic design: Warm, inviting visuals that reduce health anxiety
- Action-oriented: Clear pathways from education to engagement

## Color Palette

**Primary Colors:**
- Verde Oliva: 75 25% 35% (primary brand color, headers, CTAs)
- Beige: 40 30% 85% (backgrounds, cards, warmth)
- Terracota: 15 55% 55% (accents, highlights, energy)

**Supporting Colors:**
- Dark text: 0 0% 15%
- Light text on dark: 40 20% 95%
- Success green: 140 40% 45%
- Border/dividers: 40 15% 75%

**Background Strategy:**
- Primary sections: Beige base (40 30% 85%)
- Alternating sections: Pure white for contrast
- Cards on beige: White with subtle shadow
- Diagnostic tool: Lighter beige (40 25% 92%) for focus

## Typography

**Font Families:**
- Headings: 'Playfair Display' (serif, warmth + authority)
- Body: 'Inter' (clean, readable)

**Scale:**
- H1: text-5xl md:text-6xl, font-bold (Hero headlines)
- H2: text-4xl md:text-5xl, font-semibold (Section headers)
- H3: text-2xl md:text-3xl, font-semibold (Subsections)
- Body: text-base md:text-lg, leading-relaxed
- Small: text-sm (disclaimers, meta info)

## Layout System

**Spacing Units:** Tailwind units of 4, 6, 8, 12, 16, 20, 24 (e.g., p-8, my-12, gap-6)

**Container Strategy:**
- Full-width sections with max-w-6xl centered containers
- Educational content: max-w-4xl for readability
- Diagnostic tool: max-w-3xl for focus

**Section Padding:** py-16 md:py-24 for consistent rhythm

## Component Library

### Navigation
- Sticky header with subtle beige background
- Logo left, navigation links center, "Comenzar Diagnóstico" CTA right
- Mobile: Hamburger menu with smooth slide-in drawer

### Hero Section (Landing Page)
- Height: min-h-screen with centered content
- Split layout: 60% text left, 40% hero image right
- Hero image: Warm, lifestyle photo of healthy food preparation or person feeling energized (natural lighting, authentic)
- Headline in Playfair Display with Verde Oliva
- Subheadline in Inter, dark gray
- Dual CTA: Primary "Realizar Diagnóstico Gratuito" (terracota), Secondary "Descargar Guía" (outline verde oliva with backdrop-blur)

### Educational Sections (5-6 sections)
1. **¿Qué es la Reversión de DM2?** - Text + infographic/icons explaining process
2. **Los 3 Pilares** - 3-column grid with icons, verde oliva accents
3. **Historias de Éxito** - 2-column testimonial cards with before/after context (not photos)
4. **Por Qué Funciona la Nutrición Funcional** - Text with supporting image of wholesome ingredients
5. **Cómo Empezar** - Step-by-step guide, numbered list with terracota accents
6. **Herramientas Gratuitas** - CTA section for diagnostic tool

### Diagnostic Tool Interface
- Progress bar: terracota fill, beige background
- Question cards: White cards on light beige background, generous padding (p-8)
- Input types: Radio buttons (verde oliva when selected), checkboxes, range sliders (terracota track)
- Navigation: "Anterior" and "Siguiente" buttons, primary verde oliva
- Completion: Celebration moment with terracota accent, "Ver Resultados" CTA

### Results Page
- Hero: Personalized greeting "Tus Resultados, [Nombre]"
- Insight cards: Grid of findings with icons, color-coded by severity (verde oliva = good, terracota = attention needed)
- Recommendations section: Numbered action items
- Resources: Links to relevant educational content
- Primary CTA: "Descargar Tu Plan Personalizado" (terracota button)
- Secondary CTA: "Únete por $5/mes" with value proposition

### Footer
- 3-column layout: Acerca de TransformaDiabetes | Enlaces Rápidos | Newsletter + Social
- Newsletter: Input + submit in verde oliva
- Background: Verde oliva dark, light text
- Disclaimer: Small text about educational nature, not medical advice

## Images

**Hero Image:** Lifestyle photography showing healthy meal prep, vibrant vegetables, or person feeling energized post-meal. Warm, natural lighting. Authentic, not stock-looking. Position: right 40% of hero section.

**Section Images:** 
- Wholesome ingredients (vegetables, nuts, healthy fats) for "Por Qué Funciona" section
- Optional: Simple illustrated icons for "3 Pilares" (leaf, heart, science symbols) in verde oliva

**Image Treatment:** Subtle rounded corners (rounded-lg), soft shadows, never harsh edges.

## Interactions & Animations

**Minimal, Purposeful Only:**
- Smooth scroll between sections
- Hover states: Subtle lift on cards (hover:shadow-lg transition)
- CTA hover: Slight scale (hover:scale-105)
- Diagnostic progress bar: Smooth width transition
- Results reveal: Gentle fade-in as user scrolls

**No animations** on form inputs, navigation, or text content.

## Accessibility & Spanish Language

- All text, labels, buttons, placeholders in Spanish
- Empathetic, hopeful tone: "Tu camino hacia la salud", "Descubre tu potencial"
- Form validation messages in Spanish
- Alt text for images in Spanish
- Contrast ratio minimum 4.5:1 for all text

## Call-to-Action Strategy

**Primary CTA:** "Realizar Diagnóstico Gratuito" - appears in hero, mid-page, footer
**Secondary CTA:** "Descargar Guía Gratuita" - outline style, appears strategically
**Conversion CTA:** "Únete por $5/mes - Acceso Total" - results page + footer, with benefit bullets