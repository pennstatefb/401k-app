import { useFinancials } from '../context/FinancialContext';
import type { AccountBalances } from '../context/FinancialContext';
import { NumberInput } from '../components/NumberInput';

const accountFields: { key: keyof AccountBalances; label: string }[] = [
  { key: 'traditional401k', label: 'Traditional 401(k) / 403(b)' },
  { key: 'roth401k',        label: 'Roth 401(k)' },
  { key: 'traditionalIra',  label: 'Traditional IRA' },
  { key: 'rothIra',         label: 'Roth IRA' },
  { key: 'brokerage',       label: 'Brokerage / Taxable' },
  { key: 'hsa',             label: 'HSA' },
];

const inputCls = 'w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-white';

export function Balances() {
  const { state, updateUserBalances, updateSpouseBalances, updateState } = useFinancials();

  return (
    <div className="space-y-2.5">

      {/* Spouse toggle */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
        <span className="text-sm font-medium text-gray-700">Include Spouse / Partner</span>
        <input type="checkbox" checked={state.hasSpouse}
          onChange={(e) => updateState({ hasSpouse: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded" />
      </div>

      {/* Account balances */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-2">
            <div className="flex-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Account</div>
            <div className="w-24 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">You</div>
            {state.hasSpouse && <div className="w-24 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Spouse</div>}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {accountFields.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 px-4 py-2.5">
              <div className="flex-1 text-sm text-gray-700 leading-tight">{label}</div>
              <div className="w-24">
                <NumberInput value={state.userBalances[key]}
                  onChange={(v) => updateUserBalances({ [key]: v })}
                  className={inputCls} />
              </div>
              {state.hasSpouse && (
                <div className="w-24">
                  <NumberInput value={state.spouseBalances[key]}
                    onChange={(v) => updateSpouseBalances({ [key]: v })}
                    className={inputCls} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guaranteed income */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Monthly Guaranteed Income</div>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { label: 'Social Security', userVal: state.userSocialSecurity, spouseVal: state.spouseSocialSecurity, userKey: 'userSocialSecurity', spouseKey: 'spouseSocialSecurity' },
            { label: 'Pension', userVal: state.userPension, spouseVal: state.spousePension, userKey: 'userPension', spouseKey: 'spousePension' },
          ].map(({ label, userVal, spouseVal, userKey, spouseKey }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2.5">
              <div className="flex-1 text-sm text-gray-700">{label}</div>
              <div className="w-24">
                <NumberInput value={userVal}
                  onChange={(v) => updateState({ [userKey]: v })}
                  className={inputCls} />
              </div>
              {state.hasSpouse && (
                <div className="w-24">
                  <NumberInput value={spouseVal}
                    onChange={(v) => updateState({ [spouseKey]: v })}
                    className={inputCls} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
