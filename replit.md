# TransformaDiabetes - Revertir DM2

## Overview
TransformaDiabetes is a health and wellness web application dedicated to type 2 diabetes reversal through functional nutrition education. It offers educational content, a diagnostic assessment, success stories, and guided pathways to address insulin resistance from a root-cause perspective. The platform aims to build trust and reduce health anxiety with an empathetic, wellness-focused design.

## Brand Identity
**Name:** TransformaDiabetes
**Previous Name:** NutriMarvin (discontinued due to trademark conflict with nutrimarvin.com - Brazilian nutritionist in same industry)
**Change Date:** October 2025
**Domain:** transformadiabetes.com (registered at Chespirito domain)
**Logo:** AI-generated complete logo with organic root/transformation symbol, brand colors (olive green #556B2F, beige, terracotta), includes tagline "Nutrición funcional para revertir desde la raíz" (attached_assets/generated_images/TransformaDiabetes_complete_logo_with_tagline_2f0190f6.png)
**Hero Image:** AI-generated image of Latino man with fuller build viewing tablet with "Metabolismo" text (attached_assets/generated_images/Latino_man_tablet_metabolismo_f95a9523.png)

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks & Libraries**: React 18 with TypeScript, Vite, Wouter for routing, TanStack Query for state management.
- **UI/UX**: Radix UI primitives, shadcn/ui (New York style), Tailwind CSS with custom design tokens. Uses Playfair Display for headings and Inter for body text. Features a wellness-focused color palette (olive green, beige, terracotta) and a responsive, mobile-first design.
- **Key Features**: 
  - **Landing Page**: Simplified, conversion-focused design with minimal hero section emphasizing "Tu cuerpo no está roto. Solo está protegiéndose." Direct CTA to diagnostic flow.
  - Multi-step diagnostic wizard (3 questions mapping to 4 health axes and 10 patterns)
  - Personalized results with 5-point recommendations integrated with pattern-specific Mini Guías Funcionales
  - Legal pages: Términos de Servicio, Política de Privacidad, Política de Reembolsos (required for Paddle onboarding)
- **Diagnostic System**: Simplified 3-question diagnostic leading to 10 possible functional patterns (4 individual, 6 combined).
- **Mini Guías Funcionales**: Pattern-specific educational guides that display unique title and blockquote based on detected pattern:
  - 🩸 Metabólico → "Guía Metabólica" + "Tu cuerpo no puede sanar en estado de alerta."
  - 💩 Digestivo → "Guía Digestiva" + "Si no fluyes, acumulas; y si acumulas, el cuerpo se defiende."
  - 🌙 Estrés → "Guía del Estrés" + "No todo lo que te acelera te impulsa; a veces te apaga."
  - 🔥 Inflamatorio → "Guía Inflamatoria" + "La inflamación no es enemiga; es el lenguaje de tu cuerpo pidiendo equilibrio."
  - Combined patterns inherit guide from their primary pattern.
- **Welcome Section (Bienvenida)**: Appears inline after clicking subscribe with fade-in animation:
  - Translucent background with Unsplash nature image overlay
  - White semi-transparent card (rgba(255,255,255,0.85)) containing welcome content
  - 6 subscription benefits including blood analysis review
  - CTA: "Empezar mi registro funcional" to begin intake process
  - Motivational closing phrase: "Tu cuerpo no está roto, solo está protegiéndose. Vamos a enseñarle cómo sentirse seguro otra vez." (with light green background)
- **Formulario de Historial Funcional (Intake)**: Medical history form for functional assessment:
  - Appears after clicking "Empezar mi registro funcional" in welcome section
  - 15 comprehensive fields covering: demographics (name, age, sex, email), medical history (diagnoses, medications, supplements, family history), digestive health (bowel frequency, symptoms), lifestyle (sleep hours, energy level, recent diet, physical activity, stress level), and personal goals
  - All data saved to localStorage as JSON (key: "intakeTransformaDiabetes")
  - Motivational copy: "Tu información es confidencial y nos ayuda a personalizar tus recomendaciones"
  - On completion, shows toast notification and reveals post-intake message
- **Mensaje Post-Intake**: Motivational transition message between intake and 5-day registration:
  - Appears after intake form submission with smooth scroll
  - Heading: "Excelente 🌿"
  - Thanks user for sharing their functional history
  - Explains the purpose of the 5-day observation period
  - Emphasizes consistency over perfection
  - CTA button: "Comenzar mi registro de 5 días"
- **Registro de 5 Días**: Multi-day functional registration form:
  - Appears after completing intake form
  - Dynamic form allowing up to 5 days of tracking
  - Each day captures: food intake (textarea), digestion/elimination (select), sleep quality (select), energy levels (select)
  - "Agregar siguiente día" button to add days incrementally (max 5)
  - Data saved to localStorage as JSON (key: "registro5dias")
  - Motivational closing phrase: "Observar es el primer paso para sanar. Tu cuerpo siempre te está hablando."
  - On completion, shows toast notification and reveals final message
- **Mensaje Final de Registro**: Completion message after submitting 5-day diary:
  - Appears after saving 5-day registration with smooth scroll
  - Heading: "Has completado tu Registro Funcional"
  - Congratulates user for learning to listen to their body
  - Blockquote: "Tu cuerpo no puede sanar en estado de alerta. Aprender a escucharlo es la forma más profunda de sanación."
  - Explains next step: receiving functional recommendations
  - CTA button: "Ver mis recomendaciones iniciales"
    - If diagnostic completed: navigates to /resultados (shows pattern + 5 recommendations)
    - If no diagnostic: navigates to /pre-registro (starts diagnostic flow)
- **Design System**: HSL-based color system, consistent spacing, max-width containers, hover effects, and accessible focus states.

### Backend
- **Framework**: Express.js with TypeScript, custom middleware.
- **Data Layer**: Drizzle ORM for PostgreSQL (Neon Database), Drizzle Kit for migrations, Zod for schema validation.
- **Structure**: Monorepo with shared TypeScript types and path aliases.

### Routing
- **Client-Side**: Wouter for SPA routing with smooth scrolling (scroll-behavior: smooth in CSS).
- **Landing Page Architecture**: Single-page scroll design with all educational content in one flow:
  - Home (/) contains all sections: Hero, QueEs, Pilares, Historias, Suscripción
  - Sections have IDs for anchor navigation (#que-es, #pilares, #suscripcion)
  - Header "Inicio" link scrolls to top when already on home page
  - /suscripcion route redirects to home with scroll to #suscripcion section
- **Subscription Flow**: Multi-step inline flow within same page:
  1. Clicking "Unirme por $5 USD/mes" reveals welcome section with fade-in animation
  2. Clicking "Empezar mi registro funcional" reveals intake form (15-field medical history)
  3. Completing intake form reveals motivational post-intake message
  4. Clicking "Comenzar mi registro de 5 días" reveals 5-day registration form
  5. Completing and saving 5-day registration reveals final completion message
  - No route changes, smooth scroll animations between sections
  - All data persists in localStorage (intakeTransformaDiabetes + registro5dias)
- **Diagnostic Flow**: Separate pages for interactive flows (pre-registration, diagnostic assessment, results)
- **Additional Pages**: Welcome page, health profile form, blood analysis interpretation, legal pages

## External Dependencies

### UI Libraries
- Radix UI
- Lucide React (icons)
- class-variance-authority
- cmdk
- embla-carousel-react

### Database & ORM
- Drizzle ORM
- @neondatabase/serverless
- drizzle-zod

### Form Management & Validation
- react-hook-form
- @hookform/resolvers
- zod

### Utilities
- date-fns
- clsx & tailwind-merge
- nanoid

### Development Tools
- TypeScript
- PostCSS & Autoprefixer
- Vite
- esbuild
- tsx

### Payment Integration
- **Paddle Billing** (for $5/month subscriptions)
  - Server-side: `@paddle/paddle-node-sdk` for transaction creation
  - API endpoint: `/api/create-checkout-session` creates Paddle transactions and returns checkout URLs
  - Environment: Auto-detects sandbox vs production based on API key prefix (pdl_sdbx_ = sandbox, pdl_live_ = production)
  - Current Status: **Configured in Sandbox mode** - fully functional for testing
    - Sandbox API Key: pdl_sdbx_... (configured in secrets)
    - Sandbox Price ID: pri_01k7q8k5740qednqg9wepm2g5v
    - Default Payment Link: Configured in Paddle dashboard
  - Production Migration: When Paddle onboarding completes, update secrets with production credentials:
    - Replace PADDLE_API_KEY with live key (pdl_live_...)
    - Replace PADDLE_PRICE_ID with production price ID
    - System will auto-detect and switch to production mode
  - Flow: User clicks subscribe → Backend creates transaction → Redirect to Paddle hosted checkout
  - Advantages: Multi-currency support (30+ currencies), automatic tax/VAT compliance, acts as Merchant of Record