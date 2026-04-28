import { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';

export function Medicare() {
  const { state } = useFinancials();
  const [acaPremium, setAcaPremium] = useState(800); // Estimated monthly ACA premium per person

  const yearsToMedicare = Math.max(0, 65 - state.currentAge);
  const retiringBefore65 = state.targetRetirementAge < 65;
  const gapYears = Math.max(0, 65 - state.targetRetirementAge);
  
  const totalGapMonths = gapYears * 12;
  const monthlyGapCost = acaPremium * (state.hasSpouse ? 2 : 1);
  const totalGapCost = totalGapMonths * monthlyGapCost;

  // 2025 IRMAA Brackets (Single / Married Filing Jointly)
  // Income based on MAGI from 2 years prior
  const getIrmaaSurcharge = (income: number, married: boolean) => {
    if (married) {
      if (income <= 212000) return 0;
      if (income <= 266000) return 69.90;
      if (income <= 334000) return 174.70;
      if (income <= 400000) return 279.50;
      if (income <= 750000) return 384.30;
      return 419.30;
    } else {
      if (income <= 106000) return 0;
      if (income <= 133000) return 69.90;
      if (income <= 167000) return 174.70;
      if (income <= 200000) return 279.50;
      if (income <= 500000) return 384.30;
      return 419.30;
    }
  };

  const irmaaSurcharge = getIrmaaSurcharge(state.grossAnnualIncome, state.filingStatus === 'Married Filing Jointly');
  const basePartB = 185.00; // 2025 standard premium

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">8. Medicare & Healthcare Bridge</h1>
        <p className="text-gray-500">Plan for healthcare costs before and during Medicare.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Years until Medicare (Age 65)</div>
          <div className="text-3xl font-bold text-blue-600">{yearsToMedicare}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Retiring Before 65?</div>
          <div className={`text-2xl font-bold ${retiringBefore65 ? 'text-red-500' : 'text-green-500'}`}>
            {retiringBefore65 ? 'Yes' : 'No'}
          </div>
          <div className="text-xs text-gray-400 mt-1">{gapYears} gap years to fund</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Est. Gap Cost</div>
          <div className="text-3xl font-bold text-gray-900">${totalGapCost.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Healthcare Gap */}
        {retiringBefore65 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 bg-red-50/20">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Healthcare Bridge (Pre-65)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Since you plan to retire at {state.targetRetirementAge}, you will have {gapYears} years before Medicare kicks in. 
              You will need to buy insurance on the ACA Marketplace or use COBRA.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Monthly Premium (Per Person)</label>
              <div className="flex items-center">
                <span className="text-xl text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  value={acaPremium}
                  onChange={(e) => setAcaPremium(Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">People Covered</span>
                <span className="font-semibold">{state.hasSpouse ? 2 : 1}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Monthly Household Premium</span>
                <span className="font-semibold">${monthlyGapCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2 mt-2">
                <span className="text-gray-800">Total Capital Needed for Gap</span>
                <span className="text-red-600">${totalGapCost.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              *Tip: If you keep your taxable income low during these gap years, you may qualify for significant ACA subsidies.
            </p>
          </div>
        )}

        {/* IRMAA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Medicare IRMAA Surcharge Calculator</h2>
          <p className="text-sm text-gray-600 mb-4">
            If your income is too high, you pay a surcharge on Medicare Part B and D premiums. 
            <strong> Note: This is based on your income from two years prior.</strong>
          </p>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Current Projected Pre-Retirement Income</div>
            <div className="text-2xl font-bold text-gray-900">${state.grossAnnualIncome.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Filing status: {state.filingStatus}</div>
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-600">Standard Part B Premium</td>
                <td className="py-2 text-right font-medium">${basePartB.toFixed(2)}/mo</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-600">Your IRMAA Surcharge</td>
                <td className="py-2 text-right font-bold text-red-500">
                  {irmaaSurcharge > 0 ? `+$${irmaaSurcharge.toFixed(2)}/mo` : '$0.00/mo'}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-800 font-semibold">Total Est. Part B Premium</td>
                <td className="py-2 text-right font-bold text-gray-900">${(basePartB + irmaaSurcharge).toFixed(2)}/mo</td>
              </tr>
            </tbody>
          </table>

          {irmaaSurcharge > 0 && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-100">
              Your high income just before retirement will trigger an IRMAA surcharge for your first couple years of Medicare.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
