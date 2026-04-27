'use client';

import { useMemo, useState } from 'react';
import { ExploreMatrixFooter } from '@/components/ExploreMatrixFooter';
import { MotionReveal } from '@/components/MotionReveal';
import { OverviewHero } from '@/components/OverviewHero';
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
  const [selectedHeatTechnologySlug, setSelectedHeatTechnologySlug] = useState(defaultTechnologySlug);

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
        <OverviewHero
          label="Industry Overview"
          title={industry.name}
          definition={industry.definition}
          perspectiveTitle={`Our perspective on ${industry.name}`}
        />
      </MotionReveal>

      <MotionReveal>
        <section id="strategic-overview">
          <TechnologyHeatAnalysisCard
            profiles={industry.overview.technologyRadarProfiles}
            chairComment={industry.overview.chairComment}
            pageName={industry.name}
            sectionTitle="Strategic Overview per Technology"
            selectedProfileSlug={selectedHeatTechnologySlug}
            onSelectProfileSlug={setSelectedHeatTechnologySlug}
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="perception">
          <TechnologyAccordionSection title="Professionals' Perception">
            <TechnologyPerceptionPanel
              impactRanking={industry.professionalsPerception.impactRanking}
              impactDistribution={
                industry.professionalsPerception.impactDistributionByTechnology[defaultTechnologySlug] ?? []
              }
              timelineDistribution={
                industry.professionalsPerception.timelineDistributionByTechnology[defaultTechnologySlug] ?? []
              }
              distributionFilters={technologyFilters}
              defaultDistributionFilterSlug={defaultTechnologySlug}
              impactDistributionByFilter={industry.professionalsPerception.impactDistributionByTechnology}
              timelineDistributionByFilter={industry.professionalsPerception.timelineDistributionByTechnology}
              topUseCases={industry.professionalsPerception.topUseCases}
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
