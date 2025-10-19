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
- `users`: Stores user accounts with email, Stripe customer/subscription IDs, subscription status, `unlockedModules` (integer array tracking accessible modules), and `subscriptionStartDate` (timestamp for calculating module unlock eligibility)
- `intake_forms`: 62-field medical intake questionnaire (demographics, health history, lab results)
- `daily_logs`: 5-day functional tracking (sleep data, dates)
- `daily_log_moments`: 6 moments per day (Mañana, Media mañana, Almuerzo, Media tarde, Cena, Noche) tracking food, mood, and bowel movements
- `reports`: Stores AI-generated functional medicine reports with `userId` foreign key, `resumen`, `hallazgos`, `recomendaciones`, `fraseFinal`, and `createdAt`

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

### AI Integration & Functional Knowledge Base
- **OpenAI GPT-5**: Integrated via Replit AI Integrations service (no API key required, charged to Replit credits).
  - Model: `gpt-5` (released August 7, 2025) configured in `server/openai.ts`.
  - Endpoint: `/api/generate-report` generates personalized functional medicine reports.
  - Response time: ~40-45 seconds for complete report generation.
  - Uses `response_format: { type: "json_object" }` for structured output.
  - Accepts `moduleNumber` parameter (default: 1) to control recommendation content.

- **Clinical Knowledge Base**: 
  - Source: "Nutrición Funcional Referencias.docx" (143,493 characters) extracted via mammoth library.
  - Full knowledge: `server/conocimiento-funcional.txt` (3,082 lines covering 10+ modules: digestive, immune, urinary, endocrine, neurological, reproductive systems).
  - Condensed version: `server/conocimiento-funcional-condensado.txt` contains key functional medicine concepts structured for AI prompt integration.
  - Includes: Three Roots/Many Branches framework, 6R protocol, functional biomarkers, inflammation/autoimmunity, therapeutic nutrition, herb/supplement protocols.
  
- **Modular AI System** (Phase 3C):
  - **Module 1 "Empieza desde la raíz"**: Education and habits ONLY (no supplements, vitamins, herbs, or phytotherapy).
    - Focus: Identify root causes and functional patterns through lifestyle changes.
    - Content: Sleep hygiene, hydration, functional nutrition, circadian rhythm, stress management, body awareness.
    - Tone: Empathetic, simple language ("Your body isn't broken, it's protecting itself").
    - Closing reminder: "This first step helps you understand what your body is telling you. We don't use supplements yet; we only observe, understand, and help your body feel safe."
  
  - **Module 2+ "Suplementos Esenciales"**: Educational supplement suggestions without doses or brands.
    - Focus: Introduce functional nutritional support and educational phytotherapy.
    - Content: Can mention supplements (e.g., magnesium, omega-3, chromium, berberine) ONLY if clinically warranted.
    - Format: General suggestions without specific dosages or brand names.
    - Safety reminder: "Always consult your doctor or nutritionist before implementing changes."
    - Closing: "This guide is educational and does not replace professional medical guidance."

- **AI Report Generation Framework**:
  - System message includes complete condensed functional knowledge base + module-specific instructions.
  - Applies "Tres Raíces, Muchas Ramas" model (Genética, Digestión, Inflamación).
  - Identifies functional patterns: insulin resistance, intestinal permeability, dysbiosis, adrenal dysfunction.
  - Module 1 prioritizes: Essential habits → Functional nutrition → Education about body systems.
  - Module 2+ prioritizes: Essential habits → Functional nutrition → Educational supplement support → Herbs/adaptogens.
  - Generates 4-section reports: Resumen, Hallazgos, Recomendaciones, Frase Final.
  - Focuses on root-cause analysis vs. symptom management.
  - Uses empathetic tone with simple metaphors: "digestive fire," "roots," "balance."

### Module Unlock System
The platform follows a progressive educational approach where modules unlock automatically based on subscription duration:

**Module Unlock Schedule:**
- **Module 1**: Unlocks immediately upon subscription payment (education and habits only)
- **Module 2**: Unlocks automatically 30 days after subscription start (adds educational supplement suggestions)
- **Modules 3-12**: Currently inactive, pending review for future releases

**Technical Implementation:**
- `/api/modules/check/:userId` - GET endpoint that:
  - Calculates days since `subscriptionStartDate`
  - Determines which modules should be unlocked based on time elapsed
  - Automatically updates `unlockedModules` array in database if new modules are eligible
  - Returns `{ unlockedModules, newlyUnlocked, message }` with celebratory message when new modules unlock
  
- `/api/generate-report` - Enhanced with module access validation:
  - Verifies user has access to requested `moduleNumber` before generating report
  - Returns 403 Forbidden if module not yet unlocked
  - Prevents unauthorized access to future module content

**Database Fields (users table):**
- `unlockedModules`: Integer array (e.g., `[1]`, `[1, 2]`) tracking accessible modules
- `subscriptionStartDate`: Timestamp used to calculate unlock eligibility

**Frontend Integration:**
- Call `/api/modules/check/:userId` on login or dashboard load to sync unlocked modules
- Display celebratory message: "🎉 Tu cuerpo avanza en su proceso. Ya puedes acceder a tu nuevo módulo educativo."
- Show locked/unlocked states in module navigation based on returned `unlockedModules` array

**Security:**
- Module access is enforced server-side during report generation
- Frontend localStorage does NOT control access; only displays current state
- Backend validates every report request against `unlockedModules` in database
```