# GTMGuy

**Your AI co-founder for launching SaaS without the guesswork.**

GTMGuy helps busy founders validate ideas, plan features, and launch faster with a suite of AI-powered tools that cover the whole journey — from understanding your market to growing your product.

![GTMGuy — Launch Your SaaS Without The Guesswork](./public/gtmguy_welcome.png)

---

## Features

16 AI tools spanning the four stages of building a SaaS:

| Stage | Tools |
| --- | --- |
| **Understand** | ICP Creator, User Research Planner, SWOT Analysis |
| **Build** | MVP Feature Generator, PRD Generator, Feature Prioritization, User Journey Mapper, Metrics & KPI Generator |
| **Launch** | GTM Strategy Generator, Product Launch Planner, AI Copywriting Assistant |
| **Grow** | Landing Page Optimizer, SEO Optimizer, Internal Link Optimizer, A/B Test Planner, Blog Post Generator |

Each tool returns structured, markdown-formatted output you can export. The app also includes a Markdown blog, Google sign-in, a monthly credit system (100 credits/month), and Paddle billing.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Nuxt 3](https://nuxt.com) (Vue 3, SSR) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + Typography plugin |
| AI | [OpenAI](https://platform.openai.com) (`gpt-4o-mini`, `dall-e-3`) via the Vercel AI SDK |
| Auth & Database | [Supabase](https://supabase.com) (Google OAuth + Postgres) |
| Billing | [Paddle](https://www.paddle.com) |
| Content | [Nuxt Content](https://content.nuxt.com) (Markdown blog) |
| Icons & Fonts | Phosphor Icons (`@nuxt/icon`), `@nuxt/fonts` (Poppins) |
| SEO | `@nuxtjs/sitemap`, dynamic `robots.txt` / `llms.txt` |

---

## Getting Started

### Prerequisites

- **Node.js 18+** (the server uses the built-in global `fetch`)
- **pnpm** (this repo ships a `pnpm-lock.yaml`)
- A **Supabase** project, an **OpenAI** API key, and a **Paddle** account

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

```dotenv
# OpenAI
OPENAI_API_KEY=

# Supabase
SUPABASE_URL=
SUPABASE_KEY=              # anon/public key
SUPABASE_SERVICE_KEY=      # service-role key (server-side only)

# Paddle
PADDLE_CLIENT_TOKEN=
PADDLE_SECRET_KEY=
PADDLE_PRICE_ID=           # price ID of the lifetime/pro product
PADDLE_ENVIRONMENT=        # 'sandbox' or 'production'
PADDLE_URL=

# Optional — defaults to https://gtmguy.ai
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up the database

In your Supabase project, create an `accounts` table that backs the credit system:

| Column | Type | Notes |
| --- | --- | --- |
| `user` | `uuid` | references the authenticated Supabase user |
| `credits` | `int4` | remaining credits (seeded at 100) |
| `credits_last_reset` | `timestamptz` | start of the current billing month |

Accounts are created automatically on first sign-in. Credits are consumed **server-side** on each tool request and refill to 100 at the start of every UTC month.

### 4. Run the development server

```bash
pnpm dev
```

The app runs at **http://localhost:3000**.

---

## Building for Production

```bash
# Build
pnpm build

# Preview the production build locally
pnpm preview
```

See the [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for hosting options.

---

## Project Structure

```
.
├── components/        # Tool UIs (one per AI tool) + layout/landing components
├── composables/       # useAuth, useCredits, useSeo, useUrlValidation
├── config/            # tools.ts & usecases.ts — tool catalog and metadata
├── content/           # Markdown blog posts and legal pages
├── pages/             # Routes (app, blog, tools, usecases, auth)
├── server/
│   ├── api/           # AI endpoints (one per tool) + auth/credits endpoints
│   └── utils/         # consumeCredit (auth + credit), pageFetcher (SSRF-safe)
└── nuxt.config.ts
```
