import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExploreMatrixFooter } from '@/components/ExploreMatrixFooter';
import { MotionReveal } from '@/components/MotionReveal';
import { OverviewHero } from '@/components/OverviewHero';
import { TechnologyAccordionSection } from '@/components/TechnologyAccordionSection';
import { TechnologyHeatAnalysisCard } from '@/components/TechnologyHeatAnalysisCard';
import { TechnologyMarketValidationChart } from '@/components/TechnologyMarketValidationChart';
import { TechnologyPerceptionPanel } from '@/components/TechnologyPerceptionPanel';
import { TechnologyResearchInnovationPanel } from '@/components/TechnologyResearchInnovationPanel';
import { industryOverviewPages, technologyOrder, technologyPages, technologyResearchSeries } from '@/data';
import { aggregateDistribution } from '@/lib/distributions';

type TechnologyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return technologyPages.map((technology) => ({ slug: technology.slug }));
}

export async function generateMetadata({ params }: TechnologyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const technology = technologyPages.find((item) => item.slug === slug);

  if (!technology) {
    return { title: 'Technology Not Found' };
  }

  return {
    title: technology.name,
    description: technology.summary
  };
}

export default async function TechnologyPage({ params }: TechnologyPageProps) {
  const { slug } = await params;
  const technology = technologyPages.find((item) => item.slug === slug);

  if (!technology) {
    notFound();
  }

  const industryFilters = industryOverviewPages.map((industry) => ({
    slug: industry.slug,
    name: industry.name
  }));

  const impactDistributionByIndustry = Object.fromEntries(
    industryOverviewPages.map((industry) => [
      industry.slug,
      industry.professionalsPerception.impactDistributionByTechnology[technology.slug] ?? []
    ])
  );

  const timelineDistributionByIndustry = Object.fromEntries(
    industryOverviewPages.map((industry) => [
      industry.slug,
      industry.professionalsPerception.timelineDistributionByTechnology[technology.slug] ?? []
    ])
  );

  const aggregateTimelineDistribution = aggregateDistribution(
    Object.values(timelineDistributionByIndustry),
    ['Never', 'Later (2+yr)', 'Soon (next yr)', 'Now']
  );

  const marketPointsByIndustry = Object.fromEntries(
    industryOverviewPages.map((industry) => [
      industry.slug,
      industry.marketValidation.points.filter((point) => point.technologySlug === technology.slug)
    ])
  );

  const startupCountByIndustry = Object.fromEntries(
    industryOverviewPages.map((industry) => [
      industry.slug,
      industry.marketValidation.startupCountByTechnology[technology.slug] ?? 0
    ])
  );

  return (
    <div className="space-y-7">
      <MotionReveal>
        <OverviewHero
          label="Technology Overview"
          title={technology.name}
          definition={technology.definition}
          perspectiveTitle={`Our perspective on ${technology.name}`}
        />
      </MotionReveal>

      <MotionReveal>
        <section id="strategic-overview">
          <TechnologyHeatAnalysisCard
            industries={technology.overview.industryRadarProfiles}
            chairComment={technology.overview.chairComment}
            pageName={technology.name}
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="perception">
          <TechnologyAccordionSection title="Professionals' Perception">
            <TechnologyPerceptionPanel
              currentTechnologySlug={technology.slug}
              impactRanking={technology.professionalsPerception.impactRanking}
              impactDistribution={technology.professionalsPerception.impactDistribution}
              timelineDistribution={aggregateTimelineDistribution}
              distributionFilters={[{ slug: 'all', name: 'All' }, ...industryFilters]}
              defaultDistributionFilterSlug="all"
              impactDistributionByFilter={impactDistributionByIndustry}
              timelineDistributionByFilter={timelineDistributionByIndustry}
              topUseCases={technology.professionalsPerception.topUseCases}
            />
          </TechnologyAccordionSection>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="market-validation">
          <TechnologyAccordionSection title="Market Validation">
            <TechnologyMarketValidationChart
              totals={technology.marketValidation.totals}
              points={technology.marketValidation.scatterPoints}
              filterOptions={industryFilters}
              pointsByFilter={marketPointsByIndustry}
              startupCountByFilter={startupCountByIndustry}
            />
          </TechnologyAccordionSection>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="research">
          <TechnologyAccordionSection title="Research & Innovation">
            <TechnologyResearchInnovationPanel
              selectedTechnologySlug={technology.slug}
              technologyOrder={technologyOrder}
              patentsSeries={technologyResearchSeries.patents}
              scholarSeries={technologyResearchSeries.scholarWork}
              patentsDeltaPct={technology.researchInnovation.patentsDeltaPct}
              scholarDeltaPct={technology.researchInnovation.scholarDeltaPct}
              topApplicants={technology.researchInnovation.topApplicants2025}
              topApplicantsNote={technology.researchInnovation.topApplicantsNote}
            />
          </TechnologyAccordionSection>
        </section>
      </MotionReveal>

      <ExploreMatrixFooter
        highlightTechnologySlug={technology.slug}
        title={`Explore More on ${technology.shortName}`}
        description="Continue exploring related intersections in the heatmatrix."
      />
    </div>
  );
}
