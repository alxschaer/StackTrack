import { describe, it, expect } from 'vitest';
import { computeProjection, solveRequiredMonthly } from './projections';
import type { Account } from '../types';

const account = (overrides: Partial<Account> = {}): Account => ({
  id: 'a1',
  name: 'Test',
  category: 'indexFunds',
  balance: 10000,
  monthlyContribution: 0,
  rate: 12,
  ...overrides,
});

describe('computeProjection', () => {
  it('returns the starting balance at year 0', () => {
    const data = computeProjection([account({ balance: 5000 })], 3, 10);
    expect(data[0].nominal).toBe(5000);
    expect(data[0].real).toBe(5000);
  });

  it('compounds a single lump sum to exactly the stated annual rate after one year', () => {
    // The monthly rate is derived as (1+annual)^(1/12)-1 specifically so that
    // 12 monthly compounds reproduce the stated annual rate exactly — not a
    // naive nominal (1+annual/12)^12 rate.
    const data = computeProjection([account({ balance: 10000, monthlyContribution: 0, rate: 12 })], 0, 1);
    const last = data[data.length - 1];
    expect(last.nominal).toBeCloseTo(10000 * 1.12, 5);
  });

  it('compounds over multiple years using the stated annual rate as the base', () => {
    const data = computeProjection([account({ balance: 10000, monthlyContribution: 0, rate: 10 })], 0, 3);
    const last = data[data.length - 1];
    expect(last.nominal).toBeCloseTo(10000 * Math.pow(1.1, 3), 5);
  });

  it('discounts the nominal value by inflation to get the real value', () => {
    const data = computeProjection([account({ balance: 10000, rate: 0 })], 10, 1);
    const last = data[data.length - 1];
    expect(last.real).toBeCloseTo(last.nominal / 1.1, 5);
  });

  it('grows balances from monthly contributions alone', () => {
    const data = computeProjection([account({ balance: 0, monthlyContribution: 100, rate: 0 })], 0, 1);
    expect(data[data.length - 1].nominal).toBeCloseTo(1200, 5);
  });

  it('buckets balances by category for stacked charting', () => {
    const data = computeProjection(
      [account({ category: 'crypto', balance: 1000, rate: 0 }), account({ category: 'bonds', balance: 2000, rate: 0 })],
      0,
      1
    );
    const last = data[data.length - 1];
    expect(last.crypto).toBeCloseTo(1000, 5);
    expect(last.bonds).toBeCloseTo(2000, 5);
  });

  it('returns zero balances for an empty account list', () => {
    const data = computeProjection([], 3, 5);
    expect(data[data.length - 1].nominal).toBe(0);
  });
});

describe('solveRequiredMonthly', () => {
  it('returns null for a non-positive time horizon', () => {
    expect(solveRequiredMonthly(0, 0, 7, 3, 40000, 4)).toBeNull();
  });

  it('returns 0 when already on track', () => {
    const result = solveRequiredMonthly(2000000, 20, 7, 3, 40000, 4);
    expect(result).toBe(0);
  });

  it('returns a positive monthly figure when behind pace', () => {
    const result = solveRequiredMonthly(0, 20, 7, 3, 40000, 4);
    expect(result).toBeGreaterThan(0);
  });

  it('required monthly contribution shrinks as the time horizon grows', () => {
    const shortHorizon = solveRequiredMonthly(0, 10, 7, 3, 40000, 4)!;
    const longHorizon = solveRequiredMonthly(0, 30, 7, 3, 40000, 4)!;
    expect(longHorizon).toBeLessThan(shortHorizon);
  });
});
