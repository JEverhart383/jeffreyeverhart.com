# jeffreyeverhart.com

Source for [jeffreyeverhart.com](https://jeffreyeverhart.com), a pnpm monorepo.

## Apps

- **`apps/web`** — the live site. Astro + Tailwind, content-collections-driven (blog posts and pages live in `apps/web/src/content`). Deploys to Vercel.
- **`apps/web-motion`** — a Next.js sandbox for animation experiments (Framer Motion, GSAP, Three.js, CSS/WAAPI). Not deployed as part of the main site; see `apps/web-motion/ROADMAP.md` for planned demos.

## Other

- **`scripts`** — one-off tooling used to migrate content off WordPress (`migrate-wp.js` converts the WordPress export XML into the markdown under `apps/web/src/content`).

## Development

```bash
pnpm install

pnpm dev          # apps/web on its default port
pnpm build
pnpm preview

pnpm dev:motion   # apps/web-motion on :3001
pnpm build:motion
```

## Deployment

`apps/web` is linked to Vercel (`vercel link` run from that directory). Deploy with `vercel` (preview) or `vercel --prod` from `apps/web`.
