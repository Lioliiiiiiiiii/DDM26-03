import Link from 'next/link';
import { DataCard } from '@/components/DataCard';
import { HomepageCinematicIntro } from '@/components/HomepageCinematicIntro';
import { HomepageMethodologyMatrix } from '@/components/HomepageMethodologyMatrix';
import { MetricPill } from '@/components/MetricPill';
import { MotionReveal } from '@/components/MotionReveal';
import { SectionHeader } from '@/components/SectionHeader';
import {
  featuredHotspots,
  homepageIntro,
  industries,
  keyFindings,
  matrixCells,
  technologies
} from '@/data';
import { getAverageMatrixScore } from '@/lib/matrix';

export default function HomePage() {
  const averageScore = getAverageMatrixScore();
  const hotspots = featuredHotspots
    .map((id) => matrixCells.find((cell) => cell.id === id))
    .filter((cell): cell is NonNullable<typeof cell> => Boolean(cell));

  const leadingIndustries = industries
    .map((industry) => {
      const cells = matrixCells.filter((cell) => cell.industrySlug === industry.slug);
      const avg = Math.round(cells.reduce((sum, cell) => sum + cell.score, 0) / cells.length);
      return { industry, avg };
    })
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 4);

  return (
    <div className="space-y-14">
      <HomepageCinematicIntro
        intro={homepageIntro}
      />

      <MotionReveal>
        <section id="methodology" className="space-y-7">
          <HomepageMethodologyMatrix technologies={technologies} industries={industries} cells={matrixCells} />
          <SectionHeader
            label="Methodology"
            title="How to read the matrix"
            description="Each intersection combines strategic urgency, implementation momentum, market validation, and research intensity into a single comparable score."
          />
          <div className="grid gap-3 md:grid-cols-4">
            <MetricPill label="Matrix Average" value={`${averageScore}/100`} tone="positive" />
            <MetricPill label="Hotspot Cells (80+)" value={`${matrixCells.filter((cell) => cell.score >= 80).length}`} />
            <MetricPill label="Scale-up Cells (70-79)" value={`${matrixCells.filter((cell) => cell.score >= 70 && cell.score < 80).length}`} />
            <MetricPill label="Exploration Cells (<70)" value={`${matrixCells.filter((cell) => cell.score < 70).length}`} tone="warning" />
          </div>
          <DataCard
            title="Methodology teaser"
            subtitle="How this heatmatrix is built"
            className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-orange-500/10"
          >
            <p className="text-sm leading-relaxed text-slate-300">
              Scores are synthesized from strategic urgency, implementation momentum, market validation, and
              research intensity. Each cell merges quantitative signals with structured expert review to reflect
              both current traction and near-term execution potential.
            </p>
          </DataCard>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section id="key-findings" className="space-y-6">
          <SectionHeader
            label="Key Findings"
            title="Signal clusters worth immediate attention"
            description="Editorial synthesis from the highest-impact intersections in this edition."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {keyFindings.map((finding) => (
              <DataCard key={finding.id} title={finding.title}>
                <p className="text-sm leading-relaxed text-slate-300">{finding.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {finding.evidence.slice(0, 2).map((point) => (
                    <li key={point} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                      {point}
                    </li>
                  ))}
                </ul>
              </DataCard>
            ))}
          </div>
          <Link
            href="/key-findings"
            className="inline-flex rounded-lg border border-orange-300/45 bg-orange-500/15 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/25"
          >
            Read Full Findings
          </Link>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="grid gap-6 xl:grid-cols-3">
          <DataCard title="Featured Technologies" subtitle="Highest strategic momentum">
            <ul className="space-y-3">
              {technologies.slice(0, 5).map((technology) => (
                <li key={technology.slug}>
                  <Link
                    href={`/technology/${technology.slug}`}
                    className="block rounded-lg border border-white/10 bg-slate-900/55 px-3 py-2 text-sm text-slate-200 transition hover:border-orange-300/40 hover:text-orange-100"
                  >
                    <span className="font-semibold">{technology.name}</span>
                    <span className="mt-1 block text-xs text-slate-400">{technology.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </DataCard>

          <DataCard title="Featured Industries" subtitle="Highest average matrix exposure">
            <ul className="space-y-3">
              {leadingIndustries.map(({ industry, avg }) => (
                <li key={industry.slug}>
                  <Link
                    href={`/industry/${industry.slug}`}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/55 px-3 py-2 text-sm text-slate-200 transition hover:border-orange-300/40 hover:text-orange-100"
                  >
                    <span>{industry.name}</span>
                    <span className="font-semibold text-orange-200">{avg}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </DataCard>

          <DataCard title="Notable Hotspots" subtitle="Cells with strongest convergence signals">
            <ul className="space-y-3">
              {hotspots.map((hotspot) => (
                <li key={hotspot.id}>
                  <Link
                    href={`/matrix/${hotspot.technologySlug}/${hotspot.industrySlug}`}
                    className="block rounded-lg border border-white/10 bg-slate-900/55 px-3 py-2 text-sm transition hover:border-orange-300/40"
                  >
                    <p className="font-semibold text-slate-100">{hotspot.summary}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-orange-200">
                      Score {hotspot.score}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </DataCard>
        </section>
      </MotionReveal>
    </div>
  );
}
