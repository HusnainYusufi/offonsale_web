# offonsale_web

The OffOnSale website: product, features, pricing, about, and the start of sign-up.

Next.js 16 (App Router, static pages), React 19, Tailwind 4, next-intl, GSAP with ScrollTrigger, Lenis and Three.js.

## Run

```sh
cp .env.example .env.local
pnpm install
pnpm dev        # http://localhost:3300
pnpm build && pnpm start
pnpm typecheck && pnpm lint
```

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Where the site is published. Used for canonical URLs, hreflang, the sitemap and Open Graph. |
| `NEXT_PUBLIC_ADMIN_URL` | The merchant admin. Sign-up hands over to `<admin>/signup`, sign-in to `<admin>/auth/login`. |

## Pages

All pages exist in English (`/`), Arabic (`/ar`) and Urdu (`/ur`). Arabic and Urdu are right to left.

| Path | Page |
|---|---|
| `/` | Home: silk hero (Three.js), story, features, steps, plans, FAQ |
| `/features` | Every feature, by area |
| `/pricing` | Plans in rupees and a full comparison |
| `/about` | Why OffOnSale exists |
| `/start` | Sign-up: plan, store name, email, country, language |
| `/privacy`, `/terms` | Legal |

Copy lives in `messages/{en,ar,ur}.json`. Plan prices and limits live in `src/lib/site.ts`. Keep both in step with the backend's plans.

## Sign-up journey

1. `/start` sends the merchant's choice to the admin's `/signup` (a plain GET form). The website never asks for a password or a card.
2. The admin keeps the choice in a short cookie and opens the secure registration page with the email filled in.
3. The store form starts from the choice. A chosen plan starts when the 14-day trial ends.
4. The welcome page offers to add a card on the payment gateway's page, or to skip.
5. Without a card, the admin reminds the merchant through the trial. 7 days after the trial, the store closes to shoppers until a plan is paid. Nothing is deleted.

## SEO

- Static HTML for every page and language. The text stays real HTML under the animations.
- Canonical URLs, `hreflang` alternates (with `x-default`), Open Graph and Twitter cards, and a generated Open Graph image.
- JSON-LD: Organization (every page), SoftwareApplication with plan offers (`/pricing`), FAQPage (home).
- `sitemap.xml` and `robots.txt` come from `src/app/sitemap.ts` and `src/app/robots.ts`.

## Motion and speed

- The headline is the largest paint. The WebGL silk loads after it, when the browser is idle, and only where WebGL works. It pauses off screen and in hidden tabs.
- `prefers-reduced-motion`: no scroll animation and a still silk.
- Without JavaScript, every section is visible. Reveal styles apply only once the `js` class is set.
