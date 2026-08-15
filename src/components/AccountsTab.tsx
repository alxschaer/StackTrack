import { useState } from 'react';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import type { Account, CategoryId } from '../types';
import { CATEGORIES, catById } from '../lib/categories';
import { estimateGrowthRate } from '../lib/growthEstimates';
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
  const [reasons, setReasons] = useState<Record<string, string>>({});

  // Manual edits invalidate any previously shown suggestion reason, so the
  // note never lingers next to a number the person has since changed.
  const editField = (id: string, patch: Partial<Account>) => {
    updateAccount(id, patch);
    setReasons((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const suggestRate = (a: Account) => {
    const { rate, reason } = estimateGrowthRate(a.category, a.name);
    updateAccount(a.id, { rate });
    setReasons((prev) => ({ ...prev, [a.id]: reason }));
  };

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
                  onChange={(e) => editField(a.id, { name: e.target.value })}
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
                  editField(a.id, { category, rate: catById(category).rate });
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
                onChange={(e) => editField(a.id, { balance: e.target.value === '' ? 0 : Number(e.target.value) })}
                className={`${inputClass} tabular-nums`}
              />
            </Field>
            <Field label="Monthly add">
              <input
                type="number"
                value={a.monthlyContribution}
                onChange={(e) =>
                  editField(a.id, { monthlyContribution: e.target.value === '' ? 0 : Number(e.target.value) })
                }
                className={`${inputClass} tabular-nums`}
              />
            </Field>
            <div className="flex gap-2 items-end">
              <Field label="Growth %/yr">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={a.rate}
                    onChange={(e) => editField(a.id, { rate: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className={`${inputClass} tabular-nums`}
                  />
                  <button
                    onClick={() => suggestRate(a)}
                    title="Get an AI-suggested estimate based on this account's category and name"
                    className="p-1.5 rounded-lg text-ledger-gold shrink-0"
                    aria-label="Suggest a growth rate"
                  >
                    <Sparkles size={15} />
                  </button>
                </div>
              </Field>
              <button
                onClick={() => removeAccount(a.id)}
                className="p-2 rounded-lg mb-0.5 text-ledger-rust"
                aria-label="Remove account"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {reasons[a.id] && (
              <div className="col-span-2 sm:col-span-6 -mt-1 flex items-start gap-1.5 text-xs text-ledger-textFaint">
                <Sparkles size={12} className="mt-0.5 shrink-0 text-ledger-gold" />
                {reasons[a.id]}
              </div>
            )}
          </div>
        ))}
        {accounts.length === 0 && (
          <p className="text-sm text-ledger-textFaint">No accounts yet — add your first one above.</p>
        )}
      </div>
      <p className="text-xs mt-4 text-ledger-textFaint">
        Growth rate defaults to a typical long-run figure for the category — edit it to match your own accounts or
        expectations, or click the sparkle icon for a more tailored estimate based on the account's name.
      </p>
    </Card>
  );
}
