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
export const CURATED_BATCHES: StockBatchTemplate[] = [
  {
    id: 'ai-infrastructure',
    theme: 'AI Infrastructure',
    riskTier: 'core',
    picks: [
      { ticker: 'NVDA', name: 'NVIDIA', rationale: 'Designs the GPUs most AI models are trained and run on.' },
      { ticker: 'MSFT', name: 'Microsoft', rationale: 'Azure cloud platform and a deep OpenAI partnership.' },
      { ticker: 'AVGO', name: 'Broadcom', rationale: 'Custom AI chips and networking hardware for data centers.' },
    ],
  },
  {
    id: 'ai-platforms',
    theme: 'AI Platforms & Software',
    riskTier: 'core',
    picks: [
      { ticker: 'GOOGL', name: 'Alphabet', rationale: 'Google Cloud, DeepMind research, and the Gemini model family.' },
      { ticker: 'ORCL', name: 'Oracle', rationale: 'Cloud infrastructure in the middle of a major AI compute buildout.' },
      { ticker: 'CRM', name: 'Salesforce', rationale: 'Building AI agents directly into enterprise software tools.' },
    ],
  },
  {
    id: 'diversified-tech',
    theme: 'Diversified Mega-Cap Tech',
    riskTier: 'core',
    picks: [
      { ticker: 'AAPL', name: 'Apple', rationale: 'Large-scale consumer hardware now integrating on-device AI.' },
      { ticker: 'AMZN', name: 'Amazon', rationale: 'AWS cloud plus custom in-house AI training chips.' },
      { ticker: 'META', name: 'Meta Platforms', rationale: 'Heavy open-model AI research (Llama) and AI-driven ad targeting.' },
    ],
  },
  {
    id: 'emerging-ai-software',
    theme: 'Emerging AI Software',
    riskTier: 'speculative',
    picks: [
      { ticker: 'SOUN', name: 'SoundHound AI', rationale: 'Conversational voice AI platform; small-cap, historically volatile.' },
      { ticker: 'AI', name: 'C3.ai', rationale: 'Enterprise AI software pure-play; volatile trading history since its IPO.' },
      { ticker: 'BBAI', name: 'BigBear.ai', rationale: 'AI-driven analytics for government and industry; small-cap, speculative.' },
    ],
  },
  {
    id: 'ai-hardware-upstarts',
    theme: 'AI Hardware & Robotics Upstarts',
    riskTier: 'speculative',
    picks: [
      { ticker: 'ALAB', name: 'Astera Labs', rationale: 'AI data-center connectivity chips; newer public company, sharply volatile.' },
      { ticker: 'SYM', name: 'Symbotic', rationale: 'AI-driven warehouse robotics; smaller-cap and still unprofitable.' },
      { ticker: 'PATH', name: 'UiPath', rationale: 'AI-powered process automation; smaller-cap with slowing growth concerns.' },
    ],
  },
  {
    id: 'ai-specialized-industries',
    theme: 'AI in Specialized Industries',
    riskTier: 'speculative',
    picks: [
      { ticker: 'RXRX', name: 'Recursion Pharmaceuticals', rationale: 'AI-driven drug discovery; pre-profitability biotech, high risk.' },
      { ticker: 'TEM', name: 'Tempus AI', rationale: 'AI-powered precision medicine platform; newly public and unprofitable.' },
      { ticker: 'INOD', name: 'Innodata', rationale: 'Data engineering and annotation for AI model training; small-cap.' },
    ],
  },
];
