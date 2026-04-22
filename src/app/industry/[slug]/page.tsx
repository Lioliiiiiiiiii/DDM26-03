import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContextualPageNav } from '@/components/ContextualPageNav';
import { DataCard } from '@/components/DataCard';
import { ExploreMatrixFooter } from '@/components/ExploreMatrixFooter';
import { InsightQuote } from '@/components/InsightQuote';
import { MarketValidationPanel } from '@/components/MarketValidationPanel';
import { MetricPill } from '@/components/MetricPill';
import { MotionReveal } from '@/components/MotionReveal';
import { RadarChartCard } from '@/components/RadarChartCard';
import { RankingList } from '@/components/RankingList';
import { SectionHeader } from '@/components/SectionHeader';
import { TrendChartCard } from '@/components/TrendChartCard';
import { industries } from '@/data';
import { getCellsByIndustry } from '@/lib/matrix';

type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);

  if (!industry) {
    return { title: 'Industry Not Found' };
  }

  return {
    title: industry.name,
    description: industry.summary
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);

  if (!industry) {
    notFound();
  }

  const cells = getCellsByIndustry(industry.slug)
    .sort((a, b) => b.score - a.score)
    .map((cell) => ({ label: cell.technologySlug.replaceAll('-', ' '), score: cell.score }));

  return (
    <div className="space-y-8">
      <MotionReveal>
        <section className="space-y-4">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-orange-300/45 hover:text-orange-100"
          >
            Back to Heatmatrix
          </Link>
          <SectionHeader
            label="Industry Overview"
            title={industry.name}
            description={industry.description}
          />
        </section>
      </MotionReveal>

      <ContextualPageNav
        links={[
          { label: 'Strategic Overview', href: '#strategic-overview' },
          { label: "Professional's Perception", href: '#perception' },
          { label: 'Market Validation', href: '#market-validation' },
          { label: 'Research Signals', href: '#research' }
        ]}
      />

      <MotionReveal>
        <section id="strategic-overview" className="space-y-4">
          <SectionHeader
            label="Strategic Overview"
            title="Industry disruption profile"
            description={industry.summary}
          />
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <RadarChartCard
              title={`${industry.name} disruption radar`}
              description="Industry readiness, urgency, and innovation dimensions"
              scores={industry.strategicScores}
            />
            <div className="space-y-4">
              <DataCard title="Score summary">
                <div className="grid gap-2">
                  {industry.scoreSummary.map((metric) => (
                    <MetricPill key={metric.label} {...metric} />
                  ))}
                </div>
              </DataCard>
              <RankingList title="Key disruption dimensions" items={industry.disruptionDimensions} />
            </div>
          </div>
          <InsightQuote {...industry.expertQuote} />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="perception" className="space-y-4">
          <SectionHeader
            label="Professional's Perception"
            title="Top-ranked technologies and maturity trend"
            description="How practitioners perceive impact concentration and timeline confidence."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <RankingList title="Top-ranked technologies" items={industry.topTechnologies} />
            <TrendChartCard
              title="Maturity timeline"
              subtitle="Adoption progression in this industry"
              data={industry.maturityTimeline}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <TrendChartCard
              title="Impact distribution"
              subtitle="Share of expected impact by capability area"
              data={industry.impactDistribution}
              showArea={false}
              dataKeyLabel="share"
            />
            <DataCard title="Most-voted use case snippets">
              <ul className="space-y-3">
                {industry.useCaseSnippets.map((snippet) => (
                  <li key={snippet.title} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                    <p className="text-sm font-semibold text-slate-100">{snippet.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{snippet.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-orange-200">{snippet.signal}</p>
                  </li>
                ))}
              </ul>
            </DataCard>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="market-validation" className="space-y-4">
          <SectionHeader
            label="Market Validation"
            title="Ecosystem maturity and investment indicators"
            description="Signals from operating scale, funding, and ecosystem actors."
          />
          <MarketValidationPanel
            ecosystemMetrics={industry.marketValidation.ecosystemMetrics}
            notableActors={industry.marketValidation.topCompanies}
            signals={industry.marketValidation.fundingIndicators}
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="research" className="space-y-4">
          <SectionHeader
            label="Research Signals"
            title="Technology concentration in this industry"
            description="Where disruption pressure is most concentrated across technologies."
          />
          <DataCard title="Technology ranking for this industry">
            <div className="grid gap-2 md:grid-cols-3">
              {cells.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Technology</p>
                  <p className="text-sm text-slate-100">{item.label}</p>
                  <p className="text-sm font-semibold text-orange-200">Score {item.score}</p>
                </div>
              ))}
            </div>
          </DataCard>
        </section>
      </MotionReveal>

      <ExploreMatrixFooter highlightIndustrySlug={industry.slug} />
    </div>
  );
}
