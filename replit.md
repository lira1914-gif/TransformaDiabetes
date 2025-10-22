# TransformaDiabetes - Revertir DM2

## Overview
TransformaDiabetes is a web application focused on reversing type 2 diabetes through functional nutrition education. It provides educational content, diagnostic assessments, success stories, and guided pathways to address insulin resistance. The platform offers a 7-day free trial, followed by a $5 USD/month subscription. Its primary goal is to build trust, reduce health anxiety with an empathetic design, and guide users towards health transformation.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (October 22, 2025)

### Major Simplification: Removed 5-Day Registration Requirement (October 22, 2025)
- **Simplified trial flow**: Users now receive their personalized functional report IMMEDIATELY after completing the intake form, removing the previous 5-day registration barrier
- **New user journey**: Intake Form → AI Report Generated → Chat Opens (with 3 free conversations during 7-day trial)
- **Backend updates**: `/api/generate-report` endpoint now generates reports using only intake form data, no longer requires daily logs
- **Frontend changes**: 
  - Removed Registro.tsx, Registro5DiasDetallado.tsx, and Registro5Dias.tsx components
  - Removed `/onboarding/registro` route
  - IntakeForm now automatically generates report and sets `tm_informe_ready='true'` upon completion
  - InformeFuncional updated with prominent CTA directing users to chat for daily symptom tracking
- **Chat system enhanced**: "Marvin Lira IA" now positioned as the primary tool for users to share daily symptoms (sleep, digestion, energy, mood) during their 7-day trial
- **Trial access simplified**: Based purely on time (7 days from intake completion), not task completion

### Header Navigation Cleanup (October 22, 2025)
- **"Mi Informe" and "Chat Semanal" visibility**: Now appear immediately after completing intake form (when `tm_informe_ready='true'`)
- **Correct flow**: Header shows only "Inicio" and "Diagnóstico" initially, then adds "Mi Informe" and "Chat Semanal" after intake completion

### Authorization & Route Protection (October 21, 2025)
- **Route Guards**: InformeFuncional.tsx and ChatSemanal.tsx redirect users without proper credentials to `/onboarding/bienvenida-trial`
- **Trial Initialization**: BienvenidaTrial.tsx generates `tm_user_id` (format: `trial_<timestamp>_<random>`) when user starts diagnostic

## System Architecture

### UI/UX & Frontend
The application is built with React 18, TypeScript, Vite, Wouter for routing, and TanStack Query. The UI uses Radix UI primitives and shadcn/ui (New York style) with Tailwind CSS, custom design tokens, a wellness-focused color palette, Playfair Display for headings, and Inter for body text. It features a responsive, mobile-first design, a simplified landing page with a multi-step diagnostic wizard, a comprehensive subscription onboarding flow, dynamic content, and legal pages.

### Backend & Database
The backend uses Express.js with TypeScript, Drizzle ORM for PostgreSQL (Neon Database), and Zod for schema validation, structured as a monorepo. The PostgreSQL database includes tables for `users` (with subscription status and module access), `intake_forms`, `reports`, and `weekly_checkins`. User creation and intake form submissions are linked by `userId`. **Note**: `daily_logs` and `daily_log_moments` tables are deprecated and no longer used (chat system replaced the structured 5-day logging).

### Routing
Wouter manages client-side routing with smooth scrolling. The landing page is a single-page scroll, while the subscription onboarding is a multi-page sequential flow.

### Feature Specifications
- **Diagnostic System**: A 3-question diagnostic leading to 10 functional patterns and "Mini Guías Funcionales".
- **Simplified Onboarding Flow**: Intake form (62 fields, flexible - not all required) → Immediate AI report generation → Chat access for daily symptom journaling during 7-day trial.
- **Subscription CTAs**: Prominent call-to-action banners in InformeFuncional encouraging trial users to subscribe, highlighting benefits ($5 USD/month, unlimited chat, progressive modules, personalized tracking).
- **Chat Conversation Limit**: Trial users limited to 3 free chat conversations with Marvin Lira IA. After 3 conversations, users must subscribe to continue chatting. Backend enforces limit via conversation count check, frontend shows counter and disabled button with upgrade modal.
- **7-Day Free Trial with Progressive Messaging**:
  - **Day 5**: Soft reminder banner ("Tu prueba gratuita está por terminar")
  - **Day 6**: Modal celebration ("Has completado tu prueba funcional gratuita") + Email reminder
  - **Day 7**: Final day banner ("Tu prueba termina hoy") + Blocking modal + Chat access ends
  - **Day 8**: Post-trial banner ("Tu acceso gratuito ha finalizado") + Follow-up email ("Extrañamos tu presencia")
  - **Day 9**: Follow-up email 24h after Day 8 ("Tu cuerpo ya comenzó a mejorar")
  - **Day 10**: Final reminder email 48h after Day 8 ("Último día para conservar tu progreso funcional")
  - **Day 11+**: Archived account page ("Tu cuenta ha sido archivada") replaces app interface for expired trial users
- **Informe Funcional**: A dedicated page for AI-generated personalized reports with 5 key functional recommendations.
- **Module Unlock System**: Progressive educational content where modules unlock automatically based on subscription duration, with server-side access control.
- **Weekly Check-in Chat System ("Marvin Lira IA")**: A GPT-4o powered interactive chat for personalized functional medicine guidance. Trial users get 3 free conversations; subscription required for unlimited access.
- **Stripe Customer Portal Integration**: Allows users to self-manage subscriptions (payment methods, billing history, cancellation, reactivation) via Stripe's hosted portal.
- **Dynamic User Management**: User IDs stored in localStorage (`tm_user_id`) and used dynamically across all components. Trial users receive temporary IDs (`trial_<timestamp>_<random>`), which are replaced with permanent Stripe customer IDs upon subscription.
- **Cancellation/Reactivation Confirmation Pages**: Empathetic messages displayed upon subscription cancellation (`/cancelacion-confirmada`) or reactivation (`/reactivacion-confirmada`).

## External Dependencies

- **UI & Development**: Radix UI, Lucide React, class-variance-authority, cmdk, embla-carousel-react, TypeScript, PostCSS, Autoprefixer, Vite, esbuild, tsx, clsx, tailwind-merge, nanoid.
- **Data & Forms**: Drizzle ORM, @neondatabase/serverless, drizzle-zod, react-hook-form, @hookform/resolvers, zod, date-fns.
- **Payment Integration**: **Stripe** for $5/month subscriptions with a 7-day free trial, using Stripe.js and Stripe Node SDK.
- **Email System**: **Nodemailer** configured with Namecheap PrivateEmail (SMTP) for automated transactional emails (e.g., Welcome, Report Ready, Module Completed, Trial Reminders).
- **AI Integration**: **OpenAI GPT-4o** for generating personalized functional medicine reports and powering the "Marvin Lira IA" weekly check-in chat system.
- **Support Chat**: **Chatbase** floating chat widget (`yxaUbszINwsobf8Upa-xh`) for technical support only.