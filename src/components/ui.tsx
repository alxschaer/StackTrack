import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, type LucideIcon } from 'lucide-react';

export function Card({
  children,
  className = '',
  dashed = false,
}: {
  children: ReactNode;
  className?: string;
  dashed?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 sm:p-5 bg-ledger-surface border border-ledger-border ${
        dashed ? 'border-dashed' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-ledger-textFaint">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full px-2 py-1.5 rounded text-sm bg-ledger-surfaceAlt border border-ledger-border text-ledger-text ' +
  'focus:outline-none focus:ring-1 focus:ring-ledger-gold';

export function TabButton({
  active,
  onClick,
  children,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-ledger-gold text-[#1a1408]' : 'text-ledger-textSoft hover:text-ledger-text'
      }`}
    >
      <Icon size={15} />
      {children}
    </button>
  );
}

export function Stat({ label, value, accentClass }: { label: string; value: string; accentClass?: string }) {
  return (
    <Card>
      <div className="text-xs text-ledger-textFaint">{label}</div>
      <div className={`font-display text-2xl mt-1 tabular-nums ${accentClass ?? 'text-ledger-text'}`}>{value}</div>
    </Card>
  );
}

export function StampBadge({ onTrack }: { onTrack: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-display text-lg select-none border-2 ${
        onTrack ? 'border-ledger-sage text-ledger-sage' : 'border-ledger-rust text-ledger-rust'
      }`}
      style={{ transform: 'rotate(-2deg)', letterSpacing: '0.06em' }}
    >
      {onTrack ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      {onTrack ? 'ON TRACK' : 'BEHIND PACE'}
    </div>
  );
}
