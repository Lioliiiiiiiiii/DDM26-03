import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExploreMatrixFooter } from '@/components/ExploreMatrixFooter';
import { MotionReveal } from '@/components/MotionReveal';
import { SectionHeader } from '@/components/SectionHeader';
import { TechnologyAccordionSection } from '@/components/TechnologyAccordionSection';
import { TechnologyHeatAnalysisCard } from '@/components/TechnologyHeatAnalysisCard';
import { TechnologyMarketValidationChart } from '@/components/TechnologyMarketValidationChart';
import { TechnologyPerceptionPanel } from '@/components/TechnologyPerceptionPanel';
import { TechnologyResearchInnovationPanel } from '@/components/TechnologyResearchInnovationPanel';
import { technologyOrder, technologyPages, technologyResearchSeries } from '@/data';

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
            <SectionHeader label="Technology Overview" title={technology.name} description={technology.definition} />
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="strategic-overview">
          <TechnologyHeatAnalysisCard
            industries={technology.overview.industryRadarProfiles}
            chairComment={technology.overview.chairComment}
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
