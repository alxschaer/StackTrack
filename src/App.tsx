import { useEffect, useMemo, useRef, useState } from 'react';
import { Landmark, Plus, TrendingUp, Wallet } from 'lucide-react';
import type { Account, Settings } from './types';
import { computeProjection, solveRequiredMonthly } from './lib/projections';
import { loadLedgerState, saveLedgerState, clearLedgerState } from './lib/storage';
import { fmt0 } from './lib/format';
import { TabButton, Card } from './components/ui';
import { OverviewTab } from './components/OverviewTab';
import { AccountsTab } from './components/AccountsTab';
import { ProjectionsTab } from './components/ProjectionsTab';
import { RetirementTab } from './components/RetirementTab';
import { catById } from './lib/categories';

const DEFAULT_SETTINGS: Settings = {
  inflationRate: 3,
  currentAge: 30,
  retirementAge: 65,
  desiredAnnualSpending: 60000,
  withdrawalRate: 4,
  additionalSavingsRate: 7,
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

type Tab = 'overview' | 'accounts' | 'projections' | 'retirement';

export default function App() {
  const initial = useRef(loadLedgerState());
  const [accounts, setAccounts] = useState<Account[]>(initial.current?.accounts ?? []);
  const [settings, setSettings] = useState<Settings>(initial.current?.settings ?? DEFAULT_SETTINGS);
  const [tab, setTab] = useState<Tab>('overview');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [confirmReset, setConfirmReset] = useState(false);
  const [horizon, setHorizon] = useState(30);
  const saveTimer = useRef<number | undefined>(undefined);
  const firstRender = useRef(true);

  // Debounced autosave to localStorage. Skip the very first render so we
  // don't immediately rewrite the state we just loaded.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      const ok = saveLedgerState({ accounts, settings });
      setSaveStatus(ok ? 'saved' : 'error');
    }, 500);
    return () => window.clearTimeout(saveTimer.current);
  }, [accounts, settings]);

  const totalNetWorth = useMemo(() => accounts.reduce((s, a) => s + (Number(a.balance) || 0), 0), [accounts]);
  const monthlyContribTotal = useMemo(
    () => accounts.reduce((s, a) => s + (Number(a.monthlyContribution) || 0), 0),
    [accounts]
  );
  const weightedRate = useMemo(() => {
    if (totalNetWorth <= 0) return 0;
    return accounts.reduce((s, a) => s + (Number(a.balance) || 0) * (Number(a.rate) || 0), 0) / totalNetWorth;
  }, [accounts, totalNetWorth]);

  const yearsToRetirement = Math.max(0, settings.retirementAge - settings.currentAge);

  const projectionData = useMemo(
    () => computeProjection(accounts, settings.inflationRate, horizon),
    [accounts, settings.inflationRate, horizon]
  );

  const retirementData = useMemo(
    () => computeProjection(accounts, settings.inflationRate, yearsToRetirement),
    [accounts, settings.inflationRate, yearsToRetirement]
  );
  const realAtRetirement = retirementData.length ? retirementData[retirementData.length - 1].real : 0;
  const nominalAtRetirement = retirementData.length ? retirementData[retirementData.length - 1].nominal : 0;
  const sustainableWithdrawal = realAtRetirement * (settings.withdrawalRate / 100);
  const onTrack = sustainableWithdrawal >= settings.desiredAnnualSpending;
  const requiredMonthly = useMemo(
    () =>
      solveRequiredMonthly(
        realAtRetirement,
        yearsToRetirement,
        settings.additionalSavingsRate,
        settings.inflationRate,
        settings.desiredAnnualSpending,
        settings.withdrawalRate
      ),
    [realAtRetirement, yearsToRetirement, settings]
  );

  const addAccount = () =>
    setAccounts((prev) => [
      ...prev,
      { id: uid(), name: '', category: 'savings', balance: 0, monthlyContribution: 0, rate: catById('savings').rate },
    ]);
  const updateAccount = (id: string, patch: Partial<Account>) =>
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const removeAccount = (id: string) => setAccounts((prev) => prev.filter((a) => a.id !== id));
  const resetAll = () => {
    setAccounts([]);
    setSettings(DEFAULT_SETTINGS);
    clearLedgerState();
    setConfirmReset(false);
  };

  return (
    <div className="min-h-screen font-body">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-ledger-gold">
              <Landmark size={20} />
              <h1 className="font-display text-2xl sm:text-3xl text-ledger-text">Ledger</h1>
            </div>
            <p className="text-sm mt-1 text-ledger-textSoft">Your net worth, growth, and retirement runway — in one place.</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-ledger-textFaint">Total net worth</div>
            <div className="font-display text-3xl sm:text-4xl tabular-nums text-ledger-text">{fmt0(totalNetWorth)}</div>
            <div className={`text-xs mt-0.5 ${saveStatus === 'error' ? 'text-ledger-rust' : 'text-ledger-textFaint'}`}>
              {saveStatus === 'saved' && 'Saved to this device'}
              {saveStatus === 'error' && 'Save failed — check browser storage settings'}
            </div>
          </div>
        </div>

        <div
          className="flex gap-1 mb-6 p-1 rounded-lg flex-wrap bg-ledger-surface border border-ledger-border"
          style={{ width: 'fit-content' }}
        >
          <TabButton active={tab === 'overview'} onClick={() => setTab('overview')} icon={Wallet}>
            Overview
          </TabButton>
          <TabButton active={tab === 'accounts'} onClick={() => setTab('accounts')} icon={Plus}>
            Accounts
          </TabButton>
          <TabButton active={tab === 'projections'} onClick={() => setTab('projections')} icon={TrendingUp}>
            Projections
          </TabButton>
          <TabButton active={tab === 'retirement'} onClick={() => setTab('retirement')} icon={Landmark}>
            Retirement
          </TabButton>
        </div>

        {accounts.length === 0 && (
          <Card className="mb-6" dashed>
            <p className="text-sm text-ledger-textSoft">
              Nothing tracked yet. Head to <b className="text-ledger-text">Accounts</b> and add your checking, savings,
              brokerage, or crypto balances to get started.
            </p>
          </Card>
        )}

        {tab === 'overview' && (
          <OverviewTab
            accounts={accounts}
            totalNetWorth={totalNetWorth}
            monthlyContribTotal={monthlyContribTotal}
            weightedRate={weightedRate}
          />
        )}

        {tab === 'accounts' && (
          <AccountsTab
            accounts={accounts}
            addAccount={addAccount}
            updateAccount={updateAccount}
            removeAccount={removeAccount}
            confirmReset={confirmReset}
            setConfirmReset={setConfirmReset}
            resetAll={resetAll}
          />
        )}

        {tab === 'projections' && (
          <ProjectionsTab
            data={projectionData}
            horizon={horizon}
            setHorizon={setHorizon}
            settings={settings}
            setSettings={setSettings}
            yearsToRetirement={yearsToRetirement}
            hasAccounts={accounts.length > 0}
          />
        )}

        {tab === 'retirement' && (
          <RetirementTab
            settings={settings}
            setSettings={setSettings}
            yearsToRetirement={yearsToRetirement}
            realAtRetirement={realAtRetirement}
            nominalAtRetirement={nominalAtRetirement}
            sustainableWithdrawal={sustainableWithdrawal}
            onTrack={onTrack}
            requiredMonthly={requiredMonthly}
            data={retirementData}
            hasAccounts={accounts.length > 0}
          />
        )}

        <p className="text-xs mt-8 text-center text-ledger-textFaint">
          Projections are estimates based on the growth rates you enter — actual markets are far less smooth. Not
          financial advice.
        </p>
      </div>
    </div>
  );
}
