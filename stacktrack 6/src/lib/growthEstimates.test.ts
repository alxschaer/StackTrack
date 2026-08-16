import { describe, it, expect } from 'vitest';
import { estimateGrowthRate } from './growthEstimates';

describe('estimateGrowthRate', () => {
  it('recognizes an S&P 500 fund by name regardless of category', () => {
    const result = estimateGrowthRate('other', 'Vanguard S&P 500 Index Fund');
    expect(result.rate).toBe(7);
  });

  it('recognizes a Nasdaq/tech index fund', () => {
    const result = estimateGrowthRate('indexFunds', 'Invesco QQQ Trust');
    expect(result.rate).toBe(8);
  });

  it('recognizes a treasury/bond holding', () => {
    const result = estimateGrowthRate('other', 'US Treasury Bond Fund');
    expect(result.rate).toBe(4);
  });

  it('falls back to the category default when no name pattern matches', () => {
    const result = estimateGrowthRate('crypto', 'My wallet');
    expect(result.rate).toBe(15);
    expect(result.reason).toContain('Crypto');
  });

  it('is case-insensitive when matching account names', () => {
    const result = estimateGrowthRate('other', 'my S&P500 fund');
    expect(result.rate).toBe(7);
  });
});
