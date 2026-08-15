import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ProjectionPoint, Settings } from '../types';
import { CATEGORIES, catById } from '../lib/categories';
import { fmt0, fmtCompact } from '../lib/format';
import { THEME } from '../lib/theme';
import { Card, Field, inputClass } from './ui';

const PRESETS = [5, 10, 20, 30, 40];

interface Props {
  data: ProjectionPoint[];
  horizon: number;
  setHorizon: (n: number) => void;
  settings: Settings;
  setSettings: (updater: (s: Settings) => Settings) => void;
  yearsToRetirement: number;
  hasAccounts: boolean;
}

export function ProjectionsTab({ data, horizon, setHorizon, settings, setSettings, yearsToRetirement, hasAccounts }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-wrap items-end gap-4 justify-between">
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((y) => (
              <button
                key={y}
                onClick={() => setHorizon(y)}
                className={`px-3 py-1.5 rounded-lg text-sm border border-ledger-border ${
                  horizon === y ? 'bg-ledger-gold text-[#1a1408]' : 'bg-ledger-surfaceAlt text-ledger-textSoft'
                }`}
              >
                {y} yr
              </button>
            ))}
            <button
              onClick={() => setHorizon(yearsToRetirement || 1)}
              className={`px-3 py-1.5 rounded-lg text-sm border border-ledger-border ${
                horizon === yearsToRetirement ? 'bg-ledger-gold text-[#1a1408]' : 'bg-ledger-surfaceAlt text-ledger-textSoft'
              }`}
            >
              To retirement
            </button>
          </div>
          <Field label="Inflation assumption">
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.1"
                value={settings.inflationRate}
                onChange={(e) => setSettings((s) => ({ ...s, inflationRate: Number(e.target.value) }))}
                className={`${inputClass} w-20 tabular-nums`}
              />
              <span className="text-sm text-ledger-textSoft">%/yr</span>
            </div>
          </Field>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 className="text-sm font-medium text-ledger-textSoft">Net worth over {horizon} years</h3>
          <div className="flex items-center gap-3 text-xs text-ledger-textFaint">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-0.5" style={{ background: THEME.gold }} /> Inflation-adjusted total
            </span>
          </div>
        </div>
        {!hasAccounts ? (
          <p className="text-sm py-8 text-center text-ledger-textFaint">Add accounts to see a projection.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={THEME.borderSoft} vertical={false} />
              <XAxis dataKey="year" tickFormatter={(y) => `Yr ${y}`} stroke={THEME.textFaint} fontSize={12} />
              <YAxis tickFormatter={fmtCompact} stroke={THEME.textFaint} fontSize={12} width={60} />
              <Tooltip
                contentStyle={{ background: THEME.surfaceAlt, border: `1px solid ${THEME.border}`, borderRadius: 8, color: THEME.text }}
                labelFormatter={(y) => `Year ${y}`}
                formatter={(v: number, key: string) => {
                  if (key === 'real') return [fmt0(v), 'Inflation-adjusted total'];
                  if (key === 'nominal') return [fmt0(v), 'Nominal total'];
                  return [fmt0(v), catById(key).label];
                }}
              />
              {CATEGORIES.map((c) => (
                <Area key={c.id} type="monotone" dataKey={c.id} stackId="1" stroke={c.color} fill={c.color} fillOpacity={0.55} />
              ))}
              <Line type="monotone" dataKey="real" stroke={THEME.gold} strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
