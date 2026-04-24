'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExploreMatrixFooter } from '@/components/ExploreMatrixFooter';
import { MotionReveal } from '@/components/MotionReveal';
import { SectionHeader } from '@/components/SectionHeader';
import { TechnologyAccordionSection } from '@/components/TechnologyAccordionSection';
import { TechnologyHeatAnalysisCard } from '@/components/TechnologyHeatAnalysisCard';
import { TechnologyMarketValidationChart } from '@/components/TechnologyMarketValidationChart';
import { TechnologyPerceptionPanel } from '@/components/TechnologyPerceptionPanel';
import { IndustryOverviewPageData } from '@/types/matrix';

type IndustryOverviewTemplateProps = {
  industry: IndustryOverviewPageData;
};

export function IndustryOverviewTemplate({ industry }: IndustryOverviewTemplateProps) {
  const defaultTechnologySlug = industry.overview.technologyRadarProfiles[0]?.slug ?? '';
  const [selectedTechnologySlug, setSelectedTechnologySlug] = useState(defaultTechnologySlug);

  const selectedImpactDistribution =
    industry.professionalsPerception.impactDistributionByTechnology[selectedTechnologySlug] ?? [];
  const selectedTimelineDistribution =
    industry.professionalsPerception.timelineDistributionByTechnology[selectedTechnologySlug] ?? [];

  const technologyFilters = useMemo(
    () =>
      industry.overview.technologyRadarProfiles.map((technology) => ({
        slug: technology.slug,
        name: technology.name
      })),
    [industry.overview.technologyRadarProfiles]
  );

  const marketTotals = useMemo(() => {
    const unicornFundingUsd = industry.marketValidation.points.reduce((sum, point) => sum + point.fundingUsd, 0);
    const nativeUnicornCount = industry.marketValidation.points.filter((point) => point.category === 'Native').length;
    const unicornCount = industry.marketValidation.points.filter(
      (point) => point.category === 'Native' || point.category === 'Unicorn'
    ).length;
    const emergingUnicornCount = industry.marketValidation.points.filter(
      (point) => point.category === 'Emerging'
    ).length;

    return {
      unicornFundingUsd,
      unicornCount,
      nativeUnicornCount,
      emergingUnicornCount,
      startupCount2025: industry.marketValidation.startupCount2025
    };
  }, [industry.marketValidation.points, industry.marketValidation.startupCount2025]);

  return (
    <div className="space-y-7">
      <MotionReveal>
        <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0f1f49]/75 via-[#0d1a3b]/70 to-[#091126]/70 p-4 md:p-6">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-orange-300/45 hover:text-orange-100"
          >
            Back to Heatmatrix
          </Link>
          <div className="mt-5 space-y-3">
            <SectionHeader label="Industry Overview" title={industry.name} description={industry.definition} />
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="strategic-overview">
          <TechnologyHeatAnalysisCard
            profiles={industry.overview.technologyRadarProfiles}
            chairComment={industry.overview.chairComment}
            sectionTitle="Strategic Overview per Technology"
            selectedProfileSlug={selectedTechnologySlug}
            onSelectProfileSlug={setSelectedTechnologySlug}
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="perception">
          <TechnologyAccordionSection title="Professionals' Perception">
            <TechnologyPerceptionPanel
              currentTechnologySlug={selectedTechnologySlug}
              impactRanking={industry.professionalsPerception.impactRanking}
              impactDistribution={selectedImpactDistribution}
              timelineDistribution={selectedTimelineDistribution}
              topUseCases={industry.professionalsPerception.topUseCases}
              useCaseSignalMode="chip"
            />
          </TechnologyAccordionSection>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="market-validation">
          <TechnologyAccordionSection title="Market Validation">
            <TechnologyMarketValidationChart
              totals={marketTotals}
              points={industry.marketValidation.points}
              technologyFilters={technologyFilters}
              startupCountByTechnology={industry.marketValidation.startupCountByTechnology}
            />
          </TechnologyAccordionSection>
        </section>
      </MotionReveal>

      <ExploreMatrixFooter
        highlightIndustrySlug={industry.slug}
        title={`Explore More on ${industry.name}`}
        description="Continue exploring related intersections in the heatmatrix."
      />
    </div>
  );
}
