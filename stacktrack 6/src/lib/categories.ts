import type { Category, CategoryId } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'checking', label: 'Checking', rate: 0.5, color: '#7c8894' },
  { id: 'savings', label: 'Savings / HYSA', rate: 4.5, color: '#6fa8c9' },
  { id: 'indexFunds', label: 'Index Funds', rate: 7, color: '#6fae7f' },
  { id: 'stocks', label: 'Individual Stocks', rate: 8, color: '#9b8fc9' },
  { id: 'retirement', label: 'Retirement (401k/IRA)', rate: 7, color: '#c17f95' },
  { id: 'bonds', label: 'Bonds / CDs', rate: 4, color: '#c9a15a' },
  { id: 'crypto', label: 'Crypto', rate: 15, color: '#c98a5a' },
  { id: 'other', label: 'Other', rate: 5, color: '#8b93a1' },
];

export const catById = (id: CategoryId | string): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
