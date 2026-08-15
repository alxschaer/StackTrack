import type { Account, Settings } from '../types';

const KEY = 'ledger-state-v1';

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
