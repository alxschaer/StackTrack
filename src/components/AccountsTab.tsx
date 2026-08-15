import { Plus, Trash2 } from 'lucide-react';
import type { Account, CategoryId } from '../types';
import { CATEGORIES, catById } from '../lib/categories';
import { Card, Field, inputClass } from './ui';

interface Props {
  accounts: Account[];
  addAccount: () => void;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  removeAccount: (id: string) => void;
  confirmReset: boolean;
  setConfirmReset: (v: boolean) => void;
  resetAll: () => void;
}

export function AccountsTab({
  accounts,
  addAccount,
  updateAccount,
  removeAccount,
  confirmReset,
  setConfirmReset,
  resetAll,
}: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-medium text-ledger-textSoft">Your accounts</h3>
        <div className="flex gap-2">
          <button
            onClick={addAccount}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium bg-ledger-gold text-[#1a1408]"
          >
            <Plus size={15} /> Add account
          </button>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-sm px-3 py-1.5 rounded-lg border border-ledger-border text-ledger-textSoft"
            >
              Reset all
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={resetAll} className="text-sm px-3 py-1.5 rounded-lg bg-ledger-rust text-[#1a0d0e]">
                Confirm reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="text-sm px-3 py-1.5 rounded-lg border border-ledger-border text-ledger-textSoft"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {accounts.map((a) => (
          <div
            key={a.id}
            className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end p-3 rounded-lg bg-ledger-surfaceAlt border border-ledger-borderSoft"
          >
            <div className="col-span-2 sm:col-span-2">
              <Field label="Name">
                <input
                  value={a.name}
                  onChange={(e) => updateAccount(a.id, { name: e.target.value })}
                  placeholder="e.g. Fidelity brokerage"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Category">
              <select
                value={a.category}
                onChange={(e) => {
                  const category = e.target.value as CategoryId;
                  updateAccount(a.id, { category, rate: catById(category).rate });
                }}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Balance">
              <input
                type="number"
                value={a.balance}
                onChange={(e) => updateAccount(a.id, { balance: e.target.value === '' ? 0 : Number(e.target.value) })}
                className={`${inputClass} tabular-nums`}
              />
            </Field>
            <Field label="Monthly add">
              <input
                type="number"
                value={a.monthlyContribution}
                onChange={(e) =>
                  updateAccount(a.id, { monthlyContribution: e.target.value === '' ? 0 : Number(e.target.value) })
                }
                className={`${inputClass} tabular-nums`}
              />
            </Field>
            <div className="flex gap-2 items-end">
              <Field label="Growth %/yr">
                <input
                  type="number"
                  step="0.1"
                  value={a.rate}
                  onChange={(e) => updateAccount(a.id, { rate: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className={`${inputClass} tabular-nums`}
                />
              </Field>
              <button
                onClick={() => removeAccount(a.id)}
                className="p-2 rounded-lg mb-0.5 text-ledger-rust"
                aria-label="Remove account"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <p className="text-sm text-ledger-textFaint">No accounts yet — add your first one above.</p>
        )}
      </div>
      <p className="text-xs mt-4 text-ledger-textFaint">
        Growth rate defaults to a typical long-run figure for the category — edit it to match your own accounts or
        expectations.
      </p>
    </Card>
  );
}
