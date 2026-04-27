'use client';

import { useMemo, useState } from 'react';
import { DataCard } from '@/components/DataCard';
import { FilterPillGroup, FilterPillOption } from '@/components/FilterPillGroup';
import { StackedDistributionBars } from '@/components/StackedDistributionBars';
import {
  TechnologyImpactDistributionItem,
  TechnologyImpactRankingItem,
  UseCase
} from '@/types/matrix';

type TechnologyPerceptionPanelProps = {
  currentTechnologySlug?: string;
  impactRanking: TechnologyImpactRankingItem[];
  impactDistribution: TechnologyImpactDistributionItem[];
  timelineDistribution?: TechnologyImpactDistributionItem[];
  topUseCases: UseCase[];
  distributionFilters?: FilterPillOption[];
  defaultDistributionFilterSlug?: string;
  impactDistributionByFilter?: Record<string, TechnologyImpactDistributionItem[]>;
  timelineDistributionByFilter?: Record<string, TechnologyImpactDistributionItem[]>;
};

const USE_CASE_DESCRIPTION_PLACEHOLDER =
  'Short description placeholder - final use-case copy will be added here once the Chair-approved description is available.';

export function TechnologyPerceptionPanel({
  currentTechnologySlug,
  impactRanking,
  impactDistribution,
  timelineDistribution,
  topUseCases,
  distributionFilters = [],
  defaultDistributionFilterSlug,
  impactDistributionByFilter,
  timelineDistributionByFilter
}: TechnologyPerceptionPanelProps) {
  const initialDistributionSlug =
    defaultDistributionFilterSlug ?? distributionFilters[0]?.slug ?? 'all';
  const [selectedDistributionSlug, setSelectedDistributionSlug] = useState(initialDistributionSlug);

  const activeDistributionSlug = distributionFilters.some((filter) => filter.slug === selectedDistributionSlug)
    ? selectedDistributionSlug
    : initialDistributionSlug;

  const activeImpactDistribution = useMemo(() => {
    if (!distributionFilters.length || activeDistributionSlug === 'all') {
      return impactDistribution;
    }

    return impactDistributionByFilter?.[activeDistributionSlug] ?? [];
  }, [activeDistributionSlug, distributionFilters.length, impactDistribution, impactDistributionByFilter]);

  const activeTimelineDistribution = useMemo(() => {
    if (!distributionFilters.length || activeDistributionSlug === 'all') {
      return timelineDistribution;
    }

    return timelineDistributionByFilter?.[activeDistributionSlug] ?? [];
  }, [activeDistributionSlug, distributionFilters.length, timelineDistribution, timelineDistributionByFilter]);

  return (
    <div className="space-y-4">
      {distributionFilters.length ? (
        <FilterPillGroup
          options={distributionFilters}
          selectedSlug={activeDistributionSlug}
          onSelect={setSelectedDistributionSlug}
          ariaLabel="Professionals' Perception distribution filters"
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.65fr)]">
        <DataCard title="Impact Ranking" className="h-full">
          {impactRanking.length ? (
            <ol className="space-y-2">
              {impactRanking.map((item, index) => {
                const isCurrent = item.technologySlug === currentTechnologySlug;

                return (
                  <li
                    key={item.technologySlug}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      isCurrent
                        ? 'border-orange-300/60 bg-orange-500/12 text-orange-100'
                        : 'border-white/10 bg-slate-900/70 text-slate-200'
                    }`}
                  >
                    <span className="font-medium">
                      #{index + 1} {item.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm leading-6 text-slate-400">No ranking data is available yet.</p>
          )}
        </DataCard>

        <DataCard title="Impact & Timeline Distribution" subtitle="Percentage share of responses">
          <StackedDistributionBars
            impactDistribution={activeImpactDistribution}
            timelineDistribution={activeTimelineDistribution}
          />
        </DataCard>
      </div>

      <DataCard title="Top Voted Use Cases">
        <div className="grid gap-3 md:grid-cols-2">
          {topUseCases.slice(0, 4).map((useCase, index) => (
            <article
              key={`${useCase.title}-${index}`}
              className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
            >
              <p className="text-sm font-semibold text-slate-100">{useCase.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {useCase.description || USE_CASE_DESCRIPTION_PLACEHOLDER}
              </p>
            </article>
          ))}
        </div>
      </DataCard>
    </div>
  );
}
