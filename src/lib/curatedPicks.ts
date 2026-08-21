import type { StockBatchTemplate } from '../types';

/**
 * "AI picks" means Claude (the AI) made the picks — not that every company
 * is in the AI industry. Each tier is diversified across sectors, with just
 * a couple of AI-relevant names mixed in rather than the whole set
 * concentrated in one theme.
 *
 * analystTargetPrice is a REAL third-party Wall Street analyst consensus
 * 12-month price target, gathered via web search on the curatedDate below
 * (sources include TipRanks, StockAnalysis.com/S&P Global, ChartMill, and
 * Public.com) — not a number Claude invented. Analyst targets change
 * constantly and are themselves just estimates, not guarantees; treat them
 * as one data point among many, not a prediction.
 *
 * This is not financial advice.
 */
export const CURATED_BATCHES: StockBatchTemplate[] = [
  {
    id: 'diversified-blue-chips',
    theme: 'Diversified Blue Chips',
    riskTier: 'core',
    curatedDate: '2026-08-17',
    targetPriceAsOf: 'Aug 2026',
    picks: [
      {
        ticker: 'MSFT',
        name: 'Microsoft',
        rationale: 'Cloud and AI leader, also broad enterprise software.',
        analysis:
          'Diversified across cloud (Azure), productivity software (Microsoft 365), and gaming, with AI infrastructure and its OpenAI partnership as a growth driver rather than the whole business. Consistent profitability and one of the largest market caps in the world make it a core rather than speculative holding.',
        analystTargetPrice: 565,
      },
      {
        ticker: 'JNJ',
        name: 'Johnson & Johnson',
        rationale: 'Healthcare and pharmaceuticals with decades of stability.',
        analysis:
          'A diversified healthcare giant spanning pharmaceuticals and medical devices, with a dividend increased for over 60 consecutive years. Growth is slower than tech, but earnings are far less tied to any single product cycle or economic swing.',
        analystTargetPrice: 238,
      },
      {
        ticker: 'KO',
        name: 'Coca-Cola',
        rationale: 'Global consumer staples brand and a defensive dividend payer.',
        analysis:
          'One of the most recognized consumer brands globally, with a distribution network that is difficult to replicate. Demand tends to hold up in weak economies, which is the main reason it sits in the "core" tier rather than "speculative."',
        analystTargetPrice: 95,
      },
    ],
  },
  {
    id: 'global-industry-leaders',
    theme: 'Global Industry Leaders',
    riskTier: 'core',
    curatedDate: '2026-08-17',
    targetPriceAsOf: 'Aug 2026',
    picks: [
      {
        ticker: 'NVDA',
        name: 'NVIDIA',
        rationale: 'Leading AI/semiconductor company.',
        analysis:
          'Dominant in the GPUs used to train and run AI models, which has driven rapid revenue growth but also means results are more sensitive to AI-spending cycles than a typical mega-cap. Included here as the batch\'s one clearly AI-industry name.',
        analystTargetPrice: 305,
      },
      {
        ticker: 'JPM',
        name: 'JPMorgan Chase',
        rationale: 'Largest U.S. bank by assets.',
        analysis:
          'The largest U.S. bank by assets, with revenue spread across consumer banking, investment banking, and asset management. Bank earnings are sensitive to interest rates and credit conditions, but scale and diversification make it one of the more stable large financials.',
        analystTargetPrice: 350,
      },
      {
        ticker: 'COST',
        name: 'Costco',
        rationale: 'Membership retail with an unusually loyal customer base.',
        analysis:
          'A membership-fee retail model that produces unusually predictable, recurring revenue and famously high customer renewal rates. Slower-growth than tech, but historically resilient through downturns.',
        analystTargetPrice: 1100,
      },
    ],
  },
  {
    id: 'quality-stability',
    theme: 'Quality & Stability',
    riskTier: 'core',
    curatedDate: '2026-08-17',
    targetPriceAsOf: 'Aug 2026',
    picks: [
      {
        ticker: 'HD',
        name: 'Home Depot',
        rationale: 'Home improvement retail leader.',
        analysis:
          'The largest home-improvement retailer in North America, benefiting from both DIY consumer demand and a growing professional-contractor business. Sensitive to housing-market activity and interest rates, but has a long track record of weathering cycles.',
        analystTargetPrice: 390,
      },
      {
        ticker: 'XOM',
        name: 'ExxonMobil',
        rationale: 'Major global energy producer.',
        analysis:
          'A vertically integrated energy major with production, refining, and chemicals operations. Earnings move with oil and gas prices, but a strong balance sheet and decades of consistent dividend payments make it a traditional "core" holding.',
        analystTargetPrice: 173,
      },
      {
        ticker: 'V',
        name: 'Visa',
        rationale: 'Global payments network with high margins.',
        analysis:
          'Operates the payment rails behind a huge share of global card transactions, earning a fee on volume rather than taking on lending risk itself. High margins and exposure to the long-run shift from cash to digital payments.',
        analystTargetPrice: 400,
      },
    ],
  },
  {
    id: 'volatile-growth-stories',
    theme: 'Volatile Growth Stories',
    riskTier: 'speculative',
    curatedDate: '2026-08-17',
    targetPriceAsOf: 'Aug 2026',
    picks: [
      {
        ticker: 'SOUN',
        name: 'SoundHound AI',
        rationale: 'Conversational voice AI platform; small-cap and volatile.',
        analysis:
          'A small-cap voice-AI company whose technology powers voice assistants for cars, restaurants, and call centers. Revenue is growing quickly off a small base, but the company isn\'t yet consistently profitable, and the stock has swung sharply on both AI-sector sentiment and its own earnings.',
        analystTargetPrice: 13,
      },
      {
        ticker: 'SOFI',
        name: 'SoFi Technologies',
        rationale: 'Digital bank and fintech; smaller-cap growth story.',
        analysis:
          'A digital-first bank and fintech platform that has grown its member base quickly by cross-selling loans, banking, and investing products. More volatile than a traditional bank stock, and it has faced periodic short-seller reports and credit-quality questions in 2026.',
        analystTargetPrice: 21,
      },
      {
        ticker: 'CVNA',
        name: 'Carvana',
        rationale: 'Online used-car retailer with a dramatic volatility history.',
        analysis:
          'An online used-car retailer that came close to bankruptcy in 2023 before a sharp operational and financial turnaround. Now profitable and growing quickly, but the stock remains highly sensitive to used-car pricing, financing costs, and execution risk given how far it has already run.',
        analystTargetPrice: 530,
      },
    ],
  },
  {
    id: 'emerging-disruptors',
    theme: 'Emerging Disruptors',
    riskTier: 'speculative',
    curatedDate: '2026-08-17',
    targetPriceAsOf: 'Aug 2026',
    picks: [
      {
        ticker: 'RIVN',
        name: 'Rivian',
        rationale: 'Electric vehicle manufacturer; early-stage and unprofitable.',
        analysis:
          'An EV manufacturer ramping production of its lower-priced R2 SUV to move beyond its premium R1 trucks. Still posting significant losses, and success depends heavily on execution during the R2 ramp and continued EV demand.',
        analystTargetPrice: 20,
      },
      {
        ticker: 'PLUG',
        name: 'Plug Power',
        rationale: 'Hydrogen fuel-cell technology; high cash burn.',
        analysis:
          'A hydrogen fuel-cell and green-hydrogen infrastructure company. Revenue is growing, but the company has a long history of significant cash burn and analyst price targets on it are unusually low relative to its share count — one of the more speculative names in this whole list.',
        analystTargetPrice: 1.3,
      },
      {
        ticker: 'AFRM',
        name: 'Affirm',
        rationale: 'Buy-now-pay-later fintech; smaller-cap and volatile.',
        analysis:
          'A buy-now-pay-later lender that partners with a large and growing base of merchants. Growth has been strong, but as a consumer lender its results are sensitive to delinquency trends and the broader credit cycle.',
        analystTargetPrice: 85,
      },
    ],
  },
  {
    id: 'high-risk-frontier',
    theme: 'High-Risk Turnarounds & Frontier Bets',
    riskTier: 'speculative',
    curatedDate: '2026-08-17',
    targetPriceAsOf: 'Aug 2026',
    picks: [
      {
        ticker: 'RXRX',
        name: 'Recursion Pharmaceuticals',
        rationale: 'AI-driven drug discovery; pre-profit biotech.',
        analysis:
          'A biotech using AI and automated lab experiments to speed up drug discovery. Still pre-revenue on any approved drug, so the stock trades on clinical-trial and partnership news rather than earnings — high risk, with analyst price targets recently trimmed on execution concerns.',
        analystTargetPrice: 7,
      },
      {
        ticker: 'DKNG',
        name: 'DraftKings',
        rationale: 'Online sports betting; competitive and volatile.',
        analysis:
          'A leading online sports-betting and iGaming operator expanding into prediction markets. The industry is competitive and regulation varies by state, but the business has been scaling toward sustained profitability.',
        analystTargetPrice: 39,
      },
      {
        ticker: 'IONQ',
        name: 'IonQ',
        rationale: 'Quantum computing; pre-revenue frontier technology.',
        analysis:
          'A quantum-computing company selling cloud access to its trapped-ion quantum hardware, mostly to research and government customers so far. Commercial quantum computing is still an unproven market — this is the most speculative, longest-horizon bet in the whole list.',
        analystTargetPrice: 71,
      },
    ],
  },
];
