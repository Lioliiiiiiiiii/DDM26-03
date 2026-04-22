import { Metric } from '@/types/matrix';
import { cn } from '@/lib/utils';

const toneClass: Record<NonNullable<Metric['tone']>, string> = {
  neutral: 'border-slate-700/70 bg-slate-900/70 text-slate-200',
  positive: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-100'
};

export function MetricPill({ label, value, tone = 'neutral' }: Metric) {
  return (
    <div className={cn('rounded-xl border px-3 py-2', toneClass[tone])}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-current">{value}</p>
    </div>
  );
}
