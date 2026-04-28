import { useFinancials } from '../context/FinancialContext';

export function Snapshot() {
  const { state, derived, updateState } = useFinancials();

  const { totalPortfolio, yearsToRetirement, monthsToRetirement, projectedMonthlyRetirementIncome, savingsGap } = derived;

  // On-track: compare projected income to target monthly expenses
  let onTrackStatus = 'Green';
  if (state.monthlyRetirementExpenses === 0) {
    onTrackStatus = 'Pending';
  } else if (projectedMonthlyRetirementIncome < state.monthlyRetirementExpenses * 0.70) {
    onTrackStatus = 'Red';
  } else if (projectedMonthlyRetirementIncome < state.monthlyRetirementExpenses * 0.90) {
    onTrackStatus = 'Yellow';
  }

  const onTrackColor = {
    'Green': 'bg-green-100 text-green-800 border-green-200',
    'Yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Red': 'bg-red-100 text-red-800 border-red-200',
    'Pending': 'bg-gray-100 text-gray-600 border-gray-200',
  }[onTrackStatus];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">1. Your Snapshot</h1>
        <p className="text-gray-500">The first thing you see: your high-level overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core Inputs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Core Timeline & Income</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Age</label>
              <input
                type="number"
                value={state.currentAge}
                onChange={(e) => updateState({ currentAge: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Retirement Age</label>
              <input
                type="number"
                value={state.targetRetirementAge}
                onChange={(e) => updateState({ targetRetirementAge: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Spouse toggle + age */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={state.hasSpouse}
                  onChange={(e) => updateState({ hasSpouse: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Include Spouse / Partner</span>
              </label>
            </div>
            {state.hasSpouse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Age</label>
                <input
                  type="number"
                  value={state.spouseAge}
                  onChange={(e) => updateState({ spouseAge: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className={state.hasSpouse ? '' : 'sm:col-span-1'}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Take-Home Pay (Today)</label>
              <input
                type="number"
                value={state.monthlyTakeHomePay}
                onChange={(e) => updateState({ monthlyTakeHomePay: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Monthly Expenses in Retirement</label>
              <input
                type="number"
                value={state.monthlyRetirementExpenses}
                onChange={(e) => updateState({ monthlyRetirementExpenses: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Am I on Track */}
        <div className={`p-6 rounded-xl shadow-sm border flex flex-col justify-center items-center text-center ${onTrackColor}`}>
          <h2 className="text-lg font-semibold mb-2">Am I on Track?</h2>
          <div className="text-4xl font-black mb-2">{onTrackStatus === 'Pending' ? '—' : onTrackStatus}</div>
          <p className="text-sm opacity-80">
            {onTrackStatus === 'Green' ? "You're looking good!" : onTrackStatus === 'Yellow' ? "You're close, but need some tweaks." : onTrackStatus === 'Red' ? "Let's work on closing the gap." : "Enter your retirement expenses above."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Total Portfolio Value */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Portfolio Value</div>
          <div className="text-3xl font-bold text-gray-900">
            ${totalPortfolio.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-2">Combined 401k, IRA, and Brokerage</div>
        </div>

        {/* Projected Income */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Projected Monthly Income (4% Rule)</div>
          <div className="text-3xl font-bold text-gray-900">
            ${Math.round(projectedMonthlyRetirementIncome).toLocaleString()}<span className="text-lg font-normal text-gray-500">/mo</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">At retirement — based on {(state.expectedReturn * 100).toFixed(0)}% annual return</div>
        </div>

        {/* Countdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Countdown to Retirement</div>
          <div className="text-3xl font-bold text-gray-900">
            {yearsToRetirement} <span className="text-lg font-normal text-gray-500">yrs</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">({monthsToRetirement} total months)</div>
        </div>

        {/* Savings Gap */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Estimated Savings Gap</div>
          <div className={`text-3xl font-bold ${savingsGap === 0 ? 'text-green-600' : 'text-red-600'}`}>
            {savingsGap === 0 ? '✓ None' : `$${Math.round(savingsGap).toLocaleString()}`}
          </div>
          <div className="text-xs text-gray-400 mt-2">Additional capital needed to hit 25× expenses (4% rule)</div>
        </div>
      </div>
    </div>
  );
}
