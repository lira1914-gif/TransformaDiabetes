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
- **7-Day Free Trial Management**: The system includes progressive messaging (banners, modals, emails) on days 2, 3, 4, 5, 6, 7, 8, 9, and 10 to guide users through the trial, encourage subscription, and manage access post-trial.
- **User Retention Email Strategy**: Automated engagement emails sent during critical trial days:
  - **Day 2**: Activation reminder with suggested chat questions
  - **Day 3**: Success story/testimonial to maintain motivation
  - **Day 4**: Progress reflection and value reminder
  - **Day 5**: Pre-urgency message (2 days remaining)
  - **Day 6**: Final urgency (1 day remaining)
  - **Days 8-10**: Post-trial follow-up sequence
  - **Weekly Post-Trial Email**: Recurring motivational email for users who didn't subscribe after trial ended (status: `trial_ended`)
- **User Progress Dashboard**: Interactive dashboard on Perfil page showing:
  - Current trial day (calculated in America/Mexico_City timezone)
  - Chat activity streak (consecutive days with at least one chat message)
  - Percentage of trial completed (visual progress bar)
  - Context-aware suggested actions based on user status
- **Onboarding Checklist System**: Visual 4-step guided onboarding displayed on Perfil page:
  - Step 1: Complete initial questionnaire (auto-tracked via intakeForm existence)
  - Step 2: Receive functional report (auto-tracked via report existence)
  - Step 3: **Make first consultation with Marvin** (tracked via `firstChatCompletedAt` timestamp)
  - Step 4: Review complete report (tracked via `reportViewedAt` timestamp)
  - Progress bar showing completion percentage
  - Primary CTA highlighting most critical next step
  - Auto-hides when 100% complete to reduce UI clutter
  - Backend tracking via PUT /api/users/:userId endpoint
- **Chat Reminder Banner**: In-app reminder system to re-engage inactive users:
  - Banner appears when user hasn't used chat in 24+ hours during active trial
  - Displays "Hace X horas que no hablas con Marvin. ¿Cómo te sientes hoy?"
  - CTA button navigates directly to chat ("Ir al chat")
  - Dismissable with daily reset (localStorage tracking)
  - Only visible on key pages (perfil, módulos), hidden on landing/onboarding/chat
  - Automatically disappears after user sends new chat message (cache invalidation)
  - Backend endpoint: GET /api/chat-reminder-status/:userId
- **Suggested Questions (Chat Starter Prompts)**: Interactive question chips to guide new users:
  - Displays 4 clickable question suggestions for users with <3 messages
  - Questions cover key functional medicine topics (glucose, sleep, diet, symptoms)
  - Auto-fills chat input on click or keyboard (Enter/Space)
  - Fully accessible (role="button", keyboard navigation)
  - Auto-hides after 3 messages to reduce clutter
  - No backend changes needed (uses existing checkins data)
- **Informe Funcional**: A dedicated page displays AI-generated personalized reports with 5 key functional recommendations.
- **Module Unlock System**: Educational content modules are progressively unlocked based on subscription duration, controlled by server-side access.
- **Weekly Check-in Chat System ("Marvin Lira IA")**: An interactive chat powered by GPT-4o offers personalized functional medicine guidance.
- **Stripe Customer Portal Integration**: Enables users to self-manage their subscriptions (payment methods, billing history, cancellations, reactivations).
- **Dynamic User Management**: User IDs (`tm_user_id`) are stored in localStorage; temporary IDs for trial users are replaced with permanent Stripe customer IDs upon subscription.
- **Cancellation/Reactivation Pages**: Custom confirmation pages are provided for subscription cancellation and reactivation.
- **Consulta Gratuita Header Link**: Persistent header link to free consultation booking (visible after informe completion):
  - Desktop: Positioned between TrialCounter and navigation menu
  - Mobile: Accessible via hamburger menu
  - Uses Calendar icon (Lucide) instead of emoji
  - Language selector (ES/EN) uses text labels instead of flag emojis
- **Email Footer Consistency**: Reusable consultation footer added to:
  - Welcome email (Day 0)
  - Report Ready email (post-intake)
  - Trial reminder emails (Days 6-10)
  - Footer includes WhatsApp link and professional tone without emojis
- **Visual Countdown Urgency**: Dynamic countdown component in ProgressDashboard (Perfil page):
  - Displays when ≤3 days remaining in trial
  - Color-coded urgency: Green (3 days) → Yellow (2 days) → Red (≤1 day)
  - Uses Lucide icons (AlertCircle, Clock) for visual cues
  - Only visible for trialing users
- **Zero-Emoji Policy (ENFORCED)**: Complete elimination of emojis across entire codebase:
  - 267+ emojis removed from 28+ files (server/email.ts, server/routes.ts, all client components)
  - 58 database reports cleaned (emojis replaced with • bullets)
  - OpenAI prompts updated to prevent emoji generation in new reports
  - Unicode ranges cleaned: U+1F300-U+1F9FF, U+2600-U+27BF, U+1FA00-U+1FAFF, U+E0000-U+E007F
  - Replaced with Lucide icons for UI elements (Calendar, Menu, AlertCircle, Clock)
  - Professional text-only approach in emails and user-facing content
  - Validated via automated grep scanning (0 emojis confirmed)

## API Endpoints & Automation
- **Weekly Post-Trial Email Endpoint**: `POST /api/send-weekly-post-trial-emails`
  - Sends motivational conversion emails to all users with `subscriptionStatus = 'trial_ended'`
  - Highlights key benefits: unlimited chat, blood analysis interpretation, personalized recipes, functional education, progress tracking
  - Returns stats: `totalUsers`, `emailsSent`, `errors`, and detailed `results` array
  - **Automation Setup**: Call this endpoint weekly using external cron services (cron-job.org, EasyCron, or GitHub Actions)
  - **Example cURL**: `curl -X POST https://your-replit-domain.replit.app/api/send-weekly-post-trial-emails`

## External Dependencies
- **Payment Integration**: Stripe for $5/month subscriptions with a 7-day free trial.
- **Email System**: Resend API for transactional emails with the following configuration:
  - **Sender Address**: `no-reply@transformadiabetes.online` (verified domain in Resend)
  - **Admin Notifications**: Sent to `lira1914@gmail.com` 
  - **User Emails**: Welcome emails, report ready notifications, trial reminders (all sent from no-reply@)
  - **DNS Configuration**: Domain `transformadiabetes.online` verified with SPF, DKIM, and DMARC records
  - **Receiving Emails**: `contacto@transformadiabetes.online` managed via Private Email (Namecheap) for incoming messages only
  - **Important**: Do NOT send emails FROM `contacto@transformadiabetes.online` to avoid "Relay access denied" errors, as Private Email rejects emails coming from external SMTP servers (Resend/AWS SES)
- **AI Integration**: OpenAI GPT-4o for AI-generated reports and the "Marvin Lira IA" chat system.
- **Analytics**: Google Analytics 4 (GA4) for tracking user behavior.
- **Support Chat**: Chatbase floating chat widget for technical support.