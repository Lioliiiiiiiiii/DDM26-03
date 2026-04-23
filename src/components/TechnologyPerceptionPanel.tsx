import { DataCard } from '@/components/DataCard';
import {
  TechnologyImpactDistributionItem,
  TechnologyImpactRankingItem,
  UseCase
} from '@/types/matrix';

type TechnologyPerceptionPanelProps = {
  currentTechnologySlug: string;
  impactRanking: TechnologyImpactRankingItem[];
  impactDistribution: TechnologyImpactDistributionItem[];
  topUseCases: UseCase[];
};

export function TechnologyPerceptionPanel({
  currentTechnologySlug,
  impactRanking,
  impactDistribution,
  topUseCases
}: TechnologyPerceptionPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <DataCard title="Impact Ranking" subtitle="Weighted impact score (1-5)">
          <ol className="space-y-2">
            {impactRanking.map((item, index) => {
              const isCurrent = item.technologySlug === currentTechnologySlug;
              return (
                <li
                  key={item.technologySlug}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                    isCurrent
                      ? 'border-orange-300/60 bg-orange-500/12 text-orange-100'
                      : 'border-white/10 bg-slate-900/70 text-slate-200'
                  }`}
                >
                  <span className="font-medium">
                    #{index + 1} {item.label}
                  </span>
                  <span className="font-semibold">{item.score.toFixed(2)}</span>
                </li>
              );
            })}
          </ol>
        </DataCard>

        <DataCard title="Impact Distribution" subtitle="Survey response share">
          <ul className="space-y-3">
            {impactDistribution.map((item) => (
              <li key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-300">
                  <span>{item.label}</span>
                  <span>
                    {item.percentage}% ({item.count})
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#70a6ff] via-[#79b7ff] to-[#97ccff]"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </DataCard>
      </div>

      <DataCard title="Top Voted Use Cases" subtitle="Survey and interview synthesis">
        <div className="grid gap-3 md:grid-cols-2">
          {topUseCases.map((useCase) => (
            <article key={`${useCase.title}-${useCase.signal}`} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <p className="text-sm font-semibold text-slate-100">{useCase.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{useCase.description}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-orange-200">{useCase.signal}</p>
            </article>
          ))}
        </div>
      </DataCard>
    </div>
  );
}
