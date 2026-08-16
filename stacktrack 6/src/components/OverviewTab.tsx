import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Account } from '../types';
import { catById } from '../lib/categories';
import { fmt0, pct } from '../lib/format';
import { THEME } from '../lib/theme';
import { Card, Stat } from './ui';

interface Props {
  accounts: Account[];
  totalNetWorth: number;
  monthlyContribTotal: number;
  weightedRate: number;
}

export function OverviewTab({ accounts, totalNetWorth, monthlyContribTotal, weightedRate }: Props) {
  const categoryTotals = Object.entries(
    accounts.reduce<Record<string, number>>((map, a) => {
      map[a.category] = (map[a.category] || 0) + (Number(a.balance) || 0);
      return map;
    }, {})
  )
    .map(([id, value]) => ({ value, ...catById(id) }))
    .filter((c) => c.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Net worth" value={fmt0(totalNetWorth)} />
        <Stat label="Monthly contributions" value={fmt0(monthlyContribTotal)} accentClass="text-ledger-sage" />
        <Stat label="Blended return" value={pct(weightedRate)} accentClass="text-ledger-gold" />

        <Card className="sm:col-span-3">
          <h3 className="text-sm font-medium mb-3 text-ledger-textSoft">By account</h3>
          {accounts.length === 0 ? (
            <p className="text-sm text-ledger-textFaint">No accounts yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {accounts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-ledger-borderSoft last:border-b-0"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: catById(a.category).color }} />
                    {a.name || <span className="text-ledger-textFaint">Untitled account</span>}
                    <span className="text-xs text-ledger-textFaint">{catById(a.category).label}</span>
                  </span>
                  <span className="tabular-nums">{fmt0(a.balance)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="md:col-span-2">
        <h3 className="text-sm font-medium mb-3 text-ledger-textSoft">Allocation</h3>
        {categoryTotals.length === 0 ? (
          <p className="text-sm text-ledger-textFaint">Add accounts to see your allocation.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryTotals} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {categoryTotals.map((c) => (
                  <Cell key={c.id} fill={c.color} stroke={THEME.surface} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: THEME.surfaceAlt, border: `1px solid ${THEME.border}`, borderRadius: 8, color: THEME.text }}
                formatter={(v: number, n: string) => [fmt0(v), n]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="flex flex-col gap-1.5 mt-2">
          {categoryTotals.map((c) => (
            <div key={c.id} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-ledger-textSoft">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.color }} />
                {c.label}
              </span>
              <span className="tabular-nums text-ledger-textSoft">{((c.value / (totalNetWorth || 1)) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
