# x-kira - Next.js Boilerplate

## Overview

x-kira is a production-ready Next.js 16 boilerplate designed to help developers ship web applications quickly. It includes a comprehensive collection of utilities (185+), custom React hooks (20+), premium Google Fonts (16), and pre-configured UI components using shadcn/ui. The project emphasizes developer experience with TypeScript, Tailwind CSS 4, Framer Motion animations, and internationalization support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 16** with App Router architecture
- **React 19** with Server Components (RSC) enabled
- **TypeScript** for type safety throughout the codebase

### Styling System
- **Tailwind CSS 4** with custom theme configuration in `app/globals.css`
- **shadcn/ui** components (New York style) configured via `components.json`
- **CSS Variables** for theming with dark mode support via `next-themes`
- **16 Google Fonts** pre-configured for typography variety (display, body, serif, mono, handwriting categories)

### Internationalization (i18n)
- **next-intl** for multi-language support
- Locale routing with `[locale]` dynamic segments
- Two supported locales: English (en) and Indonesian (id)
- Messages stored in `messages/` directory as JSON files
- Middleware handles locale detection and routing

### State Management
- **Zustand** available for global state
- **React Hook Form** with **Zod** validation for forms
- Custom hooks in `hooks/` directory for common patterns

### Animation System
- **Framer Motion** for complex animations
- **rough-notation** for hand-drawn annotation effects
- Custom animated components (theme toggle, scroll progress, back-to-top)

### Component Architecture
- UI primitives in `components/ui/` (button, magic-card, etc.)
- Feature components at `components/` root level
- Code-splitting with React `lazy()` for heavy components
- Memoization patterns using `memo()` for performance

### Utility Library Structure
Located in `lib/utils/`:
- **api.ts** - HTTP client helpers with Axios
- **array.ts** - Array manipulation (chunk, unique, shuffle, groupBy)
- **async.ts** - Promise utilities (sleep, retry, timeout)
- **browser.ts** - Device/browser detection
- **color.ts** - Color conversion (hex, rgb, hsl)
- **crypto.ts** - UUID, nanoid, hashing
- **date.ts** - Date formatting and manipulation
- **dom.ts** - Scroll and DOM helpers
- **format.ts** - Currency, number, file size formatting
- **number.ts** - Math utilities (clamp, random, round)
- **object.ts** - Object manipulation (pick, omit, deepClone)
- **sound.ts** - Audio playback utilities
- **storage.ts** - LocalStorage/SessionStorage helpers
- **string.ts** - String manipulation (slugify, truncate, capitalize)
- **validation.ts** - Email, URL, phone validation

### Custom Hooks Library
Located in `hooks/`:
- **use-debounce** / **use-throttle** - Rate limiting
- **use-local-storage** - Persistent state
- **use-media-query** - Responsive breakpoints
- **use-click-outside** - Dropdown/modal closing
- **use-scroll-position** - Scroll tracking
- **use-sound** - Audio playback with Web Audio API
- **use-async** / **use-fetch** - Data fetching
- **use-countdown** / **use-interval** - Timers
- **use-keyboard-shortcut** - Hotkey handling

### API Routes
- `/api/health` - Health check endpoint for monitoring
- `/api/qr` - Server-side proxy for QR code generation (hides external API)

### Middleware
- Handles i18n routing via `next-intl`
- Adds security headers (X-Frame-Options, CORS for API routes)
- Request logging with timestamps

## External Dependencies

### Core Framework
- **next** (16.0.10) - React framework
- **react** / **react-dom** (19.2.3) - UI library
- **typescript** (5.x) - Type system

### UI & Styling
- **tailwindcss** (4.x) with **@tailwindcss/postcss**
- **tw-animate-css** - Animation utilities
- **class-variance-authority** - Component variants
- **clsx** / **tailwind-merge** - Class name utilities
- **lucide-react** - Icon library

### Animation
- **framer-motion** / **motion** (12.x) - Animation library
- **rough-notation** - Hand-drawn effects

### Form Handling
- **react-hook-form** (7.x) - Form state management
- **@hookform/resolvers** - Validation resolvers
- **zod** (4.x) - Schema validation

### Internationalization
- **next-intl** (4.x) - i18n for Next.js

### State & Data
- **zustand** (5.x) - State management
- **axios** (1.x) - HTTP client

### UI Components
- **@radix-ui/react-slot** - Slot primitive
- **vaul** - Drawer component
- **next-themes** - Theme switching

### External APIs
- QR code generation service at `https://pair-mega-iwes.onrender.com` (configurable via `API_BASE` env var)

### Development Tools
- **eslint** with **eslint-config-next** - Linting
- **@types/node**, **@types/react**, **@types/react-dom** - Type definitions