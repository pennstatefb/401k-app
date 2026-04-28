import { Link } from 'react-router-dom';
import { PiggyBank, Stethoscope, ArrowRight } from 'lucide-react';

const tools = [
  {
    path: '/planning/catch-up',
    label: 'Catch-Up Tracker',
    description: 'Maximize catch-up contributions available after age 50',
    icon: PiggyBank,
    color: 'bg-pink-50 text-pink-600',
  },
  {
    path: '/planning/medicare',
    label: 'Medicare & Health',
    description: 'Plan for healthcare costs and coverage before age 65',
    icon: Stethoscope,
    color: 'bg-teal-50 text-teal-600',
  },
];

export function Planning() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-gray-500 text-sm">Contributions and healthcare planning</p>
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
