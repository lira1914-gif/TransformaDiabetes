# TransformaDiabetes - Revertir DM2

## Overview
TransformaDiabetes is a health and wellness web application dedicated to reversing type 2 diabetes through functional nutrition education. It offers educational content, a diagnostic assessment, success stories, and guided pathways to address insulin resistance from a root-cause perspective. The platform features a **7-day free trial** with $5 USD/month subscription pricing thereafter. The platform aims to build trust, reduce health anxiety with an empathetic, wellness-focused design, and provide a clear path to health transformation.

## User Preferences
Preferred communication style: Simple, everyday language.

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
- **Email System**: **Nodemailer** configured with Namecheap PrivateEmail for automated transactional emails (Welcome, Report Ready, Module Unlocked, Reactivation) using SMTP (mail.privateemail.com:465).
- **AI Integration**: **OpenAI GPT-4o** (via Replit AI Integrations) for generating personalized functional medicine reports and powering the "Marvin Lira IA" weekly check-in chat system. The AI uses a condensed clinical knowledge base for functional medicine guidance and is structured to provide module-specific recommendations.
- **Support Chat**: **Chatbase** floating chat widget integrated globally (ID: `yxaUbszINwsobf8Upa-xh`) configured exclusively for technical support assistance, not health advice.