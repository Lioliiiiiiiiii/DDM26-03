import { DataCard } from '@/components/DataCard';
import { MetricPill } from '@/components/MetricPill';
import { MarketSignal, Metric } from '@/types/matrix';

type MarketValidationPanelProps = {
  title?: string;
  ecosystemMetrics: Metric[];
  notableActors: string[];
  signals: MarketSignal[];
};

export function MarketValidationPanel({
  title = 'Market Validation',
  ecosystemMetrics,
  notableActors,
  signals
}: MarketValidationPanelProps) {
  return (
    <DataCard title={title} subtitle="Ecosystem traction, capital flows, and notable market actors.">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ecosystem Metrics</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ecosystemMetrics.map((metric) => (
              <MetricPill key={metric.label} {...metric} />
            ))}
          </div>
          <ul className="space-y-2 rounded-xl border border-white/10 bg-slate-900/65 p-3">
            {signals.map((signal) => (
              <li key={signal.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-300">{signal.label}</span>
                <span className="font-semibold text-orange-200">{signal.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/65 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Notable Actors</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {notableActors.map((actor) => (
              <li key={actor} className="rounded-lg border border-white/10 bg-slate-800/40 px-3 py-2">
                {actor}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DataCard>
  );
}
