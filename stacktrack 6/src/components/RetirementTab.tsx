import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ProjectionPoint, Settings } from '../types';
import { CATEGORIES, catById } from '../lib/categories';
import { fmt0, fmtCompact } from '../lib/format';
import { THEME } from '../lib/theme';
import { Card, Field, Stat, StampBadge, inputClass } from './ui';

interface Props {
  settings: Settings;
  setSettings: (updater: (s: Settings) => Settings) => void;
  yearsToRetirement: number;
  realAtRetirement: number;
  nominalAtRetirement: number;
  sustainableWithdrawal: number;
  onTrack: boolean;
  requiredMonthly: number | null;
  data: ProjectionPoint[];
  hasAccounts: boolean;
}

export function RetirementTab({
  settings,
  setSettings,
  yearsToRetirement,
  realAtRetirement,
  nominalAtRetirement,
  sustainableWithdrawal,
  onTrack,
  requiredMonthly,
  data,
  hasAccounts,
}: Props) {
  const set = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Field label="Current age">
            <input type="number" value={settings.currentAge} onChange={(e) => set({ currentAge: Number(e.target.value) })} className={`${inputClass} tabular-nums`} />
          </Field>
          <Field label="Retirement age">
            <input type="number" value={settings.retirementAge} onChange={(e) => set({ retirementAge: Number(e.target.value) })} className={`${inputClass} tabular-nums`} />
          </Field>
          <Field label="Desired spend/yr (today's $)">
            <input type="number" value={settings.desiredAnnualSpending} onChange={(e) => set({ desiredAnnualSpending: Number(e.target.value) })} className={`${inputClass} tabular-nums`} />
          </Field>
          <Field label="Withdrawal rate">
            <input type="number" step="0.1" value={settings.withdrawalRate} onChange={(e) => set({ withdrawalRate: Number(e.target.value) })} className={`${inputClass} tabular-nums`} />
          </Field>
          <Field label="Extra savings rate">
            <input type="number" step="0.1" value={settings.additionalSavingsRate} onChange={(e) => set({ additionalSavingsRate: Number(e.target.value) })} className={`${inputClass} tabular-nums`} />
          </Field>
        </div>
      </Card>

      {!hasAccounts ? (
        <Card>
          <p className="text-sm py-4 text-center text-ledger-textFaint">Add accounts to see your retirement runway.</p>
        </Card>
      ) : yearsToRetirement <= 0 ? (
        <Card>
          <p className="text-sm text-ledger-rust">Retirement age should be later than current age.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stat label={`Net worth at ${settings.retirementAge}`} value={fmt0(nominalAtRetirement)} />
            <Stat label="In today's dollars" value={fmt0(realAtRetirement)} />
            <Stat
              label={`Sustainable spend/yr (${settings.withdrawalRate}% rule)`}
              value={fmt0(sustainableWithdrawal)}
              accentClass={onTrack ? 'text-ledger-sage' : 'text-ledger-rust'}
            />
          </div>

          <Card>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm text-ledger-textSoft">
                  At your current savings rate, retiring at {settings.retirementAge} supports about{' '}
                  <b className="text-ledger-text">{fmt0(sustainableWithdrawal)}/yr</b> in today's dollars, against a goal of{' '}
                  <b className="text-ledger-text">{fmt0(settings.desiredAnnualSpending)}/yr</b>.
                </p>
                {!onTrack && requiredMonthly !== null && (
                  <p className="text-sm mt-2 text-ledger-textSoft">
                    Closing that gap takes roughly <b className="text-ledger-gold">{fmt0(requiredMonthly)}/mo</b> more in
                    savings (assumed at {settings.additionalSavingsRate}%/yr), starting now.
                  </p>
                )}
              </div>
              <StampBadge onTrack={onTrack} />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium mb-2 text-ledger-textSoft">Path to retirement</h3>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.borderSoft} vertical={false} />
                <XAxis dataKey="year" tickFormatter={(y) => `Age ${settings.currentAge + y}`} stroke={THEME.textFaint} fontSize={12} />
                <YAxis tickFormatter={fmtCompact} stroke={THEME.textFaint} fontSize={12} width={60} />
                <Tooltip
                  contentStyle={{ background: THEME.surfaceAlt, border: `1px solid ${THEME.border}`, borderRadius: 8, color: THEME.text }}
                  labelFormatter={(y) => `Age ${settings.currentAge + y}`}
                  formatter={(v: number, key: string) =>
                    key === 'real' ? [fmt0(v), 'Inflation-adjusted'] : key === 'nominal' ? [fmt0(v), 'Nominal'] : [fmt0(v), catById(key).label]
                  }
                />
                {CATEGORIES.map((c) => (
                  <Area key={c.id} type="monotone" dataKey={c.id} stackId="1" stroke={c.color} fill={c.color} fillOpacity={0.55} />
                ))}
                <Line type="monotone" dataKey="real" stroke={THEME.gold} strokeWidth={2} strokeDasharray="5 4" dot={false} />
                <ReferenceLine x={yearsToRetirement} stroke={THEME.rust} strokeDasharray="3 3" label={{ value: 'Retire', fill: THEME.rust, fontSize: 12 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
