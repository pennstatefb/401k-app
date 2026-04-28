import { useState } from 'react';
import { useFinancials } from '../context/FinancialContext';
import { NumberInput } from '../components/NumberInput';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function SocialSecurity() {
  const { state, updateState } = useFinancials();
  const [pia, setPia] = useState(state.userSocialSecurity || 2800); // Primary Insurance Amount at FRA (67)

  // Benefit rules
  // 62: 70% of PIA
  // 67: 100% of PIA
  // 70: 124% of PIA
  const benefit62 = pia * 0.70;
  const benefit67 = pia * 1.00;
  const benefit70 = pia * 1.24;

  const data = [];
  for (let age = 62; age <= 95; age++) {
    const culm62 = age >= 62 ? (age - 62 + 1) * 12 * benefit62 : 0;
    const culm67 = age >= 67 ? (age - 67 + 1) * 12 * benefit67 : 0;
    const culm70 = age >= 70 ? (age - 70 + 1) * 12 * benefit70 : 0;

    data.push({
      age,
      claim62: culm62,
      claim67: culm67,
      claim70: culm70,
    });
  }

  // Find approximate breakeven points
  // 62 vs 67: 
  // (67-62)*12*b62 = X*12*(b67-b62) => 60*b62 = X*12*(b67-b62) => X = 5*b62/(b67-b62) years after 67.
  const be62vs67 = 67 + Math.ceil((5 * benefit62) / (benefit67 - benefit62));
  
  // 67 vs 70:
  const be67vs70 = 70 + Math.ceil((3 * benefit67) / (benefit70 - benefit67));

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">5. Social Security Optimizer</h1>
        <p className="text-gray-500">Compare claiming strategies to maximize your lifetime benefit.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Estimated Benefit at FRA (Age 67)</h2>
          <p className="text-sm text-gray-500">Find this on your SSA.gov statement</p>
        </div>
        <div className="flex items-center">
          <span className="text-xl text-gray-500 mr-2">$</span>
          <NumberInput
            value={pia}
            onChange={(v) => {
              setPia(v);
              updateState({ userSocialSecurity: v });
            }}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-semibold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Claim at 62 (Early)</div>
          <div className="text-2xl font-bold text-gray-900">${Math.round(benefit62).toLocaleString()}/mo</div>
          <div className="text-xs text-red-500 mt-1">30% reduction</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-500 bg-blue-50 text-center">
          <div className="text-sm font-medium text-blue-700 mb-1">Claim at 67 (FRA)</div>
          <div className="text-2xl font-bold text-blue-900">${Math.round(benefit67).toLocaleString()}/mo</div>
          <div className="text-xs text-blue-600 mt-1">100% benefit</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">Claim at 70 (Delayed)</div>
          <div className="text-2xl font-bold text-gray-900">${Math.round(benefit70).toLocaleString()}/mo</div>
          <div className="text-xs text-green-600 mt-1">24% increase</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Cumulative Lifetime Benefit</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="age" />
                <YAxis tickFormatter={(val) => val >= 1_000_000 ? `$${(val/1_000_000).toFixed(1)}M` : `$${(val/1000).toFixed(0)}k`} width={55} />
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="claim62" name="Claim at 62" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="claim67" name="Claim at 67" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="claim70" name="Claim at 70" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Breakeven Analysis</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">62 vs 67 Breakeven</div>
                <div className="text-xl font-bold text-gray-900">Age {be62vs67}</div>
                <div className="text-xs text-gray-500 mt-1">If you live past {be62vs67}, waiting to 67 pays off.</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">67 vs 70 Breakeven</div>
                <div className="text-xl font-bold text-gray-900">Age {be67vs70}</div>
                <div className="text-xs text-gray-500 mt-1">If you live past {be67vs70}, waiting to 70 pays off.</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-200">
            <h2 className="text-sm font-bold text-yellow-800 mb-2">Spousal Coordination Strategy</h2>
            <p className="text-sm text-yellow-900">
              Generally, the higher earner should delay until 70 to maximize the survivor benefit. The lower earner might claim earlier (e.g., at 62 or their own FRA) to bring income into the household sooner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
