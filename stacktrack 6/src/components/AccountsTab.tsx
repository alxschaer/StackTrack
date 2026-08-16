import { useState } from 'react';
import { Plus, Sparkles, Trash2, ArrowRightLeft } from 'lucide-react';
import type { Account, CategoryId } from '../types';
import { CATEGORIES, catById } from '../lib/categories';
import { estimateGrowthRate } from '../lib/growthEstimates';
import { fmt0 } from '../lib/format';
import { Card, Field, inputClass } from './ui';

interface Props {
  accounts: Account[];
  addAccount: () => void;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  removeAccount: (id: string) => void;
  transferMoney: (
    fromId: string,
    toId: string | null,
    amount: number,
    newAccountName?: string,
    newAccountCategory?: CategoryId
  ) => void;
  confirmReset: boolean;
  setConfirmReset: (v: boolean) => void;
  resetAll: () => void;
}

export function AccountsTab({
  accounts,
  addAccount,
  updateAccount,
  removeAccount,
  transferMoney,
  confirmReset,
  setConfirmReset,
  resetAll,
}: Props) {
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState(''); // '' = unselected, 'new' = create account, else an account id
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('stocks');
  const [transferAmount, setTransferAmount] = useState(0);

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

  const fromAccount = accounts.find((a) => a.id === fromId);
  const toExistingAccount = toId !== '' && toId !== 'new' ? accounts.find((a) => a.id === toId) : undefined;
  const canTransfer =
    !!fromAccount &&
    transferAmount > 0 &&
    (toId === 'new' ? newName.trim().length > 0 : !!toExistingAccount && toId !== fromId);
  const resultingFromBalance = fromAccount ? (Number(fromAccount.balance) || 0) - transferAmount : 0;

  const submitTransfer = () => {
    if (!canTransfer || !fromAccount) return;
    if (toId === 'new') {
      transferMoney(fromId, null, transferAmount, newName, newCategory);
    } else {
      transferMoney(fromId, toId, transferAmount);
    }
    setToId('');
    setNewName('');
    setTransferAmount(0);
  };

  return (
    <div className="flex flex-col gap-4">
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

    {accounts.length > 0 && (
      <Card>
        <h3 className="text-sm font-medium mb-1 text-ledger-textSoft flex items-center gap-1.5">
          <ArrowRightLeft size={15} className="text-ledger-gold" /> Transfer between accounts
        </h3>
        <p className="text-xs mb-3 text-ledger-textFaint">
          Move money between two existing accounts, or out of one and into a brand-new one — e.g. buying $500 of a
          stock with money from checking — in a single step instead of editing both balances by hand.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
          <Field label="From">
            <select value={fromId} onChange={(e) => setFromId(e.target.value)} className={inputClass}>
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name || 'Untitled account'}
                </option>
              ))}
            </select>
          </Field>
          <Field label="To">
            <select value={toId} onChange={(e) => setToId(e.target.value)} className={inputClass}>
              <option value="">Select account</option>
              <option value="new">+ New account</option>
              {accounts
                .filter((a) => a.id !== fromId)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name || 'Untitled account'}
                  </option>
                ))}
            </select>
          </Field>
          {toId === 'new' ? (
            <>
              <Field label="New account name">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. AAPL shares"
                  className={inputClass}
                />
              </Field>
              <Field label="Category">
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as CategoryId)} className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          ) : (
            <div className="sm:col-span-2" />
          )}
          <Field label="Amount">
            <div className="flex items-center gap-1">
              <span className="text-sm text-ledger-textSoft">$</span>
              <input
                type="number"
                value={transferAmount || ''}
                onChange={(e) => setTransferAmount(Number(e.target.value) || 0)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
          </Field>
          <button
            onClick={submitTransfer}
            disabled={!canTransfer}
            className="flex items-center justify-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium bg-ledger-gold text-[#1a1408] disabled:opacity-40"
          >
            <ArrowRightLeft size={15} /> Transfer
          </button>
        </div>
        {fromAccount && transferAmount > 0 && resultingFromBalance < 0 && (
          <p className="text-xs mt-2 text-ledger-rust">
            This would leave "{fromAccount.name || 'Untitled account'}" at {fmt0(resultingFromBalance)} — still
            allowed, just flagging it in case that's not intended.
          </p>
        )}
      </Card>
    )}
    </div>
  );
}
