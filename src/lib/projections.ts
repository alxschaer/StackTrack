import type { Account, ProjectionPoint } from '../types';

/**
 * Simulates monthly compounding for every account (each with its own growth
 * rate and monthly contribution) and returns one snapshot per year, in both
 * nominal terms and inflation-adjusted ("real") terms.
 */
export function computeProjection(
  accounts: Account[],
  inflationRate: number,
  years: number
): ProjectionPoint[] {
  const months = Math.max(0, Math.round(years * 12));
  let balances = accounts.map((a) => Number(a.balance) || 0);
  const monthlyRates = accounts.map((a) => Math.pow(1 + (Number(a.rate) || 0) / 100, 1 / 12) - 1);
  const monthlyContribs = accounts.map((a) => Number(a.monthlyContribution) || 0);
  const data: ProjectionPoint[] = [];

  const record = (monthIndex: number) => {
    const year = monthIndex / 12;
    const nominal = balances.reduce((s, b) => s + b, 0);
    const real = nominal / Math.pow(1 + inflationRate / 100, year);
    const row = { year: Math.round(year * 10) / 10, nominal, real } as ProjectionPoint;
    accounts.forEach((a, i) => {
      row[a.category] = (row[a.category] || 0) + balances[i];
    });
    data.push(row);
  };

  record(0);
  for (let m = 1; m <= months; m++) {
    balances = balances.map((b, i) => b * (1 + monthlyRates[i]) + monthlyContribs[i]);
    if (m % 12 === 0) record(m);
  }
  return data;
}

/**
 * Solves (via the future-value-of-an-annuity formula) for the extra flat
 * monthly contribution — assumed to grow at `assumedRate` — needed on top
 * of the existing accounts to hit `targetRealWithdrawal` per year in
 * today's dollars, under `withdrawalRate` (e.g. the 4% rule).
 *
 * Returns null when the time horizon is non-positive, 0 when already on
 * track, and a positive monthly dollar figure otherwise.
 */
export function solveRequiredMonthly(
  baselineRealAtRetirement: number,
  years: number,
  assumedRate: number,
  inflationRate: number,
  targetRealWithdrawal: number,
  withdrawalRate: number
): number | null {
  if (years <= 0) return null;
  const neededReal = targetRealWithdrawal / (withdrawalRate / 100) - baselineRealAtRetirement;
  if (neededReal <= 0) return 0;

  const months = years * 12;
  const monthlyRate = Math.pow(1 + assumedRate / 100, 1 / 12) - 1;
  const inflationFactor = Math.pow(1 + inflationRate / 100, years);
  const fvFactor = monthlyRate === 0 ? months : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  const neededNominalFV = neededReal * inflationFactor;
  return neededNominalFV / fvFactor;
}
