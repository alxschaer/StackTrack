import { useState } from 'react';
import { Plus, RefreshCw, Sparkles, Trash2, TriangleAlert } from 'lucide-react';
import type { TrackedBatch, StockBatchTemplate } from '../types';
import { CURATED_BATCHES } from '../lib/curatedPicks';
import { fetchQuote } from '../lib/market';
import { fmt0 } from '../lib/format';
import { Card, Field, inputClass } from './ui';

interface Props {
  apiKey: string;
  setApiKey: (key: string) => void;
  batches: TrackedBatch[];
  addBatch: (templateId: string, amount: number) => Promise<void>;
  addManualHolding: (ticker: string, name: string, pricePaid: number, amount: number) => void;
  removeBatch: (id: string) => void;
  refreshPrices: () => Promise<void>;
  refreshing: boolean;
  addingBatchId: string | null;
}

const fmt2 = (n: number) => `$${(n || 0).toFixed(2)}`;

export function AIInvestingTab({
  apiKey,
  setApiKey,
  batches,
  addBatch,
  addManualHolding,
  removeBatch,
  refreshPrices,
  refreshing,
  addingBatchId,
}: Props) {
  const [amount, setAmount] = useState(100);
  const [manualTicker, setManualTicker] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState(0);
  const [manualAmount, setManualAmount] = useState(0);
  const [previewPrices, setPreviewPrices] = useState<Record<string, number>>({});
  const [checkingBatchId, setCheckingBatchId] = useState<string | null>(null);
  const hasKey = apiKey.trim().length > 0;
  const canAddManual = manualTicker.trim().length > 0 && manualPrice > 0 && manualAmount > 0;

  const submitManualHolding = () => {
    if (!canAddManual) return;
    addManualHolding(manualTicker, manualName, manualPrice, manualAmount);
    setManualTicker('');
    setManualName('');
    setManualPrice(0);
    setManualAmount(0);
  };

  const checkPreviewPrices = async (templateId: string, tickers: string[]) => {
    if (!hasKey) return;
    setCheckingBatchId(templateId);
    const key = apiKey.trim();
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const { price } = await fetchQuote(ticker, key);
          return [ticker, price] as const;
        } catch {
          return [ticker, null] as const;
        }
      })
    );
    setPreviewPrices((prev) => {
      const next = { ...prev };
      results.forEach(([ticker, price]) => {
        if (price !== null) next[ticker] = price;
      });
      return next;
    });
    setCheckingBatchId(null);
  };

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
            "AI picks" means Claude (the AI) selected these — not that every company is in the AI industry. Each tier
            is diversified across sectors, with a couple of AI-relevant names mixed in rather than the whole set
            concentrated in one theme. Not a live-generated or personalized recommendation either way, and not
            financial advice — do your own research before investing real money.
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

        <h3 className="text-sm font-medium mb-2 text-ledger-textSoft">Core AI picks — large, established companies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {CURATED_BATCHES.filter((t) => t.riskTier === 'core').map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              amount={amount}
              addBatch={addBatch}
              addingBatchId={addingBatchId}
              previewPrices={previewPrices}
              checkingBatchId={checkingBatchId}
              checkPreviewPrices={checkPreviewPrices}
              hasKey={hasKey}
              accent="gold"
            />
          ))}
        </div>

        <div className="flex items-start gap-2 mb-2 p-2 rounded-lg bg-ledger-rust/10 border border-ledger-rust/30">
          <TriangleAlert size={14} className="text-ledger-rust mt-0.5 shrink-0" />
          <p className="text-xs text-ledger-textSoft">
            <b className="text-ledger-rust">Higher risk.</b> These are smaller, newer, or not-yet-profitable
            companies — several have moved 20%+ in a single trading day this year. Much more volatile than the core
            picks above; treat this as speculative, not a core holding.
          </p>
        </div>
        <h3 className="text-sm font-medium mb-2 text-ledger-textSoft">Speculative AI picks — smaller, less established, more volatile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CURATED_BATCHES.filter((t) => t.riskTier === 'speculative').map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              amount={amount}
              addBatch={addBatch}
              addingBatchId={addingBatchId}
              previewPrices={previewPrices}
              checkingBatchId={checkingBatchId}
              checkPreviewPrices={checkPreviewPrices}
              hasKey={hasKey}
              accent="rust"
            />
          ))}
        </div>

        <p className="text-xs mt-3 text-ledger-textFaint">
          "Target" is a real Wall Street analyst consensus 12-month price target, sourced when each batch was
          curated — not a Claude prediction, and not a guarantee; these change often and analysts are frequently
          wrong. Click "Check current vs. target" (needs your API key) to see today's live price alongside it.
        </p>
        {!hasKey && (
          <p className="text-xs mt-1 flex items-center gap-1.5 text-ledger-textFaint">
            <TriangleAlert size={13} /> Without an API key, batches are tracked with entry/current prices left blank.
          </p>
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-1 text-ledger-textSoft">Add your own holding</h3>
        <p className="text-xs mb-3 text-ledger-textFaint">
          Already own something? Enter what you actually paid — that becomes the entry price used for gain/loss, same
          as the AI-picked batches above.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
          <Field label="Ticker">
            <input
              value={manualTicker}
              onChange={(e) => setManualTicker(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL"
              className={inputClass}
            />
          </Field>
          <Field label="Name (optional)">
            <input
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="e.g. Apple"
              className={inputClass}
            />
          </Field>
          <Field label="Price you paid">
            <div className="flex items-center gap-1">
              <span className="text-sm text-ledger-textSoft">$</span>
              <input
                type="number"
                step="0.01"
                value={manualPrice || ''}
                onChange={(e) => setManualPrice(Number(e.target.value) || 0)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
          </Field>
          <Field label="Amount invested">
            <div className="flex items-center gap-1">
              <span className="text-sm text-ledger-textSoft">$</span>
              <input
                type="number"
                value={manualAmount || ''}
                onChange={(e) => setManualAmount(Number(e.target.value) || 0)}
                className={`${inputClass} tabular-nums`}
              />
            </div>
          </Field>
          <button
            onClick={submitManualHolding}
            disabled={!canAddManual}
            className="flex items-center justify-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium bg-ledger-gold text-[#1a1408] disabled:opacity-40"
          >
            <Plus size={15} /> Add holding
          </button>
        </div>
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

function TemplateCard({
  template,
  amount,
  addBatch,
  addingBatchId,
  previewPrices,
  checkingBatchId,
  checkPreviewPrices,
  hasKey,
  accent,
}: {
  template: StockBatchTemplate;
  amount: number;
  addBatch: (templateId: string, amount: number) => Promise<void>;
  addingBatchId: string | null;
  previewPrices: Record<string, number>;
  checkingBatchId: string | null;
  checkPreviewPrices: (templateId: string, tickers: string[]) => Promise<void>;
  hasKey: boolean;
  accent: 'gold' | 'rust';
}) {
  const buttonClass = accent === 'gold' ? 'bg-ledger-gold text-[#1a1408]' : 'bg-ledger-rust text-[#1a0d0e]';
  const borderClass = accent === 'gold' ? 'border-ledger-borderSoft' : 'border-ledger-rust/30';

  return (
    <div className={`rounded-lg p-3 bg-ledger-surfaceAlt border ${borderClass} flex flex-col gap-2`}>
      <div>
        <div className="text-sm font-medium text-ledger-text">{template.theme}</div>
        <div className="text-xs text-ledger-textFaint">
          Curated {new Date(template.curatedDate).toLocaleDateString()} · targets as of {template.targetPriceAsOf}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {template.picks.map((p) => {
          const current = previewPrices[p.ticker];
          const upside = current !== undefined ? ((p.analystTargetPrice - current) / current) * 100 : null;
          return (
            <div key={p.ticker} className="text-xs text-ledger-textSoft border-t border-ledger-borderSoft pt-2 first:border-t-0 first:pt-0">
              <div>
                <span className="font-medium text-ledger-text">{p.ticker}</span> · {p.name}
              </div>
              <p className="mt-0.5 text-ledger-textFaint">{p.analysis}</p>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1 tabular-nums">
                <span>Target {fmt2(p.analystTargetPrice)}</span>
                {current !== undefined && (
                  <>
                    <span>Now {fmt2(current)}</span>
                    <span className={upside !== null && upside >= 0 ? 'text-ledger-sage' : 'text-ledger-rust'}>
                      {upside !== null ? `${upside >= 0 ? '+' : ''}${upside.toFixed(0)}% to target` : ''}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-1 flex-wrap">
        <button
          onClick={() =>
            void checkPreviewPrices(
              template.id,
              template.picks.map((p) => p.ticker)
            )
          }
          disabled={!hasKey || checkingBatchId === template.id}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-ledger-border text-ledger-textSoft disabled:opacity-40"
        >
          {checkingBatchId === template.id ? 'Checking…' : 'Check current vs. target'}
        </button>
        <button
          onClick={() => void addBatch(template.id, amount)}
          disabled={addingBatchId === template.id || amount <= 0}
          className={`text-sm px-3 py-1.5 rounded-lg font-medium disabled:opacity-40 ${buttonClass}`}
        >
          {addingBatchId === template.id ? 'Adding…' : 'Track this batch'}
        </button>
      </div>
    </div>
  );
}
