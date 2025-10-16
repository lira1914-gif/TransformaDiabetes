# NutriMarvin - Revertir DM2

## Overview

NutriMarvin is a health and wellness web application focused on diabetes type 2 reversal through functional nutrition education. The platform provides educational content, a diagnostic assessment tool, success stories, and guided pathways to help users understand and address insulin resistance from a root-cause perspective. The application adopts a warm, empathetic design approach inspired by leading wellness platforms (Headspace, Noom, Calm) to build trust while reducing health anxiety.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast iteration
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for state management and data fetching

**UI Component System**
- Radix UI primitives for accessible, unstyled component foundations
- shadcn/ui component library (New York style) for pre-built, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom design system following wellness-focused aesthetics with specific color palette (olive green, beige, terracotta)

**Typography & Design**
- Playfair Display (serif) for headings to convey warmth and authority
- Inter (sans-serif) for body text ensuring readability
- Custom HSL-based color system with semantic naming
- Responsive design with mobile-first approach

**Key Features**
- Multi-step diagnostic wizard with progress tracking (3 steps, 15 questions)
- 4-axis health assessment system (Metabólico, Digestivo, Estrés, Inflamatorio)
- 10-pattern detection system (4 individual + 6 combined patterns)
- Threshold-based combined pattern detection (2-point threshold)
- Educational content sections (reversión explanation, three pillars, testimonials)
- Static page architecture (Home, Diagnostico, Resultados, Guia)
- Reusable section components (Hero, QueEs, Pilares, Historias, CTA)

**Diagnostic System (Simplified - October 2025)**
- 3 simple questions for quick, accessible diagnostics
- Questions mapped to 4 health axes (Metabólico, Digestivo, Estrés, Inflamatorio)
- Pattern detection logic:
  - Counts axis mentions across all 3 answers
  - Most mentioned axis becomes dominant pattern
  - Ties result in combined patterns
- 10 reachable patterns:
  - Individual: Metabólico, Digestivo, Estrés, Inflamatorio
  - Combined: Metabólico–Digestivo, Metabólico–Estrés, Metabólico–Inflamatorio, Digestivo–Estrés, Digestivo–Inflamatorio, Estrés–Inflamatorio
- Personalized greeting using pre-registration name
- Storage: localStorage key `NM_diagnostico_simple`

**Results Content Format**
- Simplified 5-point recommendations (numbered with emoji 1️⃣ to 5️⃣)
- Motivational phrase displayed with 💬 emoji and quotation marks
- Pattern title with corresponding emoji (🩸 🌙 💩 🔥)
- Clear description of the detected pattern
- Download CTA for functional guide

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Custom middleware for request logging and error handling
- Vite integration for development mode with HMR
- Production-ready build process using esbuild

**Data Layer Preparation**
- Drizzle ORM configured for PostgreSQL (using @neondatabase/serverless)
- Schema definition using drizzle-orm with Zod validation
- Migration system configured via drizzle-kit
- In-memory storage fallback (MemStorage) for development without database

**Application Structure**
- Monorepo structure with shared schema between client and server
- Type-safe contracts using shared TypeScript types
- Path aliases configured for clean imports (@/, @shared/, @assets/)

### Design System Implementation

**Color Palette**
- Primary: Verde Oliva (HSL: 75 25% 35%) for headers and CTAs
- Background: Beige (HSL: 40 30% 85%) for warmth
- Accent: Terracota (HSL: 15 55% 55%) for highlights
- Semantic color tokens via CSS custom properties
- Dark mode support structure in place

**Spacing & Layout**
- Consistent spacing units (4, 6, 8, 12, 16, 20, 24)
- Max-width containers (6xl for sections, 4xl for content, 3xl for focused tools)
- Full-width sections with centered content strategy

**Interactive Patterns**
- Hover elevation effects using custom CSS classes
- Smooth transitions and animations
- Focus states for accessibility
- Progressive disclosure in wizard interface

### Routing Strategy

**Client-Side Routing**
- Wouter for minimal-bundle SPA routing
- Route definitions in App.tsx
- Smooth scrolling to sections within single-page architecture
- 404 handling with custom NotFound page

**Page Structure**
- `/` - Home (educational landing page with all sections)
- `/pre-registro` - Pre-registration form (name, email, age, sex, diagnosis) before diagnostic
- `/diagnostico` - Diagnostic assessment wizard
- `/resultados` - Results display after assessment with subscription CTA and privacy notice
- `/bienvenida` - Welcome page after subscription with health profile access
- `/perfil` - Health profile form (age, gender, symptoms, medical history)
- `/analisis` - Blood analysis interpretation tool
- `/guia` - Guide download page
- `/privacidad` - Privacy policy page (accessible from footer)
- Sticky header navigation with smooth scroll to sections

## External Dependencies

### Third-Party UI Libraries
- **Radix UI** - Comprehensive set of accessible, unstyled primitives (accordion, dialog, dropdown, form controls, navigation, etc.)
- **Lucide React** - Icon library for consistent iconography
- **class-variance-authority** - Type-safe variant styling utility
- **cmdk** - Command menu component
- **embla-carousel-react** - Carousel/slider functionality

### Database & ORM
- **Drizzle ORM** - Type-safe SQL query builder and schema manager
- **@neondatabase/serverless** - PostgreSQL serverless driver (Neon Database)
- **drizzle-zod** - Zod schema generation from Drizzle schemas
- **connect-pg-simple** - PostgreSQL session store (configured but not actively used)

### Form Management & Validation
- **react-hook-form** - Performant form state management
- **@hookform/resolvers** - Validation resolver utilities
- **zod** - TypeScript-first schema validation

### Utilities
- **date-fns** - Date manipulation and formatting
- **clsx** & **tailwind-merge** - Conditional className utilities
- **nanoid** - Unique ID generation

### Development Tools
- **Replit-specific plugins** - Dev banner, cartographer, runtime error modal for Replit environment
- **TypeScript** - Type checking and development experience
- **PostCSS** & **Autoprefixer** - CSS processing pipeline

### Build & Runtime
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for production builds
- **tsx** - TypeScript execution for Node.js

### Assets Management
- Custom asset path aliasing (@assets/) for static images
- Generated images stored in attached_assets directory
- Design guideline documents for content reference

## Payment Integration

### Stripe Integration (October 2025)
- **Payment Method:** Direct Stripe Checkout for subscriptions
- **Backend Endpoint:** `/api/create-checkout-session`
  - Creates Stripe Checkout Session for $5/month subscription
  - Uses environment variables: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`
  - Success URL: `/bienvenida` with session_id parameter
  - Cancel URL: `/resultados`
- **Frontend Integration:**
  - Stripe.js integration in Resultados page
  - Uses `VITE_STRIPE_PUBLIC_KEY` for client-side Stripe initialization
  - Button triggers checkout session and redirects to Stripe-hosted checkout
  - Loading states and error handling with toast notifications
- **Welcome Page (`/bienvenida`):**
  - Confirmation page after successful payment
  - Shows subscription benefits and next steps
  - Email confirmation notice
  - CTAs to return home or view guides
  - Clears diagnostic answers from localStorage

## Pre-Registration Flow (October 2025)

### Pre-Registration Page (`/pre-registro`)
- **Purpose:** Collect user information before starting the diagnostic
- **Data collected:**
  - Personal: Name, Email
  - Demographics: Age, Sex (F/M/Other)
  - Medical status: Current diagnosis (none, prediabetes, DM2, insulin resistance)
- **Storage:** localStorage (`NM_pre` key) with timestamp
- **Flow:** After submission → redirects to `/diagnostico`
- **Privacy notice:** Disclaimer about data usage for personalization
- **Cancel button:** Returns to home page
- **Design:** Clean form with Poppins font, olive/terracotta color scheme

### Updated CTAs
- All main CTAs now point to `/pre-registro` instead of direct to diagnostic
- Hero button text: "Iniciar mi diagnóstico funcional gratuito"
- Header, navigation, and CTA sections updated

## Health Profile & Blood Analysis Features (October 2025)

### Welcome Page Updates (Bienvenida)
- **Combined approach:** Educational content + Health profile orientation
- **Benefits listed:**
  - Recomendaciones de nutrición funcional individualizadas
  - Interpretación de análisis de sangre (A1C, colesterol, triglicéridos, etc.)
  - Planes nutricionales y suplementación personalizada
  - Seguimiento de progreso y soporte continuo
- **Primary CTA:** "Completar mi perfil de salud" → `/perfil`
- **Secondary CTAs:** "Interpretar análisis de sangre" → `/analisis`, "Volver al Inicio" → `/`
- Uses Lucide React icons throughout (no emojis)

### Health Profile Page (`/perfil`)
- **Data collected:**
  - Basic info: Age, gender
  - Physical metrics: Weight (kg), height (cm), physical activity level
  - Current symptoms: Checklist of 8 common symptoms (fatigue, cravings, digestive issues, etc.)
  - Medical history: Previous/current conditions, current medications
- **Storage:** NO storage - data passed via URL params only (gender for interpretation context)
- **Educational disclaimer:** Explicit warning that tool is educational only and does not store medical data
- **Flow:** After saving → redirects to `/analisis?genero={value}`

### Blood Analysis Interpretation Page (`/analisis`)
- **Values accepted:**
  - A1C (Hemoglobin A1C %)
  - Fasting glucose (mg/dL)
  - Total cholesterol (mg/dL)
  - LDL (bad cholesterol) (mg/dL)
  - HDL (good cholesterol) (mg/dL)
  - Triglycerides (mg/dL)
  - Hemoglobin (g/dL)
- **Interpretation logic:**
  - Color-coded results (normal, alert, high, low)
  - Evidence-based reference ranges
  - Personalized recommendations based on values and gender
  - Icons: CheckCircle (normal), AlertTriangle (alert), AlertCircle (high/low)
- **Educational disclaimer:** "Esta interpretación es educativa y no sustituye la consulta médica profesional"

## Recent Updates (October 2025)

### Header Redesign
- Logo integration: NutriMarvin olive logo displayed prominently
- Simplified navigation: Inicio, Diagnóstico, Guías, Resultados
- CTA button: "Empieza tu diagnóstico" in terracotta color
- Mobile responsive: Hamburger menu (☰) for mobile devices
- Sticky positioning with white background (#FFFFFF)
- Clean border and hover effects

### Footer Redesign
- Logo integration in footer with motivational phrase
- Navigation links: Inicio, Diagnóstico, Guías, Resultados, Política de Privacidad (separated by |)
- Dynamic copyright year using React useEffect
- Empowering message: "Tu cuerpo no está roto, solo está protegiéndose"
- Privacy information with confidentiality and security details
- Consistent styling across all pages (#F8F7F3 background, #4B4B3B text, #A15C38 links, #7A776F muted)
- Responsive design with link wrapping on mobile

### Privacy Policy
- Comprehensive 7-section privacy policy page
- Covers: data collection, usage, protection, user rights, legal compliance (GDPR, US, LATAM), cookies, and policy updates
- Contact email: privacidad@nutrimarvin.com
- Professional white container design with responsive layout

### Results Page Structure
- Enhanced visual design with card-based layout and subtle shadows
- Main container with warm beige background (#F8F7F3) and rounded corners
- **Title Section:**
  - H2: "Tu Patrón Funcional Detectado"
  - Pattern name displayed prominently with emoji (🩸/💩/🌙/🔥)
- **Guide Section:**
  - H3: "Tu Guía Funcional Personalizada"
  - Intro: "Basado en tus respuestas, esta guía está diseñada para ayudarte a entender cómo tu cuerpo se protege..."
  - Recommendations: White card with 5 numbered personalized points (1️⃣-5️⃣)
  - Closing quote: Motivational phrase in quotation marks
- **CTA Section:**
  - H4: "Tu siguiente paso"
  - Description: "Profundiza en tu transformación funcional..."
  - Button: "Suscríbete al Plan NutriMarvin ($5/mes)"
  - Link: https://stan.store/nutrimarvin
  - Privacy note: "Cancela en cualquier momento. Tu información es 100% confidencial"
- Full responsive design (mobile, tablet, desktop)