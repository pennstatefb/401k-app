import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useFinancials } from '../context/FinancialContext';

export function CatchUp() {
  const { state } = useFinancials();
  const [current401kContribution, setCurrent401kContribution] = useState(state.annualContributions401k);
  const [currentIraContribution, setCurrentIraContribution] = useState(0);
  const [companyMatchMax, setCompanyMatchMax] = useState(5000);
  const [companyMatchCurrent, setCompanyMatchCurrent] = useState(5000);

  // 2025 Limits
  const limit401kBase = 23500;
  const catchUp401k = 7500;
  const limit401kTotal = limit401kBase + catchUp401k;

  const limitIraBase = 7000;
  const catchUpIra = 1000;
  const limitIraTotal = limitIraBase + catchUpIra;

  const percent401k = Math.min(100, Math.round((current401kContribution / limit401kTotal) * 100));
  const percentIra = Math.min(100, Math.round((currentIraContribution / limitIraTotal) * 100));
  
  const matchLeft = Math.max(0, companyMatchMax - companyMatchCurrent);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">7. Catch-Up Tracker</h1>
        <p className="text-gray-500">Maximize your final years with over-50 catch-up contributions.</p>
      </header>

      {/* Alerts */}
      {matchLeft > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold">You are leaving free money on the table!</h3>
            <p className="text-red-700 text-sm mt-1">You have ${matchLeft.toLocaleString()} in unclaimed employer match. Increase your contributions immediately to capture this.</p>
          </div>
        </div>
      )}
      
      {current401kContribution === limit401kTotal && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-green-800 font-semibold">Maximum 401(k) funding achieved</h3>
            <p className="text-green-700 text-sm mt-1">Great job! Make sure your contributions are spread evenly so you don't miss out on employer matches late in the year.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 401k Tracker */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">401(k) / 403(b) Contributions</h2>
            <div className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">Limit: ${limit401kTotal.toLocaleString()}</div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Contribution This Year</label>
            <div className="flex items-center">
              <span className="text-xl text-gray-500 mr-2">$</span>
              <input
                type="number"
                value={current401kContribution}
                onChange={(e) => setCurrent401kContribution(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-semibold text-gray-900">{percent401k}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden flex">
              {/* Base */}
              <div 
                className="bg-blue-500 h-4" 
                style={{ width: `${Math.min(100, (Math.min(current401kContribution, limit401kBase) / limit401kTotal) * 100)}%` }}
              ></div>
              {/* Catchup */}
              {current401kContribution > limit401kBase && (
                <div 
                  className="bg-green-500 h-4" 
                  style={{ width: `${Math.min(100, ((current401kContribution - limit401kBase) / limit401kTotal) * 100)}%` }}
                ></div>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>$0</span>
              <span>Base: ${(limit401kBase/1000).toFixed(1)}k</span>
              <span>Max: ${(limit401kTotal/1000).toFixed(1)}k</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <strong>Timing Alert:</strong> If you hit the limit too early in the year, your employer might stop matching. Check if your plan has a "true-up" provision.
          </p>
        </div>

        {/* IRA Tracker */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">IRA Contributions</h2>
            <div className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">Limit: ${limitIraTotal.toLocaleString()}</div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Contribution This Year</label>
            <div className="flex items-center">
              <span className="text-xl text-gray-500 mr-2">$</span>
              <input
                type="number"
                value={currentIraContribution}
                onChange={(e) => setCurrentIraContribution(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-semibold text-gray-900">{percentIra}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden flex">
               {/* Base */}
               <div 
                className="bg-blue-500 h-4" 
                style={{ width: `${Math.min(100, (Math.min(currentIraContribution, limitIraBase) / limitIraTotal) * 100)}%` }}
              ></div>
              {/* Catchup */}
              {currentIraContribution > limitIraBase && (
                <div 
                  className="bg-green-500 h-4" 
                  style={{ width: `${Math.min(100, ((currentIraContribution - limitIraBase) / limitIraTotal) * 100)}%` }}
                ></div>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>$0</span>
              <span>Base: ${limitIraBase/1000}k</span>
              <span>Max: ${limitIraTotal/1000}k</span>
            </div>
          </div>
        </div>

        {/* Company Match Tracker */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Employer Match Check</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Possible Employer Match</label>
              <input
                type="number"
                value={companyMatchMax}
                onChange={(e) => setCompanyMatchMax(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match Received So Far</label>
              <input
                type="number"
                value={companyMatchCurrent}
                onChange={(e) => setCompanyMatchCurrent(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
