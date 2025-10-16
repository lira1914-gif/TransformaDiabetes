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

**Diagnostic System**
- 15 questions mapped to 4 health axes using declarative configuration
- Multi-axis question contributions with proper normalization
- Score calculation: sum of (inverted) answers / count of contributions per axis
- Pattern detection logic:
  - Sorts axes by score (ascending - lower score = more problematic)
  - If abs(lowest - secondLowest) <= 2 → Combined pattern
  - Otherwise → Single dominant pattern
- 10 reachable patterns:
  - Individual: Metabólico, Digestivo, Estrés, Inflamatorio
  - Combined: Metabólico–Digestivo, Metabólico–Estrés, Metabólico–Inflamatorio, Digestivo–Estrés, Digestivo–Inflamatorio, Estrés–Inflamatorio

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
- `/diagnostico` - Diagnostic assessment wizard
- `/resultados` - Results display after assessment with subscription CTA and privacy notice
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

### Results Page Enhancements
- Subscription CTA section ($5/month offer)
- Privacy notice on results page
- Full responsive design (mobile, tablet, desktop)
- Proper spacing and typography for all devices