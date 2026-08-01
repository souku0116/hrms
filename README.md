# HRMS

This repository is the technical foundation for a future HR Recruitment & Staffing platform. It intentionally contains no product pages, UI components, business workflows, seed data, or module-specific database schema.

## Stack

- React 18 with Vite
- JavaScript with Tailwind CSS v4
- React Router v6
- Supabase Auth/PostgreSQL client
- Vercel Serverless Functions
- PostgreSQL access from server routes through `postgres`

## Getting started

1. Copy `.env.example` to `.env.local` and supply the browser-safe Supabase values.
2. In Supabase SQL Editor, run `SUPABASE_SETUP.sql`.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.

`DATABASE_URL` is server-only. Do not place it in a Vite-prefixed variable or expose it to browser code. Configure it in Vercel for deployments and in a local server environment only when a serverless route needs database access.

## Scripts

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Starts the Vite development server on port 3000.     |
| `npm run build`        | Produces the production bundle in `dist/`.           |
| `npm run preview`      | Serves the production bundle locally.                |
| `npm run lint`         | Runs ESLint over client and server JavaScript.       |
| `npm run format`       | Applies Prettier formatting to supported files.      |
| `npm run format:check` | Verifies Prettier formatting without changing files. |

## Structure

```text
api/                         Vercel serverless endpoints; privileged work only
  health.js                  Infrastructure health endpoint
public/                      Static files served as-is
src/
  assets/                    Local assets grouped by type
    images/                   Image assets
    icons/                    Icon assets
  components/                Presentation-only reusable components
    common/                   Shared, non-UI-specific presentation helpers
    forms/                    Reusable form presentation components
    layout/                   Route-level layout composition
    sections/                 Reusable page-section composition
    ui/                       Design-system primitives
  config/                    Application configuration and integration options
  constants/                 Static, non-secret application constants
  hooks/                     Reusable React hooks
  lib/                       External-client integrations, such as Supabase
  pages/                     Thin route composition only; no business logic
  routes/                    Central React Router definitions
  services/                  Business and data orchestration logic
  styles/                    Tailwind entry point and global base styles
  utils/                     Framework-independent helper functions
db.js                       Server-only PostgreSQL client
SUPABASE_SETUP.sql          Generic auth-profile database foundation
vercel.json                 Vercel build and SPA routing configuration
jsconfig.json               Editor support for the @/ import alias
```

## Architecture rules

- Keep browser code inside `src/`; keep privileged database access in `api/` and `db.js` only.
- Use `@/` for imports rooted at `src/`, for example `@/components/ui/Button`.
- Import the Supabase browser client from `@/lib/supabaseClient`; do not attach it to `window`.
- Keep `pages/` limited to route composition. Place business and data orchestration in `services/`; keep components presentation-only.
- Add feature routes centrally in `src/routes/AppRoutes.jsx` once business features are approved.
- Keep every business table, RLS policy, and migration in a reviewed SQL file. Do not use the Supabase service-role key in client code.
- Maintain the `VITE_` prefix solely for browser-safe settings. `DATABASE_URL` remains server-only.

## Code quality

ESLint checks JavaScript and React usage, with browser and server globals kept separate. Prettier owns formatting. `.editorconfig` provides compatible defaults for editors that do not load Prettier automatically.

No environment file is committed: `.env.example` documents variable names only, while `.env`, `.env.local`, and other `.env.*` files are ignored. Before committing, run `npm run lint` and `npm run format:check`.

## Design system

The WorkSync design system is a reusable component layer, not a website. It is intentionally not mounted in a route, and no marketing or product page has been assembled.

### Theme architecture

`src/config/theme/` is the source of truth for visual values. `ThemeProvider` flattens those JavaScript tokens into `--ws-*` CSS custom properties on the document root. Components consume the variables through semantic Tailwind classes, so visual values are not duplicated in component code.

| Module           | Owns                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `colors.js`      | Brand, surface, text, border, and status colors.                     |
| `typography.js`  | Inter font stack, weights, and display-to-caption type scale.        |
| `spacing.js`     | The approved 4-to-120 spacing scale.                                 |
| `radius.js`      | 8px, 12px, 16px, and 24px radius scale.                              |
| `shadow.js`      | Card, hover, floating, and focus shadows.                            |
| `animation.js`   | 150ms, 250ms, and 350ms durations, easing, and card hover transform. |
| `breakpoints.js` | Responsive and content-width breakpoints.                            |

The color tokens are `primary #0F172A`, `primaryBlue #2563EB`, `secondaryBlue #3B82F6`, `success #10B981`, `background #FFFFFF`, `surface #F8FAFC`, `surfaceSecondary #F1F5F9`, `border #E2E8F0`, `textPrimary #111827`, `textSecondary #475569`, `muted #64748B`, `error #DC2626`, and `warning #F59E0B`.

The type scale is Display 60px, Hero 48px, H1 40px, H2 32px, H3 24px, H4 20px, Body Large 18px, Body 16px, Small 14px, and Caption 12px. The runtime font stack starts with Inter; self-host the Inter variable font before production launch to avoid a third-party font request.

### Component inventory

`src/components/ui/` contains documented, presentation-only controls: Button, Input, Textarea, Checkbox, Radio, Select, Badge, Chip, Card, Section, Container, Heading, Paragraph, IconWrapper, Loader, Spinner, Accordion, FAQItem, Modal, Toast, FeatureCard, ServiceCard, StatCard, Avatar, Tag, Pill, Pagination, EmptyState, and Breadcrumb.

`src/components/layout/` provides Navbar, Footer, PageLayout, SectionLayout, and PageHeader. Navbar supports desktop, tablet, and mobile navigation, sticky positioning, a transparent-hero state that becomes solid on scroll, and nested dropdown data.

`src/components/sections/` provides independent Hero, Statistics, Services, Industries, RecruitmentProcess, WhyWorkSync, Testimonials, FAQ, and CTA sections. They require caller-supplied content and are not composed into a homepage.

Use the barrels for consumer imports:

```js
import { Button, Card, Heading } from "@/components/ui";
import { Navbar, PageLayout } from "@/components/layout";
import { Hero, CTA } from "@/components/sections";
```

Components use passed data and composition props; keep queries, mutations, route decisions, and business rules in `services/` rather than in `pages/` or presentational components.

## Deployment

Vercel uses `npm run build`, deploys `dist/`, serves files under `api/` as serverless functions, and rewrites non-API paths to `index.html` so future React Router routes support direct navigation.
