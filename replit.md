# TransformaDiabetes - Revertir DM2

## Overview
TransformaDiabetes is a health and wellness web application dedicated to reversing type 2 diabetes through functional nutrition education. It offers educational content, a diagnostic assessment, success stories, and guided pathways to address insulin resistance from a root-cause perspective. The platform features a **7-day free trial** with $5 USD/month subscription pricing thereafter. The platform aims to build trust, reduce health anxiety with an empathetic, wellness-focused design, and provide a clear path to health transformation.

## Recent Changes (October 21, 2025)
- **7-Day Free Trial Implementation**: All landing page copy updated to reflect trial offering
  - Hero title: "Tu cuerpo no está roto. Solo necesita apoyo."
  - Hero subtitle: Simplified to focus on practical value proposition
  - Subscription section: "Tu transformación funcional comienza aquí" with emphasis on practical guidance
  - All CTAs: "Comenzar prueba gratuita de 7 días"
  - Pricing: $5 USD/mes (all $15 references removed)
- **Email Collection**: Added LinkAuthenticationElement to Checkout.tsx to guarantee email capture
- **Stripe Trial Configuration**: Backend configured with `trial_period_days: 7`
- **New Trial Flow (October 21, 2025)** ✅ **COMPLETED & VERIFIED**:
  - **Welcome Screen**: Created `/onboarding/bienvenida-trial` intermediate page before intake form
  - **Unified Entry Points**: All header CTAs now route through welcome screen → intake form
  - **Trial Start on Intake**: Trial starts when intake form is completed (tm_trial_start in localStorage + trialStartDate in DB)
  - **Day Counter**: TrialCounter component with robust validation, capped daysRemaining (0-7), malformed date protection
  - **Chat Blocking**: Active days 1-6 (daysRemaining > 0), blocked on Day 7 (daysRemaining === 0) with upgrade prompt
  - **Day 5 Banner**: Soft reminder banner at daysRemaining === 2 in ChatSemanal and Informe pages
  - **Database Fields**: Added `trialStartDate` (timestamp) and `trialEnded` (boolean) to users table
  - **TypeScript Types**: Added `trialEnded` field to TrialStatus interface in `client/src/types/trial.ts`
  - **Module 1 Page**: Created `/modulo-1` with educational content and access control via unlockedModules
  - **Stripe Webhook**: Implemented `/api/stripe-webhook` with signature verification for secure event handling
    - Handles: checkout.session.completed, invoice.payment_succeeded, customer.subscription.updated, customer.subscription.deleted
    - Updates DB: subscriptionStatus, trialEnded, unlockedModules
    - Requires: STRIPE_WEBHOOK_SECRET environment variable (not yet configured)
    - **Security**: Raw body middleware correctly ordered before express.json() in server/index.ts
    - **Reliability**: Always responds with 200 status to prevent Stripe retries
  - **Post-Payment Flow (FIXED)**: 
    - `/api/create-subscription-with-payment` now returns email in response
    - `Checkout.tsx` saves userId, email to localStorage and sets tm_just_subscribed flag
    - Redirects to `/modulo-1` with welcome banner on first visit
    - Module 1 unlocked immediately upon subscription creation
  - **Modulo1.tsx (CRITICAL FIX)**: 
    - Removed hardcoded test userId (d48af8be-dabe-4b0e-94cb-48eadfb0fbe8)
    - Now reads userId from localStorage (tm_user_id)
    - Redirects to home if userId missing
    - Correct API endpoint: `/api/modules/check/:userId`
  - **Module 1 Welcome Screen (October 21, 2025)** ✅ **COMPLETED**:
    - Full-screen welcome message shown once after first payment
    - Displays before Module 1 content, does not modify existing module flow
    - Includes objectives, action guide, and motivational messaging
    - User clicks "Continuar al contenido del módulo" to proceed
    - Flag `tm_just_subscribed` removed after user continues
    - Never shows again on subsequent visits
  - **Module 1 Closing Screen (October 21, 2025)** ✅ **COMPLETED**:
    - Completion screen shown after user finishes 5-day tracking and views functional report
    - Triggered by clicking "Finalizar" button in InformeFuncional component
    - Sets `tm_module1_completed` flag in localStorage
    - Displays congratulations message, functional reflection, and next steps
    - Includes "Continuar al Módulo 2" button (currently shows placeholder message)
    - Flag removed after clicking continue button
    - Does not interfere with module content or data
    - **Automated Email**: Sends Module 1 completion email automatically when "Finalizar" is clicked
      - Subject: "🌿 Has completado tu primer módulo — Tu cuerpo ya está respondiendo"
      - Includes congratulations, functional reflection, and CTA to continue to Module 2
      - Non-blocking: email sent asynchronously, navigation proceeds even if email fails
  - **Module 2 Completion Email (October 21, 2025)** ✅ **IMPLEMENTED**:
    - Email function ready for when Module 2 is implemented
    - Subject: "🌿 Has completado el Módulo 2 — Tu cuerpo está encontrando su equilibrio"
    - Content includes: congratulations, three-level balance summary (digestive, glycemic, nervous), functional reflection, and CTA to Module 3
    - Endpoint: `/api/notify-module2-completed` ready to be integrated
    - Personalizes with user's name from intake form when available
    - Fire-and-forget pattern for non-blocking email delivery
  - **Automated Trial Reminder Emails (October 21, 2025)** ✅ **COMPLETED & PRODUCTION-READY**:
    - **Day 6 Email** ("Tu prueba termina mañana - No pierdas tu progreso"):
      - Sent automatically when user visits app on day 6 of trial (`daysRemaining === 1`)
      - Only sent to users without active subscription
      - Reminds about trial ending tomorrow and value of continuing
      - Includes CTA to checkout page ($5/month pricing)
      - Subject: "⏰ Tu prueba gratuita termina mañana — No pierdas tu progreso"
    - **Day 8+ Email** ("Extrañamos tu presencia - Continúa tu transformación"):
      - Sent automatically when user visits app on or after day 8 (`daysSinceStart >= 8`)
      - Only sent to users who didn't subscribe (not active, not trialing)
      - Encourages reactivation with empathetic functional medicine messaging
      - Includes CTA to checkout page for subscription
      - Subject: "💚 Extrañamos tu presencia — Continúa tu transformación funcional"
    - **Event-Driven Architecture**: Emails triggered by `/api/trial-status` endpoint visits (no cron jobs needed)
    - **Atomic Duplicate Prevention**: Database-level conditional updates prevent race conditions and duplicate sends
      - New storage method: `markEmailAsSentIfNotSent(id, emailField)` with `WHERE field = false` clause
      - Only one concurrent request can successfully mark flag as sent
      - Failed email sends revert flag for automatic retry on next visit
    - **Database Tracking**: Added `day6EmailSent` and `day8EmailSent` boolean fields to users table
    - **Personalization**: Fetches user's name from intake form for email greeting
    - **Reliability**: Synchronous email sending with proper error handling and logging
  - **Storage Enhancement**: Added `getUserByStripeCustomerId()` method for webhook lookups and `markEmailAsSentIfNotSent()` for atomic flag updates

## User Preferences
Preferred communication style: Simple, everyday language.

## Known Security Issues (To Address)
- **Unauthenticated Endpoints**: Trial status and user endpoints accept userId in URL without authentication
  - Endpoints `/api/trial-status/:userId` and `/api/users/id/:userId` are vulnerable to UUID guessing
  - **Impact**: Unauthorized users could access subscription and profile data
  - **Recommendation**: Implement session-based authentication or require auth tokens
  - **Status**: Deferred - requires authentication system implementation

## System Architecture

### UI/UX & Frontend
The application is built with React 18, TypeScript, Vite, Wouter for routing, and TanStack Query for state management. The UI utilizes Radix UI primitives and shadcn/ui (New York style) with Tailwind CSS, custom design tokens, a wellness-focused color palette (olive green, beige, terracotta), Playfair Display for headings, and Inter for body text. It features a responsive, mobile-first design. Key features include a simplified landing page with a multi-step diagnostic wizard, a comprehensive subscription onboarding flow (checkout, intake form, 5-day functional tracking, AI-generated personalized report), dynamic content, and legal pages.

### Backend & Database
The backend uses Express.js with TypeScript, Drizzle ORM for PostgreSQL (Neon Database), and Zod for schema validation, structured as a monorepo. The PostgreSQL database includes tables for `users` (with subscription status and module access), `intake_forms` (medical questionnaires), `daily_logs` and `daily_log_moments` (5-day functional tracking), `reports` (AI-generated functional medicine reports), and `weekly_checkins` (AI chat interactions). Data flow involves user creation upon Stripe checkout, intake form submission, and daily log entries, all linked by `userId`.

### Routing
Wouter manages client-side routing with smooth scrolling. The landing page is a single-page scroll, while the subscription onboarding is a multi-page sequential flow.

### Feature Specifications
- **Diagnostic System**: 3-question diagnostic leading to 10 functional patterns and "Mini Guías Funcionales".
- **Subscription Onboarding Flow**: Multi-page process including Stripe checkout, intake form, 5-day functional tracking, and an AI-generated initial report.
- **Informe Funcional**: Dedicated page for AI-generated personalized reports with 5 key functional recommendations.
- **Module Unlock System**: Progressive educational content where modules unlock automatically based on subscription duration (e.g., Module 1 immediately, Module 2 after 30 days). Access is controlled server-side.
- **Weekly Check-in Chat System ("Marvin Lira IA")**: GPT-4o powered interactive chat for users to share weekly progress and receive personalized functional medicine guidance, including system detection and emotion tagging.
- **Stripe Customer Portal Integration**: Self-service subscription management allowing users to update payment methods, view billing history, cancel, and reactivate subscriptions securely through Stripe's hosted portal. Accessed via "Gestionar mi suscripción" button on the Perfil page. Return URL includes query parameters (`from=portal`, `prevStatus`) to detect portal return and subscription status changes.
- **Cancellation Confirmation Page**: Empathetic post-cancellation message displayed when users cancel their subscription through the Stripe portal. Includes emotional support messaging, contact information (contacto@transformadiabetes.com), and option to return to homepage. Route: `/cancelacion-confirmada`.
- **Reactivation Confirmation Page**: Welcoming message displayed when users reactivate their subscription through the Stripe portal. Confirms access restoration, explains process continuity (history, reports, modules), and provides reassurance about the healing journey. Route: `/reactivacion-confirmada`.

## External Dependencies

- **UI & Development**: Radix UI, Lucide React, class-variance-authority, cmdk, embla-carousel-react, TypeScript, PostCSS, Autoprefixer, Vite, esbuild, tsx, clsx, tailwind-merge, nanoid.
- **Data & Forms**: Drizzle ORM, @neondatabase/serverless, drizzle-zod, react-hook-form, @hookform/resolvers, zod, date-fns.
- **Payment Integration**: **Stripe** for $5/month subscriptions with **7-day free trial**, utilizing Stripe.js with React Stripe Elements for client-side and Stripe Node SDK for server-side subscription management. Trial period configured via `trial_period_days: 7` parameter in subscription creation.
- **Email System**: **Nodemailer** configured with Namecheap PrivateEmail for automated transactional emails (Welcome, Report Ready, Module Unlocked, Module 1 Completed, Module 2 Completed, Reactivation) using SMTP (mail.privateemail.com:465).
- **AI Integration**: **OpenAI GPT-4o** (via Replit AI Integrations) for generating personalized functional medicine reports and powering the "Marvin Lira IA" weekly check-in chat system. The AI uses a condensed clinical knowledge base for functional medicine guidance and is structured to provide module-specific recommendations.
- **Support Chat**: **Chatbase** floating chat widget integrated globally (ID: `yxaUbszINwsobf8Upa-xh`) configured exclusively for technical support assistance, not health advice.