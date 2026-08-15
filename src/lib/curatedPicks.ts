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
    picks: [
      { ticker: 'NVDA', name: 'NVIDIA', rationale: 'Designs the GPUs most AI models are trained and run on.' },
      { ticker: 'MSFT', name: 'Microsoft', rationale: 'Azure cloud platform and a deep OpenAI partnership.' },
      { ticker: 'AVGO', name: 'Broadcom', rationale: 'Custom AI chips and networking hardware for data centers.' },
    ],
  },
  {
    id: 'ai-platforms',
    theme: 'AI Platforms & Software',
    picks: [
      { ticker: 'GOOGL', name: 'Alphabet', rationale: 'Google Cloud, DeepMind research, and the Gemini model family.' },
      { ticker: 'ORCL', name: 'Oracle', rationale: 'Cloud infrastructure in the middle of a major AI compute buildout.' },
      { ticker: 'CRM', name: 'Salesforce', rationale: 'Building AI agents directly into enterprise software tools.' },
    ],
  },
  {
    id: 'diversified-tech',
    theme: 'Diversified Mega-Cap Tech',
    picks: [
      { ticker: 'AAPL', name: 'Apple', rationale: 'Large-scale consumer hardware now integrating on-device AI.' },
      { ticker: 'AMZN', name: 'Amazon', rationale: 'AWS cloud plus custom in-house AI training chips.' },
      { ticker: 'META', name: 'Meta Platforms', rationale: 'Heavy open-model AI research (Llama) and AI-driven ad targeting.' },
    ],
  },
];
