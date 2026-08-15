import type { Account, Settings, TrackedBatch } from '../types';

const KEY = 'ledger-state-v1';
const INVESTING_KEY = 'stacktrack-investing-v1';

export interface LedgerState {
  accounts: Account[];
  settings: Settings;
}

export function loadLedgerState(): LedgerState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LedgerState;
  } catch {
    return null;
  }
}

export function saveLedgerState(state: LedgerState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearLedgerState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// Kept in a separate key from the ledger state above since it's a distinct
// feature (API key + tracked stock batches) that a person might reset or
// inspect independently of their account data.
export interface InvestingState {
  apiKey: string;
  batches: TrackedBatch[];
}

export function loadInvestingState(): InvestingState | null {
  try {
    const raw = localStorage.getItem(INVESTING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as InvestingState;
  } catch {
    return null;
  }
}

export function saveInvestingState(state: InvestingState): boolean {
  try {
    localStorage.setItem(INVESTING_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
