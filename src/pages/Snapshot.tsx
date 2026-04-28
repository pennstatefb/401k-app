import { useFinancials } from '../context/FinancialContext';
import { NumberInput } from '../components/NumberInput';

export function Snapshot() {
  const { state, derived, updateState } = useFinancials();
  const { totalPortfolio, yearsToRetirement, monthsToRetirement, projectedMonthlyRetirementIncome, savingsGap } = derived;

  let onTrackStatus = 'Green';
  if (state.monthlyRetirementExpenses === 0) {
    onTrackStatus = 'Pending';
  } else if (projectedMonthlyRetirementIncome < state.monthlyRetirementExpenses * 0.70) {
    onTrackStatus = 'Red';
  } else if (projectedMonthlyRetirementIncome < state.monthlyRetirementExpenses * 0.90) {
    onTrackStatus = 'Yellow';
  }

  const bannerColor = {
    Green:   'bg-green-50 border-green-200 text-green-800',
    Yellow:  'bg-yellow-50 border-yellow-200 text-yellow-800',
    Red:     'bg-red-50 border-red-200 text-red-800',
    Pending: 'bg-gray-50 border-gray-200 text-gray-500',
  }[onTrackStatus];

  const dot = {
    Green: '🟢', Yellow: '🟡', Red: '🔴', Pending: '⚪',
  }[onTrackStatus];

  const inputCls = 'w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-right';
  const labelCls = 'block text-xs text-gray-500 mb-0.5';

  return (
    <div className="space-y-2.5">

      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your Info</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Your Age</label>
            <NumberInput value={state.currentAge}
              onChange={(v) => updateState({ currentAge: v })}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Retire At</label>
            <NumberInput value={state.targetRetirementAge}
              onChange={(v) => updateState({ targetRetirementAge: v })}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Monthly Take-Home</label>
            <NumberInput value={state.monthlyTakeHomePay}
              onChange={(v) => updateState({ monthlyTakeHomePay: v })}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Retirement Expenses</label>
            <NumberInput value={state.monthlyRetirementExpenses}
              onChange={(v) => updateState({ monthlyRetirementExpenses: v })}
              className={inputCls} />
          </div>
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
          <input type="checkbox" checked={state.hasSpouse}
            onChange={(e) => updateState({ hasSpouse: e.target.checked })}
            className="w-3.5 h-3.5 text-blue-600 rounded" />
          <span className="text-xs text-gray-600">Include Spouse</span>
        </label>
        {state.hasSpouse && (
          <div className="mt-2 w-1/2 pr-1">
            <label className={labelCls}>Spouse Age</label>
            <NumberInput value={state.spouseAge}
              onChange={(v) => updateState({ spouseAge: v })}
              className={inputCls} />
          </div>
        )}
      </div>

      {/* On-Track banner */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm font-semibold ${bannerColor}`}>
        <span>Am I on Track?</span>
        <span>{dot} {onTrackStatus === 'Pending' ? 'Enter expenses' : onTrackStatus}</span>
      </div>

      {/* Stats 2x2 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400">Portfolio</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">${totalPortfolio.toLocaleString()}</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400">Monthly at Retirement</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">
            ${Math.round(projectedMonthlyRetirementIncome).toLocaleString()}<span className="text-xs font-normal text-gray-400">/mo</span>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400">Countdown</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">
            {yearsToRetirement} <span className="text-xs font-normal text-gray-400">yrs ({monthsToRetirement} mo)</span>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400">Savings Gap</div>
          <div className={`text-lg font-bold mt-0.5 ${savingsGap === 0 ? 'text-green-600' : 'text-red-600'}`}>
            {savingsGap === 0 ? '✓ None' : `$${Math.round(savingsGap).toLocaleString()}`}
          </div>
        </div>
      </div>

    </div>
  );
}
