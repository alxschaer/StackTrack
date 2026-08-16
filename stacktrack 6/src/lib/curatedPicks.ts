import type { StockBatchTemplate } from '../types';

/**
 * Written once, by Claude, as illustrative AI-themed stock picks. These are
 * static rather than generated live, because a genuinely live call to an AI
 * API from this page would require an API key embedded in the site's own
 * JavaScript — visible to any visitor, on a project that intentionally has
 * no backend to hide it behind. Picks favor large, extremely well-known,
 * highly liquid companies for a demo like this rather than speculative or
 * obscure names.
 *
 * This is not financial advice. It's a starting point for a portfolio demo
 * — please do your own research before investing real money.
 */
/**
 * "AI picks" means Claude (the AI) made the picks — not that every company
 * is in the AI industry. Each tier below is diversified across sectors,
 * with just a couple of AI-relevant names mixed in rather than the whole
 * set concentrated in one theme.
 */
export const CURATED_BATCHES: StockBatchTemplate[] = [
  {
    id: 'diversified-blue-chips',
    theme: 'Diversified Blue Chips',
    riskTier: 'core',
    picks: [
      { ticker: 'MSFT', name: 'Microsoft', rationale: 'Cloud and AI leader, also broad enterprise software.' },
      { ticker: 'JNJ', name: 'Johnson & Johnson', rationale: 'Healthcare and pharmaceuticals with decades of stability.' },
      { ticker: 'KO', name: 'Coca-Cola', rationale: 'Global consumer staples brand and a defensive dividend payer.' },
    ],
  },
  {
    id: 'global-industry-leaders',
    theme: 'Global Industry Leaders',
    riskTier: 'core',
    picks: [
      { ticker: 'NVDA', name: 'NVIDIA', rationale: 'Leading AI/semiconductor company.' },
      { ticker: 'JPM', name: 'JPMorgan Chase', rationale: 'Largest U.S. bank by assets.' },
      { ticker: 'COST', name: 'Costco', rationale: 'Membership retail with an unusually loyal customer base.' },
    ],
  },
  {
    id: 'quality-stability',
    theme: 'Quality & Stability',
    riskTier: 'core',
    picks: [
      { ticker: 'HD', name: 'Home Depot', rationale: 'Home improvement retail leader.' },
      { ticker: 'XOM', name: 'ExxonMobil', rationale: 'Major global energy producer.' },
      { ticker: 'V', name: 'Visa', rationale: 'Global payments network with high margins.' },
    ],
  },
  {
    id: 'volatile-growth-stories',
    theme: 'Volatile Growth Stories',
    riskTier: 'speculative',
    picks: [
      { ticker: 'SOUN', name: 'SoundHound AI', rationale: 'Conversational voice AI platform; small-cap and volatile.' },
      { ticker: 'SOFI', name: 'SoFi Technologies', rationale: 'Digital bank and fintech; smaller-cap growth story.' },
      { ticker: 'CVNA', name: 'Carvana', rationale: 'Online used-car retailer with a dramatic volatility history.' },
    ],
  },
  {
    id: 'emerging-disruptors',
    theme: 'Emerging Disruptors',
    riskTier: 'speculative',
    picks: [
      { ticker: 'RIVN', name: 'Rivian', rationale: 'Electric vehicle manufacturer; early-stage and unprofitable.' },
      { ticker: 'PLUG', name: 'Plug Power', rationale: 'Hydrogen fuel-cell technology; high cash burn.' },
      { ticker: 'AFRM', name: 'Affirm', rationale: 'Buy-now-pay-later fintech; smaller-cap and volatile.' },
    ],
  },
  {
    id: 'high-risk-frontier',
    theme: 'High-Risk Turnarounds & Frontier Bets',
    riskTier: 'speculative',
    picks: [
      { ticker: 'RXRX', name: 'Recursion Pharmaceuticals', rationale: 'AI-driven drug discovery; pre-profit biotech.' },
      { ticker: 'DKNG', name: 'DraftKings', rationale: 'Online sports betting; competitive and volatile.' },
      { ticker: 'IONQ', name: 'IonQ', rationale: 'Quantum computing; pre-revenue frontier technology.' },
    ],
  },
];
