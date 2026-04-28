import { Link } from 'react-router-dom';
import { TrendingUp, Calculator, HeartHandshake, Banknote, ArrowRight } from 'lucide-react';

const tools = [
  {
    path: '/strategies/roth-conversion',
    label: 'Roth Conversion Ladder',
    description: 'Plan tax-efficient Roth conversions before RMDs kick in',
    icon: TrendingUp,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    path: '/strategies/rmd-projector',
    label: 'RMD Projector',
    description: 'See your required minimum distributions year by year',
    icon: Calculator,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    path: '/strategies/social-security',
    label: 'Social Security Optimizer',
    description: 'Find the best age to claim and your breakeven point',
    icon: HeartHandshake,
    color: 'bg-green-50 text-green-600',
  },
  {
    path: '/strategies/withdrawal',
    label: 'Withdrawal Strategy',
    description: 'Map out which accounts to draw from and when',
    icon: Banknote,
    color: 'bg-orange-50 text-orange-600',
  },
];

export function Strategies() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-gray-500 text-sm">Tax and income strategies for retirement</p>
      </div>
      <ul className="space-y-3">
        {tools.map((tool) => (
          <li key={tool.path}>
            <Link
              to={tool.path}
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:bg-gray-50"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tool.color}`}>
                <tool.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm">{tool.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-snug">{tool.description}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
