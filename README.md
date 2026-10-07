# taido.dev — Portfolio of Tài Đỗ (Kai)

Personal portfolio rebuilt on **Astro + Cloudflare**: static-first pages for SEO, edge SSR API endpoints, i18n routes (EN/VI/JA), interactive 3D hero, Kai AI chatbot, D1 guestbook & contact.

## Stack

- **Astro 5** — prerendered locale pages (`/en`, `/vi`, `/jp`), view transitions, islands
- **@astrojs/cloudflare** — SSR adapter; D1, R2, Workers AI bindings via `locals.runtime.env`
- **React islands** — Three.js hero scene, Kai chat, guestbook, contact form
- **Tailwind CSS v4** — aurora token system (`src/styles/global.css`)
- **Cloudflare D1** — `guestbook_entries`, `contact_messages`, `page_views` (see `migrations/`)

## Commands

```bash
npm install --legacy-peer-deps
npx wrangler d1 migrations apply DB --local   # one-time: create local D1 tables
npm run dev       # astro dev (platformProxy gives local D1/AI bindings)
npm run check     # astro check (types)
npm run lint      # eslint
npm run build     # astro build → dist/
npm run deploy    # build + wrangler deploy
```

## Structure

- `src/pages/[locale]/index.astro` — prerendered per-locale page
- `src/pages/index.astro` — Accept-Language redirect to a locale
- `src/pages/api/*` — edge endpoints (`/api/contact`, `/api/guestbook`, `/api/ai/chat`, `/api/health`)
- `src/components/*.astro` — static sections; `src/components/react/*` — interactive islands
- `src/i18n/*` — dictionaries; `src/data/portfolio.ts` — site content
