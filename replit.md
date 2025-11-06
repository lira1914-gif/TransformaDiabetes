# TransformaDiabetes

## Overview
TransformaDiabetes is a web application designed to facilitate the reversal of type 2 diabetes through functional nutrition education. It offers educational content, diagnostic tools, success stories, and guided pathways to address insulin resistance. The platform operates on a freemium model, offering a 7-day free trial followed by a $5 USD/month subscription. Its core mission is to build user trust, alleviate health-related anxiety through empathetic design, and guide individuals towards significant health improvements.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX & Frontend
The application utilizes React 18, TypeScript, Vite, Wouter for routing, and TanStack Query. The UI is built with Radix UI primitives and shadcn/ui (New York style), leveraging Tailwind CSS for styling. It features a wellness-focused color palette, Playfair Display for headings, and Inter for body text, all within a responsive, mobile-first design. Key components include a simplified landing page with a multi-step diagnostic wizard, a comprehensive subscription onboarding flow, dynamic content, and legal pages.

### Backend & Database
The backend is an Express.js application written in TypeScript, structured as a monorepo. It uses Drizzle ORM with a PostgreSQL database (Neon Database) and Zod for schema validation. The database schema includes tables for `users` (managing subscription status and module access), `intake_forms`, `reports`, and `weekly_checkins`. User creation and intake form submissions are linked by a `userId`.

### Routing
Client-side routing is managed by Wouter, featuring smooth scrolling. The landing page is a single-page scroll experience, while the subscription onboarding process guides users through a multi-page sequential flow.

### Feature Specifications
- **Diagnostic System**: A 3-question diagnostic identifies 10 functional patterns and provides "Mini Guías Funcionales."
- **Enhanced Onboarding Flow**: A 5-step intake questionnaire collects personal information (supporting imperial units with backend conversion), health status, diagnoses/medications, functional questions, and detailed symptoms. This leads directly to AI report generation and immediate chat access during the 7-day trial.
- **Subscription CTAs**: Prominent calls-to-action in the `InformeFuncional` encourage trial users to subscribe, detailing benefits like unlimited chat, progressive modules, and personalized tracking for $5/month.
- **Chat Access During Trial**: Trial users receive unlimited chat access with "Marvin Lira IA" for 7 days from intake completion; continued access requires subscription.
- **7-Day Free Trial Management**: The system includes progressive messaging (banners, modals, emails) on days 5, 6, 7, 8, 9, and 10 to guide users through the trial, encourage subscription, and manage access post-trial.
- **Informe Funcional**: A dedicated page displays AI-generated personalized reports with 5 key functional recommendations.
- **Module Unlock System**: Educational content modules are progressively unlocked based on subscription duration, controlled by server-side access.
- **Weekly Check-in Chat System ("Marvin Lira IA")**: An interactive chat powered by GPT-4o offers personalized functional medicine guidance.
- **Stripe Customer Portal Integration**: Enables users to self-manage their subscriptions (payment methods, billing history, cancellations, reactivations).
- **Dynamic User Management**: User IDs (`tm_user_id`) are stored in localStorage; temporary IDs for trial users are replaced with permanent Stripe customer IDs upon subscription.
- **Cancellation/Reactivation Pages**: Custom confirmation pages are provided for subscription cancellation and reactivation.

## External Dependencies
- **Payment Integration**: Stripe for $5/month subscriptions with a 7-day free trial.
- **Email System**: Resend for transactional emails (e.g., Welcome, Report Ready, Trial Reminders).
- **AI Integration**: OpenAI GPT-4o for AI-generated reports and the "Marvin Lira IA" chat system.
- **Analytics**: Google Analytics 4 (GA4) for tracking user behavior.
- **Support Chat**: Chatbase floating chat widget for technical support.