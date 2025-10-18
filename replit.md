# TransformaDiabetes - Revertir DM2

## Overview
TransformaDiabetes is a health and wellness web application focused on reversing type 2 diabetes through functional nutrition education. It provides educational content, a diagnostic assessment, success stories, and guided pathways to address insulin resistance from a root-cause perspective. The platform aims to foster trust and reduce health anxiety with an empathetic, wellness-focused design, offering a clear pathway to health transformation.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX & Frontend
The application uses React 18 with TypeScript, Vite, Wouter for routing, and TanStack Query for state management. The UI is built with Radix UI primitives and shadcn/ui (New York style) using Tailwind CSS with custom design tokens. It features a wellness-focused color palette (olive green, beige, terracotta), Playfair Display for headings, Inter for body text, and a responsive, mobile-first design.

Key frontend features include:
- **Simplified Landing Page**: Conversion-focused with a direct CTA to a multi-step diagnostic wizard.
- **Diagnostic System**: A 3-question diagnostic leading to 10 functional patterns (4 individual, 6 combined), each linked to pattern-specific "Mini Guías Funcionales".
- **Subscription Onboarding Flow**: Multi-page sequential process:
  1. Checkout (Stripe payment)
  2. Bienvenida
  3. Intake Form (10-section medical questionnaire)
  4. Mensaje
  5. Registro (5-day functional tracking: food, mood, bowel movements across 6 daily moments)
  6. Mes 1 Tracker
  7. Informe Inicial (AI-generated personalized functional report)
  - Uses localStorage markers for sequential validation and step-skipping prevention.
- **Informe Funcional**: Dedicated page at `/onboarding/informe-inicial` with clean CSS-based design, fadeInUp animation, and 5 key functional recommendations. Uses simplified styling with #fffdf8 background, max-width 700px, and semantic CSS classes.
- **Dynamic Content**: Welcome section with subscription benefits, rotating motivational messages, and daily tips.
- **Legal Pages**: Términos de Servicio, Política de Privacidad, Política de Reembolsos.

### Backend & Database
The backend is built with Express.js and TypeScript, utilizing Drizzle ORM for PostgreSQL (Neon Database) and Zod for schema validation. The project is structured as a monorepo with shared TypeScript types.

**PostgreSQL Database Schema:**
- `users`: Stores user accounts with email, Stripe customer/subscription IDs, and subscription status
- `intake_forms`: 62-field medical intake questionnaire (demographics, health history, lab results)
- `daily_logs`: 5-day functional tracking (sleep data, dates)
- `daily_log_moments`: 6 moments per day (Mañana, Media mañana, Almuerzo, Media tarde, Cena, Noche) tracking food, mood, and bowel movements

**Data Flow:**
1. **Checkout → User Creation**: Stripe Payment Element captures email → Backend creates/updates user in PostgreSQL → Returns `userId` to frontend → Stored in `localStorage('tm_user_id')`
2. **Intake Form**: Frontend sends camelCase payload to POST `/api/intake-form` with `userId` → Stored in `intake_forms` table
3. **5-Day Registry**: Frontend sends each day's data to POST `/api/daily-log` with `userId` → Creates `daily_logs` entry + 6 `daily_log_moments` entries

**Known Security Issue (To be addressed in Phase 3):**
- Currently, `userId` is pulled from `localStorage` and trusted by the backend without verification
- This allows potential impersonation if a malicious user modifies their `localStorage`
- **Future fix**: Implement session-based authentication or verify userId against Stripe customer email on each request

### Routing
Wouter is used for client-side routing with smooth scrolling. The landing page is a single-page scroll design, while the subscription onboarding process is a multi-page sequential flow to enforce completion of each step.

## External Dependencies

### UI & Development
- Radix UI, Lucide React, class-variance-authority, cmdk, embla-carousel-react
- TypeScript, PostCSS, Autoprefixer, Vite, esbuild, tsx
- clsx & tailwind-merge, nanoid

### Data & Forms
- Drizzle ORM, @neondatabase/serverless, drizzle-zod
- react-hook-form, @hookform/resolvers, zod
- date-fns

### Payment Integration
- **Stripe**: Integrated for $5/month subscriptions.
  - Uses Stripe.js with React Stripe Elements (`@stripe/stripe-js`, `@stripe/react-stripe-js`) for secure client-side payment collection.
  - Backend utilizes Stripe Node SDK (`stripe`) for server-side subscription creation via `/api/create-subscription`.
  - Checkout flow: User clicks subscribe → `/onboarding/checkout` page → Stripe Payment Element → Confirmation → `/onboarding/bienvenida`.
  - Environment secrets: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`, `STRIPE_PRICE_ID`.
  - Supports recurring billing, automatic card updates, and PCI-compliant payment processing.
```