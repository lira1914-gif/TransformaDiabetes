# NutriMarvin - Revertir DM2

## Overview
NutriMarvin is a health and wellness web application dedicated to type 2 diabetes reversal through functional nutrition education. It offers educational content, a diagnostic assessment, success stories, and guided pathways to address insulin resistance from a root-cause perspective. The platform aims to build trust and reduce health anxiety with an empathetic, wellness-focused design.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks & Libraries**: React 18 with TypeScript, Vite, Wouter for routing, TanStack Query for state management.
- **UI/UX**: Radix UI primitives, shadcn/ui (New York style), Tailwind CSS with custom design tokens. Uses Playfair Display for headings and Inter for body text. Features a wellness-focused color palette (olive green, beige, terracotta) and a responsive, mobile-first design.
- **Key Features**: 
  - **Landing Page**: Subscription-focused design with hero section, benefits grid (6 key features for $5/month), 4-step "Cómo funciona" process, and prominent CTA
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
- **Design System**: HSL-based color system, consistent spacing, max-width containers, hover effects, and accessible focus states.

### Backend
- **Framework**: Express.js with TypeScript, custom middleware.
- **Data Layer**: Drizzle ORM for PostgreSQL (Neon Database), Drizzle Kit for migrations, Zod for schema validation.
- **Structure**: Monorepo with shared TypeScript types and path aliases.

### Routing
- **Client-Side**: Wouter for SPA routing, including smooth scrolling and 404 handling.
- **Page Flows**: Includes pre-registration, diagnostic assessment, results display with integrated Mini Guía Funcional and subscription CTA, welcome page, health profile form, and blood analysis interpretation.

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