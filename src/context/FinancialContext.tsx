import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';

export interface AccountBalances {
  traditional401k: number;
  roth401k: number;
  traditionalIra: number;
  rothIra: number;
  brokerage: number;
  hsa: number;
}

export interface FinancialState {
  // Personal
  currentAge: number;
  spouseAge: number;
  targetRetirementAge: number;
  filingStatus: 'Single' | 'Married Filing Jointly';
  hasSpouse: boolean;

  // Income & contributions
  monthlyTakeHomePay: number;
  grossAnnualIncome: number;
  annualContributions401k: number;
  monthlyRetirementExpenses: number;

  // Investment assumptions
  expectedReturn: number;
  inflationRate: number;

  // User accounts
  userBalances: AccountBalances;
  userPension: number;
  userSocialSecurity: number;
  userSsStartAge: number;

  // Spouse accounts
  spouseBalances: AccountBalances;
  spousePension: number;
  spouseSocialSecurity: number;
  spouseSsStartAge: number;

  // Tax
  currentTaxBracket: number;
}

export interface DerivedValues {
  totalPortfolio: number;
  totalTraditional: number;
  totalRoth: number;
  totalTaxable: number;
  totalHsa: number;
  yearsToRetirement: number;
  monthsToRetirement: number;
  projectedPortfolioAtRetirement: number;
  projectedMonthlyRetirementIncome: number;
  savingsGap: number;
  annualRetirementExpenses: number;
  targetPortfolio: number;
}

const defaultState: FinancialState = {
  currentAge: 55,
  spouseAge: 53,
  targetRetirementAge: 62,
  filingStatus: 'Married Filing Jointly',
  hasSpouse: false,

  monthlyTakeHomePay: 8000,
  grossAnnualIncome: 150000,
  annualContributions401k: 23500,
  monthlyRetirementExpenses: 6000,

  expectedReturn: 0.07,
  inflationRate: 0.025,

  userBalances: {
    traditional401k: 250000,
    roth401k: 50000,
    traditionalIra: 100000,
    rothIra: 25000,
    brokerage: 75000,
    hsa: 0,
  },
  userPension: 0,
  userSocialSecurity: 2800,
  userSsStartAge: 67,

  spouseBalances: {
    traditional401k: 0,
    roth401k: 0,
    traditionalIra: 0,
    rothIra: 0,
    brokerage: 0,
    hsa: 0,
  },
  spousePension: 0,
  spouseSocialSecurity: 0,
  spouseSsStartAge: 67,

  currentTaxBracket: 24,
};

interface FinancialContextType {
  state: FinancialState;
  derived: DerivedValues;
  updateState: (updates: Partial<FinancialState>) => void;
  updateUserBalances: (updates: Partial<AccountBalances>) => void;
  updateSpouseBalances: (updates: Partial<AccountBalances>) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

function computeDerived(state: FinancialState): DerivedValues {
  const { userBalances, spouseBalances, hasSpouse } = state;

  const totalTraditional =
    userBalances.traditional401k +
    userBalances.traditionalIra +
    (hasSpouse ? spouseBalances.traditional401k + spouseBalances.traditionalIra : 0);

  const totalRoth =
    userBalances.roth401k +
    userBalances.rothIra +
    (hasSpouse ? spouseBalances.roth401k + spouseBalances.rothIra : 0);

  const totalTaxable =
    userBalances.brokerage + (hasSpouse ? spouseBalances.brokerage : 0);

  const totalHsa =
    userBalances.hsa + (hasSpouse ? spouseBalances.hsa : 0);

  const totalPortfolio = totalTraditional + totalRoth + totalTaxable + totalHsa;

  const yearsToRetirement = Math.max(0, state.targetRetirementAge - state.currentAge);
  const monthsToRetirement = yearsToRetirement * 12;

  // FV of current portfolio grown at expected return, no additional contributions
  // (contributions are handled separately in projection pages)
  const projectedPortfolioAtRetirement =
    totalPortfolio * Math.pow(1 + state.expectedReturn, yearsToRetirement);

  const annualRetirementExpenses = state.monthlyRetirementExpenses * 12;

  // Target portfolio using 4% rule: annual expenses / 0.04 = 25x expenses
  const targetPortfolio = annualRetirementExpenses / 0.04;

  // Monthly income the projected portfolio generates at 4% rule
  const projectedMonthlyRetirementIncome = (projectedPortfolioAtRetirement * 0.04) / 12;

  // Lump-sum gap: how much more is needed today (in today's dollars) to hit the target
  const savingsGap = Math.max(0, targetPortfolio - projectedPortfolioAtRetirement);

  return {
    totalPortfolio,
    totalTraditional,
    totalRoth,
    totalTaxable,
    totalHsa,
    yearsToRetirement,
    monthsToRetirement,
    projectedPortfolioAtRetirement,
    projectedMonthlyRetirementIncome,
    savingsGap,
    annualRetirementExpenses,
    targetPortfolio,
  };
}

const STORAGE_KEY = '401k-app-state';

function loadState(): FinancialState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
  } catch {}
  return defaultState;
}

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FinancialState>(loadState);

  const derived = useMemo(() => computeDerived(state), [state]);

  const updateState = (updates: Partial<FinancialState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateUserBalances = (updates: Partial<AccountBalances>) => {
    setState((prev) => {
      const next = { ...prev, userBalances: { ...prev.userBalances, ...updates } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateSpouseBalances = (updates: Partial<AccountBalances>) => {
    setState((prev) => {
      const next = { ...prev, spouseBalances: { ...prev.spouseBalances, ...updates } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <FinancialContext.Provider value={{ state, derived, updateState, updateUserBalances, updateSpouseBalances }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancials() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancials must be used within a FinancialProvider');
  }
  return context;
}
