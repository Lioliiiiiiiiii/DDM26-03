import { TechnologyImpactDistributionItem } from '@/types/matrix';

type StackedDistributionBarsProps = {
  impactDistribution: TechnologyImpactDistributionItem[];
  timelineDistribution?: TechnologyImpactDistributionItem[];
};

const IMPACT_COLORS = ['#64748b', '#6ea8ff', '#34d1bf', '#f59e0b', '#fb7185'];
const TIMELINE_COLORS = ['#64748b', '#8b5cf6', '#38bdf8', '#f59e0b'];

const formatPercentage = (value: number) => `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}%`;

function hasDistributionValues(items: TechnologyImpactDistributionItem[]) {
  return items.some((item) => item.percentage > 0);
}

function StackedBar({
  title,
  items,
  colors
}: {
  title: string;
  items: TechnologyImpactDistributionItem[];
  colors: string[];
}) {
  const visualItems = items
    .map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }))
    .reverse();

  return (
    <div className="flex min-w-[160px] flex-1 flex-col items-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{title}</p>
      <div className="flex h-[280px] w-24 flex-col overflow-hidden rounded-t-2xl rounded-b-lg border border-white/10 bg-slate-950/80 shadow-inner md:h-[320px] md:w-28">
        {visualItems.map((item) => {
          const minHeight = item.percentage > 0 ? 8 : 0;

          return (
            <div
              key={`${title}-${item.label}`}
              className="group relative min-h-0 transition-[filter] hover:brightness-110"
              title={`${item.label}: ${formatPercentage(item.percentage)}`}
              aria-label={`${item.label}: ${formatPercentage(item.percentage)}`}
              style={{ flexGrow: item.percentage, minHeight, backgroundColor: item.color }}
            >
              {item.percentage >= 12 ? (
                <span className="absolute inset-x-1 top-1/2 -translate-y-1/2 text-center text-[10px] font-semibold text-slate-950/90">
                  {formatPercentage(item.percentage)}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DistributionLegend({
  title,
  items,
  colors
}: {
  title: string;
  items: TechnologyImpactDistributionItem[];
  colors: string[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{title}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={`${title}-${item.label}`} className="flex items-center justify-between gap-3 text-xs text-slate-300">
            <span className="inline-flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="font-semibold text-slate-100">{formatPercentage(item.percentage)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StackedDistributionBars({
  impactDistribution,
  timelineDistribution
}: StackedDistributionBarsProps) {
  const hasImpact = hasDistributionValues(impactDistribution);
  const hasTimeline = timelineDistribution ? hasDistributionValues(timelineDistribution) : false;

  if (!hasImpact && !hasTimeline) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-white/10 bg-slate-950/45 px-6 text-center text-sm leading-6 text-slate-400">
        No distribution data is available for this selection yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.75fr)]">
      <div className="flex items-end justify-center gap-8 rounded-xl border border-white/10 bg-slate-950/45 px-5 pb-5 pt-6">
        {hasImpact ? <StackedBar title="Impact" items={impactDistribution} colors={IMPACT_COLORS} /> : null}
        {timelineDistribution && hasTimeline ? (
          <StackedBar title="Timeline" items={timelineDistribution} colors={TIMELINE_COLORS} />
        ) : null}
      </div>

      <div className="grid content-start gap-5 rounded-xl border border-white/10 bg-slate-950/35 p-4 sm:grid-cols-2 xl:grid-cols-1">
        {hasImpact ? <DistributionLegend title="Impact" items={impactDistribution} colors={IMPACT_COLORS} /> : null}
        {timelineDistribution && hasTimeline ? (
          <DistributionLegend title="Timeline" items={timelineDistribution} colors={TIMELINE_COLORS} />
        ) : null}
      </div>
    </div>
  );
}
