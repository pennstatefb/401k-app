import { useFinancials } from '../context/FinancialContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, TrendingUp, Lightbulb } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function fmt(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

export function Dashboard() {
  const { state, derived } = useFinancials();
  const { totalPortfolio, totalTraditional, totalRoth, totalTaxable, projectedPortfolioAtRetirement, savingsGap } = derived;

  const portfolioData = [
    { name: 'Pre-Tax', value: totalTraditional },
    { name: 'Roth', value: totalRoth },
    { name: 'Taxable', value: totalTaxable },
  ].filter(d => d.value > 0);

  const actionItems: string[] = [];
  if (savingsGap > 0) actionItems.push("Savings gap detected — maximize catch-up contributions.");
  if (totalTraditional > totalRoth * 3) actionItems.push("Portfolio is heavily pre-tax. Consider Roth conversions to reduce future RMDs.");
  if (state.targetRetirementAge < 65) actionItems.push("Retiring before 65 — review healthcare gap before Medicare kicks in.");
  if (actionItems.length === 0) actionItems.push("On track! Review your asset allocation to stay aligned with your timeline.");

  return (
    <div className="space-y-3">

      {/* Projected Balance */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-1.5 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">Projected Balance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-400 mb-0.5">Today</div>
            <div className="text-xl font-bold text-gray-800">{fmt(totalPortfolio)}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="flex-1 bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100">
            <div className="text-xs text-indigo-400 mb-0.5">At Retirement</div>
            <div className="text-xl font-bold text-indigo-700">{fmt(projectedPortfolioAtRetirement)}</div>
          </div>
        </div>
        {projectedPortfolioAtRetirement > totalPortfolio && (
          <div className="mt-2 text-center text-xs text-green-600 font-medium">
            +{fmt(projectedPortfolioAtRetirement - totalPortfolio)} projected growth · {(state.expectedReturn * 100).toFixed(0)}% return
          </div>
        )}
      </div>

      {/* Portfolio Split */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="text-sm font-semibold text-gray-700 mb-2">Tax Buckets</div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={portfolioData} cx="50%" cy="45%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                {portfolioData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Top Moves Right Now</span>
        </div>
        <ul className="space-y-2">
          {actionItems.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-100">
              <div className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-gray-700 leading-snug">{item}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
