import { useState } from 'react';
import { RefreshCw, Sparkles, Trash2, TriangleAlert } from 'lucide-react';
import type { TrackedBatch } from '../types';
import { CURATED_BATCHES } from '../lib/curatedPicks';
import { fmt0 } from '../lib/format';
import { Card, Field, inputClass } from './ui';

interface Props {
  apiKey: string;
  setApiKey: (key: string) => void;
  batches: TrackedBatch[];
  addBatch: (templateId: string, amount: number) => Promise<void>;
  removeBatch: (id: string) => void;
  refreshPrices: () => Promise<void>;
  refreshing: boolean;
  addingBatchId: string | null;
}

const fmt2 = (n: number) => `$${(n || 0).toFixed(2)}`;

export function AIInvestingTab({ apiKey, setApiKey, batches, addBatch, removeBatch, refreshPrices, refreshing, addingBatchId }: Props) {
  const [amount, setAmount] = useState(100);
  const hasKey = apiKey.trim().length > 0;

  const totals = batches.reduce(
    (acc, b) => {
      const invested = b.totalInvested;
      const current = b.picks.reduce((s, p) => s + (p.currentPrice ?? p.entryPrice ?? 0) * (p.allocation / (p.entryPrice || 1)), 0);
      return { invested: acc.invested + invested, current: acc.current + current };
    },
    { invested: 0, current: 0 }
  );
  const totalGain = totals.current - totals.invested;
  const totalGainPct = totals.invested > 0 ? (totalGain / totals.invested) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-ledger-gold/40">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-ledger-gold mt-0.5 shrink-0" />
          <p className="text-sm text-ledger-textSoft">
            Picks below were curated by Claude as an illustrative AI-investing theme — large, well-known companies
            grouped by an AI-relevant angle, not a live-generated or personalized recommendation. This is not
            financial advice; do your own research before investing real money.
          </p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-[240px]">
            <Field label="Finnhub API key (stored only in your browser)">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your free Finnhub API key"
                className={inputClass}
              />
            </Field>
            <p className="text-xs mt-1 text-ledger-textFaint">
              Get a free key at{' '}
              <a href="https://finnhub.io/register" target="_blank" rel="noreferrer" className="underline text-ledger-textSoft">
                finnhub.io/register
              </a>
              . Free tier: $0/month, no credit card required, ~60 requests/minute — far more than this app uses. It's
              sent directly to Finnhub from your browser and never touches this site's code or repo.
            </p>
          </div>
          <button
            onClick={() => void refreshPrices()}
            disabled={!hasKey || refreshing || batches.length === 0}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium bg-ledger-gold text-[#1a1408] disabled:opacity-40"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> Refresh prices
          </button>
        </div>
      </Card>

      {batches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="text-xs text-ledger-textFaint">Total invested</div>
            <div className="font-display text-2xl mt-1 tabular-nums text-ledger-text">{fmt0(totals.invested)}</div>
          </Card>
          <Card>
            <div className="text-xs text-ledger-textFaint">Current value</div>
            <div className="font-display text-2xl mt-1 tabular-nums text-ledger-text">{fmt0(totals.current)}</div>
          </Card>
          <Card>
            <div className="text-xs text-ledger-textFaint">Total gain / loss</div>
            <div className={`font-display text-2xl mt-1 tabular-nums ${totalGain >= 0 ? 'text-ledger-sage' : 'text-ledger-rust'}`}>
              {totalGain >= 0 ? '+' : ''}
              {fmt0(totalGain)} ({totalGainPct >= 0 ? '+' : ''}
              {totalGainPct.toFixed(1)}%)
            </div>
          </Card>
        </div>
      )}

      <Card>
        <h3 className="text-sm font-medium mb-3 text-ledger-textSoft">Add a batch of AI picks</h3>
        <div className="flex items-end gap-3 mb-4 flex-wrap">
          <Field label="Amount to invest">
            <div className="flex items-center gap-1">
              <span className="text-sm text-ledger-textSoft">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className={`${inputClass} w-28 tabular-nums`}
              />
            </div>
          </Field>
          <span className="text-xs text-ledger-textFaint pb-2">split evenly across the 3 picks in whichever theme you choose</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CURATED_BATCHES.map((template) => (
            <div key={template.id} className="rounded-lg p-3 bg-ledger-surfaceAlt border border-ledger-borderSoft flex flex-col gap-2">
              <div className="text-sm font-medium text-ledger-text">{template.theme}</div>
              <div className="flex flex-col gap-1.5">
                {template.picks.map((p) => (
                  <div key={p.ticker} className="text-xs text-ledger-textSoft">
                    <span className="font-medium text-ledger-text">{p.ticker}</span> — {p.rationale}
                  </div>
                ))}
              </div>
              <button
                onClick={() => void addBatch(template.id, amount)}
                disabled={addingBatchId === template.id || amount <= 0}
                className="mt-1 text-sm px-3 py-1.5 rounded-lg font-medium bg-ledger-gold text-[#1a1408] disabled:opacity-40"
              >
                {addingBatchId === template.id ? 'Adding…' : 'Track this batch'}
              </button>
            </div>
          ))}
        </div>
        {!hasKey && (
          <p className="text-xs mt-3 flex items-center gap-1.5 text-ledger-textFaint">
            <TriangleAlert size={13} /> Without an API key, batches are tracked with entry/current prices left blank.
          </p>
        )}
      </Card>

      {batches.length === 0 ? (
        <Card dashed>
          <p className="text-sm text-ledger-textFaint">No batches tracked yet — add one above to get started.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {batches.map((b) => {
            const current = b.picks.reduce((s, p) => s + (p.currentPrice ?? p.entryPrice ?? 0) * (p.allocation / (p.entryPrice || 1)), 0);
            const gain = current - b.totalInvested;
            const gainPct = b.totalInvested > 0 ? (gain / b.totalInvested) * 100 : 0;
            return (
              <Card key={b.id}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <div className="text-sm font-medium text-ledger-text">{b.theme}</div>
                    <div className="text-xs text-ledger-textFaint">
                      Added {new Date(b.date).toLocaleDateString()} · {fmt0(b.totalInvested)} invested
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm tabular-nums ${gain >= 0 ? 'text-ledger-sage' : 'text-ledger-rust'}`}>
                      {gain >= 0 ? '+' : ''}
                      {fmt0(gain)} ({gainPct >= 0 ? '+' : ''}
                      {gainPct.toFixed(1)}%)
                    </span>
                    <button onClick={() => removeBatch(b.id)} className="p-1.5 rounded-lg text-ledger-rust" aria-label="Remove batch">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {b.picks.map((p) => {
                    const shares = p.entryPrice ? p.allocation / p.entryPrice : null;
                    const value = p.currentPrice && shares ? p.currentPrice * shares : null;
                    const pickGain = value !== null ? value - p.allocation : null;
                    const pickGainPct = pickGain !== null && p.allocation > 0 ? (pickGain / p.allocation) * 100 : null;
                    return (
                      <div key={p.ticker} className="flex items-center justify-between text-sm py-1.5 border-b border-ledger-borderSoft last:border-b-0 flex-wrap gap-1">
                        <div>
                          <span className="font-medium text-ledger-text">{p.ticker}</span>{' '}
                          <span className="text-ledger-textFaint">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-ledger-textSoft tabular-nums">
                          <span>{fmt0(p.allocation)} in</span>
                          <span>entry {p.entryPrice ? fmt2(p.entryPrice) : '—'}</span>
                          <span>now {p.currentPrice ? fmt2(p.currentPrice) : '—'}</span>
                          <span className={pickGain === null ? '' : pickGain >= 0 ? 'text-ledger-sage' : 'text-ledger-rust'}>
                            {pickGain === null ? '—' : `${pickGain >= 0 ? '+' : ''}${fmt0(pickGain)} (${pickGainPct! >= 0 ? '+' : ''}${pickGainPct!.toFixed(1)}%)`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
