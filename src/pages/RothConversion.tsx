import { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';

export function RothConversion() {
  const { state, updateState } = useFinancials();
  const [conversionTarget, setConversionTarget] = useState(25000); // Default $25k/yr conversion
  
  // 2025 Tax Bracket tops for 24% bracket
  const bracket24TopMFJ = 394600;
  const bracket24TopSingle = 197300;
  const topOf24Bracket = state.filingStatus === 'Married Filing Jointly' ? bracket24TopMFJ : bracket24TopSingle;

  const currentPreTaxBalance = state.userBalances.traditional401k + state.userBalances.traditionalIra +
    (state.hasSpouse ? state.spouseBalances.traditional401k + state.spouseBalances.traditionalIra : 0);

  const yearsToConvert = Math.max(0, state.targetRetirementAge - state.currentAge);
  
  // "Do Nothing" scenario
  const futurePreTaxNoConvert = currentPreTaxBalance * Math.pow(1.06, yearsToConvert); // Assuming 6% growth
  // Rough RMD estimation at 73 (using div of 26.5)
  const estimatedRmdNoConvert = (futurePreTaxNoConvert * Math.pow(1.06, 73 - state.targetRetirementAge)) / 26.5;

  // "Convert" scenario
  const futurePreTaxConvert = (currentPreTaxBalance - (conversionTarget * yearsToConvert)) * Math.pow(1.06, yearsToConvert);
  const estimatedRmdConvert = Math.max(0, (futurePreTaxConvert * Math.pow(1.06, 73 - state.targetRetirementAge)) / 26.5);

  const roomInBracket = Math.max(0, topOf24Bracket - state.grossAnnualIncome);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">3. Roth Conversion Ladder</h1>
        <p className="text-gray-500">Pay taxes now at a known rate to avoid massive RMD taxes later.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tax Bracket Room</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Projected Annual Income (Pre-Retirement)</label>
            <div className="flex items-center">
              <span className="text-xl text-gray-500 mr-2">$</span>
              <input
                type="number"
                value={state.grossAnnualIncome}
                onChange={(e) => updateState({ grossAnnualIncome: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Top of 24% Bracket ({state.filingStatus === 'Married Filing Jointly' ? 'MFJ' : 'Single'})</span>
              <span className="font-semibold">${topOf24Bracket.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2 text-green-700">
              <span className="text-sm font-semibold">Room to Convert (Taxed ≤24%)</span>
              <span className="font-bold">${roomInBracket.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversion Strategy</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Annual Conversion Amount</label>
            <div className="flex items-center">
              <span className="text-xl text-gray-500 mr-2">$</span>
              <input
                type="number"
                value={conversionTarget}
                onChange={(e) => setConversionTarget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-bold"
              />
            </div>
            {conversionTarget > roomInBracket && (
              <p className="text-xs text-red-500 mt-2">Warning: This pushes you into the 32% bracket.</p>
            )}
          </div>
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
            You are planning to convert <strong>${conversionTarget.toLocaleString()}</strong> each year for <strong>{yearsToConvert} years</strong> (until retirement), shifting <strong>${(conversionTarget * yearsToConvert).toLocaleString()}</strong> from Pre-Tax to Roth.
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">The Payoff: Do Nothing vs. Convert</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-red-200 rounded-xl overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-200 text-center">
              <h3 className="text-lg font-bold text-red-800">Do Nothing</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm text-gray-500">Projected Pre-Tax Balance at Retirement</div>
                <div className="text-2xl font-semibold text-gray-900">${Math.round(futurePreTaxNoConvert).toLocaleString()}</div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-red-600 font-semibold mb-1">Est. 1st RMD (Age 73)</div>
                <div className="text-3xl font-bold text-red-700">${Math.round(estimatedRmdNoConvert).toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">This entire amount is added to your taxable income, potentially bumping your tax bracket and triggering Medicare IRMAA surcharges.</p>
              </div>
            </div>
          </div>

          <div className="border border-green-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-green-50 p-4 border-b border-green-200 text-center">
              <h3 className="text-lg font-bold text-green-800">Convert ${Math.round(conversionTarget/1000)}k/yr</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm text-gray-500">Projected Pre-Tax Balance at Retirement</div>
                <div className="text-2xl font-semibold text-gray-900">${Math.round(Math.max(0, futurePreTaxConvert)).toLocaleString()}</div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-green-600 font-semibold mb-1">Est. 1st RMD (Age 73)</div>
                <div className="text-3xl font-bold text-green-700">${Math.round(estimatedRmdConvert).toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">A much smaller mandatory withdrawal gives you massive flexibility in retirement to control your taxes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
