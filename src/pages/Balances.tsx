import { useFinancials } from '../context/FinancialContext';
import type { AccountBalances } from '../context/FinancialContext';

export function Balances() {
  const { state, updateUserBalances, updateSpouseBalances, updateState } = useFinancials();

  const handleUserBalanceChange = (field: keyof AccountBalances, value: string) => {
    updateUserBalances({ [field]: Number(value) });
  };

  const handleSpouseBalanceChange = (field: keyof AccountBalances, value: string) => {
    updateSpouseBalances({ [field]: Number(value) });
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">2. Account Balances</h1>
          <p className="text-gray-500">Your current portfolio snapshot (Fidelity, Vanguard, etc.)</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="hasSpouse" 
            checked={state.hasSpouse}
            onChange={(e) => updateState({ hasSpouse: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasSpouse" className="text-sm font-medium text-gray-700">Include Spouse/Partner</label>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm">
              <th className="py-3 px-6 font-semibold text-gray-700 w-1/3">Account Type</th>
              <th className="py-3 px-6 font-semibold text-gray-700 text-right w-1/3">You</th>
              {state.hasSpouse && (
                <th className="py-3 px-6 font-semibold text-gray-700 text-right w-1/3">Spouse/Partner</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {/* 401k */}
            <tr>
              <td className="py-3 px-6 font-medium text-gray-800">Traditional 401(k) / 403(b)</td>
              <td className="py-2 px-4 text-right">
                <input
                  type="number"
                  value={state.userBalances.traditional401k}
                  onChange={(e) => handleUserBalanceChange('traditional401k', e.target.value)}
                  className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {state.hasSpouse && (
                <td className="py-2 px-4 text-right">
                  <input
                    type="number"
                    value={state.spouseBalances.traditional401k}
                    onChange={(e) => handleSpouseBalanceChange('traditional401k', e.target.value)}
                    className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
            </tr>
            {/* Roth 401k */}
            <tr>
              <td className="py-3 px-6 font-medium text-gray-800">Roth 401(k)</td>
              <td className="py-2 px-4 text-right">
                <input
                  type="number"
                  value={state.userBalances.roth401k}
                  onChange={(e) => handleUserBalanceChange('roth401k', e.target.value)}
                  className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {state.hasSpouse && (
                <td className="py-2 px-4 text-right">
                  <input
                    type="number"
                    value={state.spouseBalances.roth401k}
                    onChange={(e) => handleSpouseBalanceChange('roth401k', e.target.value)}
                    className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
            </tr>
            {/* Traditional IRA */}
            <tr>
              <td className="py-3 px-6 font-medium text-gray-800">Traditional IRA</td>
              <td className="py-2 px-4 text-right">
                <input
                  type="number"
                  value={state.userBalances.traditionalIra}
                  onChange={(e) => handleUserBalanceChange('traditionalIra', e.target.value)}
                  className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {state.hasSpouse && (
                <td className="py-2 px-4 text-right">
                  <input
                    type="number"
                    value={state.spouseBalances.traditionalIra}
                    onChange={(e) => handleSpouseBalanceChange('traditionalIra', e.target.value)}
                    className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
            </tr>
            {/* Roth IRA */}
            <tr>
              <td className="py-3 px-6 font-medium text-gray-800">Roth IRA</td>
              <td className="py-2 px-4 text-right">
                <input
                  type="number"
                  value={state.userBalances.rothIra}
                  onChange={(e) => handleUserBalanceChange('rothIra', e.target.value)}
                  className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {state.hasSpouse && (
                <td className="py-2 px-4 text-right">
                  <input
                    type="number"
                    value={state.spouseBalances.rothIra}
                    onChange={(e) => handleSpouseBalanceChange('rothIra', e.target.value)}
                    className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
            </tr>
            {/* Brokerage */}
            <tr>
              <td className="py-3 px-6 font-medium text-gray-800">Brokerage / Taxable</td>
              <td className="py-2 px-4 text-right">
                <input
                  type="number"
                  value={state.userBalances.brokerage}
                  onChange={(e) => handleUserBalanceChange('brokerage', e.target.value)}
                  className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {state.hasSpouse && (
                <td className="py-2 px-4 text-right">
                  <input
                    type="number"
                    value={state.spouseBalances.brokerage}
                    onChange={(e) => handleSpouseBalanceChange('brokerage', e.target.value)}
                    className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
            </tr>
            {/* HSA */}
            <tr>
              <td className="py-3 px-6 font-medium text-gray-800">HSA (Health Savings Account)</td>
              <td className="py-2 px-4 text-right">
                <input
                  type="number"
                  value={state.userBalances.hsa}
                  onChange={(e) => handleUserBalanceChange('hsa', e.target.value)}
                  className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {state.hasSpouse && (
                <td className="py-2 px-4 text-right">
                  <input
                    type="number"
                    value={state.spouseBalances.hsa}
                    onChange={(e) => handleSpouseBalanceChange('hsa', e.target.value)}
                    className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
            </tr>

            {/* Separation for Fixed Income */}
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td colSpan={state.hasSpouse ? 3 : 2} className="py-2 px-6 font-semibold text-gray-600 uppercase text-xs">
                Monthly Guaranteed Income (Est. at Retirement)
              </td>
            </tr>
            
            {/* Social Security */}
            <tr>
              <td className="py-3 px-6 font-medium text-gray-800">Social Security (Monthly)</td>
              <td className="py-2 px-4 text-right">
                <input
                  type="number"
                  value={state.userSocialSecurity}
                  onChange={(e) => updateState({ userSocialSecurity: Number(e.target.value) })}
                  className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {state.hasSpouse && (
                <td className="py-2 px-4 text-right">
                  <input
                    type="number"
                    value={state.spouseSocialSecurity}
                    onChange={(e) => updateState({ spouseSocialSecurity: Number(e.target.value) })}
                    className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
            </tr>
            {/* Pension */}
            <tr>
              <td className="py-3 px-6 font-medium text-gray-800">Pension (Monthly)</td>
              <td className="py-2 px-4 text-right">
                <input
                  type="number"
                  value={state.userPension}
                  onChange={(e) => updateState({ userPension: Number(e.target.value) })}
                  className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              {state.hasSpouse && (
                <td className="py-2 px-4 text-right">
                  <input
                    type="number"
                    value={state.spousePension}
                    onChange={(e) => updateState({ spousePension: Number(e.target.value) })}
                    className="w-full text-right px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
