# Changelog

All notable changes to this project are documented here. Versioning follows
[Semantic Versioning](https://semver.org/): **MAJOR.MINOR.PATCH**, where
patch releases are fixes or copy changes, minor releases add
backward-compatible features, and major releases break something.

## 1.6.1 — 2026-08-15
- Reworked both curated pick tiers to be genuinely diversified across
  sectors (healthcare, consumer staples, financials, retail, energy,
  automotive, gaming) instead of concentrated in AI-industry companies.
  "AI picks" means Claude selected them, not that they're all AI stocks —
  each tier now keeps just a couple of AI-relevant names. All tickers
  re-verified as actively trading before inclusion.

## 1.6.0 — 2026-08-15
- Added a "Transfer between accounts" tool on the Accounts tab: move money
  from one account into another existing one, or spin off a brand-new
  account funded from an existing one (e.g. buying $500 of a stock with
  money from checking) — both balances update in a single action.

## 1.5.0 — 2026-08-15
- Added a second, "speculative" tier of curated AI picks to the AI Investing
  tab: 3 more themed batches (Emerging AI Software, AI Hardware & Robotics
  Upstarts, AI in Specialized Industries) covering smaller, less-established,
  considerably more volatile companies than the original "core" tier.
  Displayed as a visually distinct row with its own risk warning; every
  ticker was verified as actively trading before being added.

## 1.4.0 — 2026-08-15
- Added manual holding entry to the AI Investing tab: enter any ticker with
  the price you actually paid, then use the existing "Refresh prices"
  button to pull in the current price via Finnhub. Works alongside the
  curated AI-picked batches, using the same tracking, persistence, and
  refresh logic.

## 1.3.0 — 2026-08-15
- Added a visible version number in the app header, sourced from
  `src/lib/version.ts`.
- Added this changelog.

## 1.2.1 — 2026-08-15
- Strengthened the free-tier/cost transparency messaging for the Finnhub
  API key, both in-app and in the README (no card required, $0/month,
  non-commercial license note).

## 1.2.0 — 2026-08-15
- Added an AI-suggested growth-rate estimator on the Accounts tab
  (`src/lib/growthEstimates.ts`): recognizes common benchmarks by account
  name (S&P 500, Nasdaq, treasuries, HYSA) and otherwise falls back to the
  category average, with a visible one-line reason for the suggestion.

## 1.1.0 — 2026-08-15
- Renamed the app from "Ledger" to "StackTrack."
- Added the AI Investing tab: curated, illustrative stock-pick batches with
  optional live prices via a user-supplied free Finnhub API key.

## 1.0.0 — 2026-08-15
- Initial release: net worth tracking across accounts, per-category
  compounding projections with inflation adjustment, and a retirement
  planner with the 4% rule. Local-first persistence via `localStorage`.
