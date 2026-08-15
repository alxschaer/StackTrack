# StackTrack

A personal finance dashboard for tracking net worth across accounts —
checking, savings, individual stocks, index funds, crypto, retirement
accounts — and projecting how it grows toward short-term goals and
retirement, in inflation-adjusted dollars.

**[Live demo →](#)** _(add your deployed URL here once it's live)_

<!-- Add a screenshot once you've deployed it, e.g.: -->
<!-- ![Overview screenshot](./docs/screenshot-overview.png) -->

## Features

- **Overview** — total net worth, blended return across accounts, monthly
  contributions, and an allocation breakdown by asset class.
- **Accounts** — add/edit/remove accounts with a per-account balance, monthly
  contribution, and expected annual growth rate (pre-filled with a sensible
  default per category, fully editable).
- **Projections** — a stacked area chart simulating monthly compounding per
  account over a chosen horizon (5–40 years or "to retirement"), with a
  separate inflation-adjusted line so nominal and real growth are both
  visible at once.
- **Retirement** — set a current age, retirement age, desired annual
  spending, and a withdrawal rate (4% rule by default). The app computes
  whether you're on track and, if not, roughly how much more you'd need to
  save monthly to close the gap, solved directly from the future-value-of-an-annuity
  formula.
- **AI Investing** — a small paper-trading tracker seeded with curated,
  illustrative stock picks (grouped by AI-relevant theme). Choose an amount,
  track a batch, and optionally pull live prices via a free
  [Finnhub](https://finnhub.io/register) API key to see how it's doing.
  Not financial advice.
- **Local-first persistence** — all data is saved to `localStorage` in your
  own browser. Nothing is sent to a server; there's no backend and no
  account to create.

### A note on the Finnhub API key

The AI Investing tab's live prices are fetched directly from the browser,
since this project intentionally has no backend. That means whatever
Finnhub key you enter is visible in this site's network requests to anyone
who opens dev tools — the same trade-off as any client-only app calling a
keyed API. It's never bundled into the built site or committed to the repo;
each visitor pastes in their own free key, stored only in their own
browser's `localStorage`. If you want it hidden instead, the standard fix is
a small serverless function that holds the key server-side and proxies the
request — a good next step if this ever needs to be more than a demo.

**On cost:** Finnhub's free tier is $0/month, requires no credit card to
sign up, and allows ~60 requests/minute — this app only calls it when you
click "Track this batch" or "Refresh prices," never automatically or in a
loop, so normal use stays far under that limit. Since no payment method is
on file, there's no way for Finnhub to charge anything even if that limit
were somehow exceeded — a request would just get rate-limited, not billed.
The free tier's license covers personal, non-commercial use, which this
project fits.

## Tech stack

- **React 18 + TypeScript**, built with **Vite**
- **Tailwind CSS** with a small custom design-token palette (`tailwind.config.js`)
- **Recharts** for the stacked-area / line projection charts
- **Vitest** unit tests around the projection math (`src/lib/projections.ts`)
- **GitHub Actions** CI: every push to `main` runs the test suite, builds
  the app, and deploys it to GitHub Pages automatically

## Getting started

```bash
npm install
npm run dev       # starts a local dev server
npm test          # runs the unit tests once
npm run build     # typechecks and builds a production bundle to dist/
npm run preview   # serves the production build locally
```

## Project structure

```
src/
  lib/
    categories.ts     category list + per-category default growth rates
    projections.ts     pure, unit-tested compounding/retirement math
    projections.test.ts
    storage.ts          localStorage load/save helpers
    format.ts            currency/percent formatting
    theme.ts              hex color tokens used by the charts
  components/
    ui.tsx                shared building blocks (Card, Field, TabButton, ...)
    OverviewTab.tsx
    AccountsTab.tsx
    ProjectionsTab.tsx
    RetirementTab.tsx
  App.tsx                 top-level state + layout
```

The financial calculations live in plain TypeScript functions with no React
or DOM dependency (`src/lib/projections.ts`), so they're tested directly and
kept separate from rendering.

## Deploying

This repo already ships with a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that tests, builds, and deploys to
**GitHub Pages** on every push to `main` — no separate hosting account
needed:

1. Push this project to a new GitHub repository.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` (or re-run the workflow from the **Actions** tab). Your
   site will be live at `https://<username>.github.io/<repo-name>/`.

Alternatively, since it's a static Vite build, you can deploy the `dist/`
folder to **Vercel** or **Netlify** by connecting the GitHub repo through
either dashboard and using the defaults (`npm run build`, output directory
`dist`) — no configuration needed beyond that.

## Notes

Growth-rate assumptions are inputs you control, not predictions — markets
(especially individual stocks and crypto) don't compound smoothly year to
year the way this model does. This is a planning tool, not financial advice.

## License

MIT — see [LICENSE](./LICENSE).
