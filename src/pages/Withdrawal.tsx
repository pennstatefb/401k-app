import { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';

export function Withdrawal() {
  const { state } = useFinancials();
  const [withdrawalRate, setWithdrawalRate] = useState(4.0); // The 4% Rule
  
  // Calculate total portfolio
  const traditionalTotal = state.userBalances.traditional401k + state.userBalances.traditionalIra +
    (state.hasSpouse ? state.spouseBalances.traditional401k + state.spouseBalances.traditionalIra : 0);
  
  const rothTotal = state.userBalances.roth401k + state.userBalances.rothIra +
    (state.hasSpouse ? state.spouseBalances.roth401k + state.spouseBalances.rothIra : 0);
  
  const taxableTotal = state.userBalances.brokerage +
    (state.hasSpouse ? state.spouseBalances.brokerage : 0);

  const totalPortfolioValue = traditionalTotal + rothTotal + taxableTotal;

  // 4% Rule Calculation
  const safeWithdrawalAmount = totalPortfolioValue * (withdrawalRate / 100);
  const totalGuaranteedIncome = state.userSocialSecurity + state.userPension + 
    (state.hasSpouse ? state.spouseSocialSecurity + state.spousePension : 0);
  
  const totalProjectedIncome = safeWithdrawalAmount + (totalGuaranteedIncome * 12); // monthly to annual
  const monthlyProjectedIncome = totalProjectedIncome / 12;
  
  const isIncomeSufficient = monthlyProjectedIncome >= state.monthlyRetirementExpenses;

  // Stress Test: 30% drop in Year 1
  const portfolioAfterCrash = totalPortfolioValue * 0.70;
  const safeWithdrawalAfterCrash = portfolioAfterCrash * (withdrawalRate / 100);
  const monthlyProjectedAfterCrash = (safeWithdrawalAfterCrash + (totalGuaranteedIncome * 12)) / 12;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">6. Withdrawal Strategy</h1>
        <p className="text-gray-500">How to generate a paycheck from your portfolio efficiently.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* The 4% Rule */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Safe Withdrawal Rate (SWR)</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={withdrawalRate}
                onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
              />
              <span className="text-sm font-medium text-gray-600">%</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-600">Total Portfolio Value</span>
              <span className="font-semibold text-gray-900">${totalPortfolioValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-600">Annual Portfolio Withdrawal ({withdrawalRate}%)</span>
              <span className="font-semibold text-blue-600">+ ${Math.round(safeWithdrawalAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-600">Annual Guaranteed Income (SS/Pension)</span>
              <span className="font-semibold text-green-600">+ ${Math.round(totalGuaranteedIncome * 12).toLocaleString()}</span>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800">Total Projected Monthly Income</span>
                <span className="text-2xl font-bold text-gray-900">${Math.round(monthlyProjectedIncome).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Target Goal: ${state.monthlyRetirementExpenses.toLocaleString()}/mo</span>
                <span className={`font-bold ${isIncomeSufficient ? 'text-green-600' : 'text-red-500'}`}>
                  {isIncomeSufficient ? 'Sufficient' : `Shortfall: $${Math.round(state.monthlyRetirementExpenses - monthlyProjectedIncome).toLocaleString()}/mo`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sequence of Withdrawals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tax-Efficient Sequence</h2>
          <p className="text-sm text-gray-600 mb-4">
            The standard approach to minimize lifetime taxes and allow tax-free growth to compound the longest.
          </p>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold">1</div>
              <div>
                <div className="font-semibold text-gray-800">Taxable Accounts (Brokerage)</div>
                <div className="text-xs text-gray-500">Currently: ${taxableTotal.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</div>
              <div>
                <div className="font-semibold text-gray-800">Tax-Deferred (Traditional 401k/IRA)</div>
                <div className="text-xs text-gray-500">Currently: ${traditionalTotal.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">3</div>
              <div>
                <div className="font-semibold text-gray-800">Tax-Free (Roth 401k/IRA)</div>
                <div className="text-xs text-gray-500">Currently: ${rothTotal.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stress Test */}
        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200 lg:col-span-2">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Stress Test: 30% Market Drop in Year 1</h2>
          <p className="text-sm text-red-700 mb-4">
            Sequence of Returns Risk (SORR) is the danger of a market crash right as you retire. If your portfolio drops 30% on day one, how does your income look?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
              <div className="text-sm text-gray-500">Portfolio Value (-30%)</div>
              <div className="text-xl font-bold text-gray-900">${Math.round(portfolioAfterCrash).toLocaleString()}</div>
              <div className="text-xs text-red-500 mt-1 line-through">${totalPortfolioValue.toLocaleString()}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
              <div className="text-sm text-gray-500">New Safe Withdrawal ({withdrawalRate}%)</div>
              <div className="text-xl font-bold text-gray-900">${Math.round(safeWithdrawalAfterCrash).toLocaleString()}/yr</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
              <div className="text-sm text-gray-500">New Monthly Income</div>
              <div className="text-xl font-bold text-gray-900">${Math.round(monthlyProjectedAfterCrash).toLocaleString()}/mo</div>
              <div className={`text-xs mt-1 ${monthlyProjectedAfterCrash >= state.monthlyRetirementExpenses ? 'text-green-600' : 'text-red-500'}`}>
                {monthlyProjectedAfterCrash >= state.monthlyRetirementExpenses ? 'Still hits target!' : 'Fails to hit target goal.'}
              </div>
            </div>
          </div>
          <p className="text-xs text-red-600 mt-4 italic">
            *Mitigation Strategy: Keep 1-2 years of cash/bonds to draw from during down years so you don't sell stocks at a loss.
          </p>
        </div>
      </div>
    </div>
  );
}
