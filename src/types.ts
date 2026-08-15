export type CategoryId =
  | 'checking'
  | 'savings'
  | 'indexFunds'
  | 'stocks'
  | 'retirement'
  | 'bonds'
  | 'crypto'
  | 'other';

export interface Category {
  id: CategoryId;
  label: string;
  rate: number;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  category: CategoryId;
  balance: number;
  monthlyContribution: number;
  rate: number;
}

export interface Settings {
  inflationRate: number;
  currentAge: number;
  retirementAge: number;
  desiredAnnualSpending: number;
  withdrawalRate: number;
  additionalSavingsRate: number;
}

export interface ProjectionPoint {
  year: number;
  nominal: number;
  real: number;
  [categoryId: string]: number;
}
