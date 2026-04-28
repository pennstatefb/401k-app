import { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';

// IRS Uniform Lifetime Table (simplified snippet starting at age 73)
const RMD_DIVISORS: Record<number, number> = {
  73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2,
  87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
};

export function RMDProjector() {
  const { state } = useFinancials();
  const [growthRate, setGrowthRate] = useState(6); // Default 6%
  
  // Calculate traditional pre-tax balance (subject to RMD)
  const currentPreTaxBalance = state.userBalances.traditional401k + state.userBalances.traditionalIra +
    (state.hasSpouse ? state.spouseBalances.traditional401k + state.spouseBalances.traditionalIra : 0);

  // Generate projection table
  const generateProjection = () => {
    let currentBalance = currentPreTaxBalance;
    const startAge = state.currentAge;
    const data = [];

    for (let age = startAge; age <= 90; age++) {
      let rmd = 0;
      
      // Calculate RMD if age is >= 73
      if (age >= 73) {
        const divisor = RMD_DIVISORS[age] || 10.0; // fallback if over 92
        rmd = currentBalance / divisor;
      }
      
      // End of year balance (grow the balance, then subtract RMD)
      // Note: RMDs are typically calculated on prior year-end balance.
      const startOfYearBalance = currentBalance;
      const growth = startOfYearBalance * (growthRate / 100);
      currentBalance = startOfYearBalance + growth - rmd;

      data.push({
        age,
        startBalance: startOfYearBalance,
        growth,
        rmd,
        endBalance: currentBalance > 0 ? currentBalance : 0
      });
    }

    return data;
  };

  const projections = generateProjection();
  // Filter to show from Retirement Age onwards to save space
  const visibleProjections = projections.filter(p => p.age >= state.targetRetirementAge);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">4. RMD Projector</h1>
        <p className="text-gray-500">Projected Required Minimum Distributions and their impact on your Pre-Tax balances.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Current Pre-Tax Subject to RMDs</h2>
          <div className="text-3xl font-bold text-gray-900 mt-1">${currentPreTaxBalance.toLocaleString()}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assumed Annual Growth (%)</label>
          <input
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm">
              <th className="py-3 px-6 font-semibold text-gray-700 text-center w-16">Age</th>
              <th className="py-3 px-6 font-semibold text-gray-700">Start Balance</th>
              <th className="py-3 px-6 font-semibold text-gray-700 text-green-600">Growth (+{growthRate}%)</th>
              <th className="py-3 px-6 font-semibold text-gray-700 text-red-600">RMD (Withdrawal)</th>
              <th className="py-3 px-6 font-semibold text-gray-700">End Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {visibleProjections.map((row) => (
              <tr key={row.age} className={row.age >= 73 ? 'bg-blue-50/30' : ''}>
                <td className="py-3 px-6 font-medium text-gray-800 text-center border-r border-gray-100">
                  {row.age}
                  {row.age === 73 && <span className="block text-[10px] text-blue-600 font-bold">RMD START</span>}
                </td>
                <td className="py-3 px-6 text-gray-600">${Math.round(row.startBalance).toLocaleString()}</td>
                <td className="py-3 px-6 text-green-600">${Math.round(row.growth).toLocaleString()}</td>
                <td className="py-3 px-6 font-bold text-red-600">
                  {row.rmd > 0 ? `$${Math.round(row.rmd).toLocaleString()}` : '-'}
                </td>
                <td className="py-3 px-6 font-semibold text-gray-800">${Math.round(row.endBalance).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">*Note: This is a simplified projection using the SECURE 2.0 Act starting age of 73 and approximate Uniform Lifetime Table divisors.</p>
    </div>
  );
}
