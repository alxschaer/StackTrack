import type { CategoryId } from '../types';
import { catById } from './categories';

export interface GrowthEstimate {
  rate: number;
  reason: string;
}

/**
 * Suggests a reasonable long-run growth rate for an account, written as a
 * transparent set of rules rather than a live model call (consistent with
 * this project having no backend to safely call a live AI/API from). Checked
 * in order from most to least specific; the first name match wins,
 * otherwise it falls back to the category's typical long-run average.
 *
 * These are general historical benchmarks for well-known investment types,
 * not a prediction for any specific security — not financial advice.
 */
const NAME_PATTERNS: { test: RegExp; rate: number; reason: string }[] = [
  {
    test: /s\s?&?\s?p\s?500|500 index/i,
    rate: 7,
    reason: 'Long-run historical average for a broad U.S. large-cap index (e.g. S&P 500).',
  },
  {
    test: /total (stock |world )?market|total us|vti\b|vt\b/i,
    rate: 7,
    reason: 'Long-run historical average for a total-market index fund.',
  },
  {
    test: /nasdaq|qqq|tech index/i,
    rate: 8,
    reason: 'Historically higher-growth, higher-volatility tech-heavy index.',
  },
  {
    test: /treasury|t-bill|tips|municipal|muni bond/i,
    rate: 4,
    reason: 'Typical long-run yield for government or investment-grade bonds.',
  },
  {
    test: /high.?yield|hysa/i,
    rate: 4.5,
    reason: 'Typical rate for a high-yield savings account.',
  },
];

export function estimateGrowthRate(category: CategoryId, name: string): GrowthEstimate {
  for (const p of NAME_PATTERNS) {
    if (p.test.test(name)) return { rate: p.rate, reason: p.reason };
  }
  const cat = catById(category);
  return {
    rate: cat.rate,
    reason: `Typical long-run average for "${cat.label}." Individual holdings vary a lot — adjust if you know more about this one.`,
  };
}
