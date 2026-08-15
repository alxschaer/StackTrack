# Changelog

All notable changes to this project are documented here. Versioning follows
[Semantic Versioning](https://semver.org/): **MAJOR.MINOR.PATCH**, where
patch releases are fixes or copy changes, minor releases add
backward-compatible features, and major releases break something.

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
