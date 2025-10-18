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
- **Subscription Onboarding Flow**: A multi-page sequential process (Bienvenida → Mensaje → Registro → Mes 1 Tracker → Informe) with robust client-side validation using localStorage markers to ensure sequential completion and prevent step-skipping. The "Mensaje" page provides daily functional guidance before users begin their 5-day tracking. This flow includes a comprehensive functional history intake form and a 5-day dietary/lifestyle tracking diary, culminating in a personalized functional report.
- **Informe Funcional**: Dedicated page at `/onboarding/informe-inicial` with clean CSS-based design, fadeInUp animation, and 5 key functional recommendations. Uses simplified styling with #fffdf8 background, max-width 700px, and semantic CSS classes.
- **Dynamic Content**: Welcome section with subscription benefits, rotating motivational messages, and daily tips.
- **Legal Pages**: Términos de Servicio, Política de Privacidad, Política de Reembolsos.

### Backend
The backend is built with Express.js and TypeScript, utilizing Drizzle ORM for PostgreSQL (Neon Database) and Zod for schema validation. The project is structured as a monorepo with shared TypeScript types.

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
- **Paddle Billing**: Integrated for $5/month subscriptions.
  - Utilizes Paddle.js for client-side interaction and `@paddle/paddle-node-sdk` for server-side transaction creation via `/api/create-checkout-session`.
  - Employs the Paddle Overlay modal for a seamless checkout experience.
  - Configured for sandbox environment testing with automatic detection for production switch.
  - Supports multi-currency, automatic tax/VAT compliance, and acts as Merchant of Record.
```