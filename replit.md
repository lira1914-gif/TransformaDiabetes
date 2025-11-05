# TransformaDiabetes - Revertir DM2

## Overview
TransformaDiabetes is a web application focused on reversing type 2 diabetes through functional nutrition education. It provides educational content, diagnostic assessments, success stories, and guided pathways to address insulin resistance. The platform offers a 7-day free trial, followed by a $5 USD/month subscription. Its primary goal is to build trust, reduce health anxiety with an empathetic design, and guide users towards health transformation.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (November 5, 2025)

### Critical Conversion Funnel Fixes (November 5, 2025)
- **Email System Implementation**: Added automated transactional emails at key touchpoints to improve user engagement and admin visibility
  - **Welcome email**: Sent immediately upon intake form completion (`server/routes.ts` `/api/intake-form` endpoint)
  - **Report ready email**: Sent when AI-generated functional report is created (`server/routes.ts` `/api/generate-report` endpoint)
  - **Admin notification**: Welcome email BCC'd to admin for registration tracking
  - **Email configuration**: Using Resend API with verified domain transformadiabetes.com, sender: contacto@transformadiabetes.com
- **Trial Blocking Logic Fixed**: Corrected trial duration enforcement from 11 days to 8 days (after 7 complete days)
  - **Backend**: Updated all `daysSinceStart >= 11` checks to `>= 8` across:
    - `client/src/pages/onboarding/Informe.tsx` (2 instances)
    - `client/src/pages/ChatSemanal.tsx` (1 instance)
    - `client/src/pages/Perfil.tsx` (1 instance)
  - **Impact**: ArchivedAccountPage now displays on day 8 (not day 11), properly enforcing the 7-day trial promise
  - **User journey**: Day 0-7 = full access → Day 8+ = blocked with archived account page
- **Context**: These fixes address zero subscription conversions in first 3 weeks by ensuring proper user communication and trial enforcement

## Previous Changes (October 29, 2025)

### Trial Activation Fix & Header Simplification (October 29, 2025 - Final)
- **Trial initialization fixed**: Trial now starts correctly when users complete the intake questionnaire, regardless of whether it's a new or updated form
  - `trialStartDate` set to current timestamp upon intake completion
  - `subscriptionStatus` set to 'trialing' (standardized from 'trial' for consistency)
  - `unlockedModules` set to [1] automatically
  - Fixed issue where trial status API returned `isTrialing: false` for new users
- **Header navigation simplified**: Removed "Diagnóstico" from menu
  - **Before questionnaire**: Minimal header (logo only, centered)
  - **After questionnaire**: Full navigation with "Inicio", "Mi Informe", "Chat Semanal"
  - CTA button text: "Comenzar evaluación" (links to `/cuestionario`)
- **Trial status API consistency**: `/api/trial-status/:userId` now correctly returns:
  - `isTrialing: true` for active trial users (within 7-day period)
  - `hasAccess: true` for trial and subscribed users
  - `daysRemaining: 7` on day 0 (first day)
  - `subscriptionStatus: "trialing"` for trial users
- **End-to-end tested**: Complete user flow verified from landing → questionnaire → report → chat access

### Optimized Conversion Flow with Emotional CTA (October 29, 2025)
- **Enhanced questionnaire**: Expanded CuestionarioBreve.tsx from 3 steps to 5 comprehensive steps:
  - **Step 1**: Personal information (name, email, age, weight in lbs, height in ft/in)
  - **Step 2**: General health status (sleep quality, digestion, anxiety levels)
  - **Step 3**: Medical diagnoses and medications (checkboxes and multiple choice)
  - **Step 4**: Functional diagnostic questions (main concern, current state, health goal)
  - **Step 5**: Additional medical information (Type 2 diabetes confirmation, energy level slider, detailed symptoms)
- **Imperial units**: UI displays pounds and feet/inches with automatic backend conversion to kg/cm
- **Value-first flow**: After completing questionnaire, users redirect to `/onboarding/informe-inicial` to see their personalized functional guide BEFORE being asked to subscribe
- **Emotional CTA**: InformeFuncional displays powerful emotional call-to-action "¿Quieres seguir este camino conmigo?" after user reads their personalized recommendations
- **7-day trial offer**: Below subscription CTA, users can try chat for free during 7-day trial period ("Mientras decides, prueba el chat gratis")
- **Rate limiter fix**: Moved rate limiting from global scope to `/api/*` routes only to prevent blocking Vite development resources
- **Trust proxy configured**: Added Express trust proxy setting for proper rate limiter validation

### Previous: Simplified Onboarding Flow (October 29, 2025)
- **Unified questionnaire**: Initially created `CuestionarioBreve.tsx` combining 3 diagnostic questions + 11 essential intake fields (reduced from 62) into a single, streamlined 3-step form
- **Navigation updated**: HeroSection CTA directs to `/cuestionario` instead of `/diagnostico`
- **Maintained functionality**: All backend integrations (report generation, trial tracking, email system) work seamlessly with simplified form

## Previous Changes (October 22, 2025)

### Major Simplification: Removed 5-Day Registration Requirement (October 22, 2025)
- **Simplified trial flow**: Users now receive their personalized functional report IMMEDIATELY after completing the intake form, removing the previous 5-day registration barrier
- **New user journey**: Intake Form → AI Report Generated → Chat Opens (with unlimited chat access during 7-day trial)
- **Backend updates**: `/api/generate-report` endpoint now generates reports using only intake form data, no longer requires daily logs
- **Frontend changes**: 
  - Removed Registro.tsx, Registro5DiasDetallado.tsx, Registro5Dias.tsx, and Mensaje.tsx components
  - Removed `/onboarding/registro` and `/onboarding/mensaje` routes
  - IntakeForm automatically generates report and sets `tm_informe_ready='true'` upon completion
  - InformeFuncional updated with prominent CTA directing users to chat for daily symptom tracking
- **Chat system enhanced**: "Marvin Lira IA" now positioned as the primary tool for users to share daily symptoms (sleep, digestion, energy, mood) during their 7-day trial
- **Trial access simplified**: Based purely on time (7 days from intake completion), not task completion
- **Bug fix**: Eliminated intermediate "mensaje" page that referenced obsolete 5-day registration flow and caused 404 errors
- **Chat conversation limit removed**: Eliminated the 3-conversation limit for trial users. Chat is now completely unlimited during the 7-day trial period. Updated backend to remove conversation count checks and frontend to remove limit messaging and modals.

### Header Navigation Cleanup (October 22, 2025)
- **"Mi Informe" and "Chat Semanal" visibility**: Now appear immediately after completing intake form (when `tm_informe_ready='true'`)
- **Correct flow**: Header shows minimal version (logo only) before questionnaire completion, then full navigation after completion
- **Note**: As of October 29, 2025, "Diagnóstico" was removed from navigation - menu now shows only "Inicio", "Mi Informe", "Chat Semanal"

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
- **Enhanced Onboarding Flow**: 5-step comprehensive intake questionnaire (personal info with imperial units, health status, diagnoses/medications, functional questions, detailed symptoms) → AI report generation in background → Direct redirect to chat for immediate engagement during 7-day trial.
- **Subscription CTAs**: Prominent call-to-action banners in InformeFuncional encouraging trial users to subscribe, highlighting benefits ($5 USD/month, unlimited chat, progressive modules, personalized tracking).
- **Chat Access During Trial**: Trial users have UNLIMITED access to chat with Marvin Lira IA during their 7-day trial period. There is no conversation limit - the only restriction is time-based (7 days from intake completion). At day 7, users must subscribe to continue using the chat.
- **7-Day Free Trial with Progressive Messaging**:
  - **Day 5**: Soft reminder banner ("Tu prueba gratuita está por terminar")
  - **Day 6**: Modal celebration ("Has completado tu prueba funcional gratuita") + Email reminder
  - **Day 7**: Final day banner ("Tu prueba termina hoy") + Blocking modal + Chat access ends
  - **Day 8+**: Archived account page ("Tu cuenta ha sido archivada") replaces app interface for expired trial users. Post-trial banner ("Tu acceso gratuito ha finalizado") + Follow-up email ("Extrañamos tu presencia")
  - **Day 9**: Follow-up email 24h after Day 8 ("Tu cuerpo ya comenzó a mejorar")
  - **Day 10**: Final reminder email 48h after Day 8 ("Último día para conservar tu progreso funcional")
- **Informe Funcional**: A dedicated page for AI-generated personalized reports with 5 key functional recommendations.
- **Module Unlock System**: Progressive educational content where modules unlock automatically based on subscription duration, with server-side access control.
- **Weekly Check-in Chat System ("Marvin Lira IA")**: A GPT-4o powered interactive chat for personalized functional medicine guidance. Trial users have unlimited chat access during 7-day trial; subscription required for continued access.
- **Stripe Customer Portal Integration**: Allows users to self-manage subscriptions (payment methods, billing history, cancellation, reactivation) via Stripe's hosted portal.
- **Dynamic User Management**: User IDs stored in localStorage (`tm_user_id`) and used dynamically across all components. Trial users receive temporary IDs (`trial_<timestamp>_<random>`), which are replaced with permanent Stripe customer IDs upon subscription.
- **Cancellation/Reactivation Confirmation Pages**: Empathetic messages displayed upon subscription cancellation (`/cancelacion-confirmada`) or reactivation (`/reactivacion-confirmada`).

## External Dependencies

- **UI & Development**: Radix UI, Lucide React, class-variance-authority, cmdk, embla-carousel-react, TypeScript, PostCSS, Autoprefixer, Vite, esbuild, tsx, clsx, tailwind-merge, nanoid.
- **Data & Forms**: Drizzle ORM, @neondatabase/serverless, drizzle-zod, react-hook-form, @hookform/resolvers, zod, date-fns.
- **Payment Integration**: **Stripe** for $5/month subscriptions with a 7-day free trial, using Stripe.js and Stripe Node SDK.
- **Email System**: **Resend** for high-deliverability transactional emails (e.g., Welcome, Report Ready, Module Completed, Trial Reminders). Sender: contacto@transformadiabetes.com. Previously used Nodemailer with Namecheap SMTP (deprecated due to deliverability issues).
- **AI Integration**: **OpenAI GPT-4o** for generating personalized functional medicine reports and powering the "Marvin Lira IA" weekly check-in chat system.
- **Analytics**: **Google Analytics 4** (Measurement ID: `G-YZ6DC4HWJE`) for tracking user behavior, page views, and conversion metrics across transformadiabetes.com and transformadiabetes.online.
- **Support Chat**: **Chatbase** floating chat widget (`yxaUbszINwsobf8Upa-xh`) for technical support only.
