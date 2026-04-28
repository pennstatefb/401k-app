import { useFinancials } from '../context/FinancialContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function Dashboard() {
  const { state, derived } = useFinancials();
  const { totalPortfolio, totalTraditional, totalRoth, totalTaxable, projectedPortfolioAtRetirement, savingsGap } = derived;

  // 1. Portfolio Split
  const portfolioData = [
    { name: 'Traditional (Pre-Tax)', value: totalTraditional },
    { name: 'Roth (Tax-Free)', value: totalRoth },
    { name: 'Taxable (Brokerage)', value: totalTaxable },
  ].filter(d => d.value > 0);

  // 2. Projected Balance using user's expected return setting
  const projectedData = [
    { name: 'Today', balance: totalPortfolio },
    { name: 'At Retirement', balance: Math.round(projectedPortfolioAtRetirement) },
  ];

  // 3. Action Items Logic
  const actionItems = [];
  if (savingsGap > 0) {
    actionItems.push("You have a savings gap. Maximize your catch-up contributions this year.");
  }
  if (totalTraditional > totalRoth * 3) {
    actionItems.push("Your portfolio is heavily pre-tax. Explore the Roth Conversion Ladder to minimize future RMD taxes.");
  }
  if (state.targetRetirementAge < 65) {
    actionItems.push("Review healthcare gap strategies if you plan to retire before Medicare eligibility at 65.");
  }
  if (actionItems.length === 0) {
    actionItems.push("Stay the course! Review your asset allocation to ensure it aligns with your timeline.");
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Your 7-Year Runway</h1>
        <p className="text-gray-500 mt-2">At-a-glance summary of your retirement trajectory.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Split Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tax Buckets (Portfolio Split)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projected Growth */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Projected Balance at Retirement</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="balance" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">*Assumes {(state.expectedReturn * 100).toFixed(0)}% annual return — adjust in Snapshot</p>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 bg-blue-50/30">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          Biggest Moves You Can Make Right Now
        </h2>
        <ul className="space-y-3">
          {actionItems.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100">
              <div className="mt-0.5 bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {idx + 1}
              </div>
              <p className="text-gray-700">{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/roth-conversion" className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors flex justify-between items-center">
          <div>
            <div className="font-semibold text-gray-800">Roth Conversion Ladder</div>
            <div className="text-xs text-gray-500 mt-1">Plan your tax-efficient moves</div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
        </Link>
        <Link to="/social-security" className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors flex justify-between items-center">
          <div>
            <div className="font-semibold text-gray-800">Social Security Optimizer</div>
            <div className="text-xs text-gray-500 mt-1">Find your breakeven age</div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
        </Link>
        <Link to="/withdrawal" className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors flex justify-between items-center">
          <div>
            <div className="font-semibold text-gray-800">Withdrawal Strategy</div>
            <div className="text-xs text-gray-500 mt-1">Map out your income plan</div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
        </Link>
      </div>
    </div>
  );
}
