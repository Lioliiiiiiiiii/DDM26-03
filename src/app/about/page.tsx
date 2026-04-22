import type { Metadata } from 'next';
import { aboutContent } from '@/data';
import { DataCard } from '@/components/DataCard';
import { ExpandableAccordionSection } from '@/components/ExpandableAccordionSection';
import { MotionReveal } from '@/components/MotionReveal';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the Digital Disruption Matrix, audience, methodology, and research framework.'
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <MotionReveal>
        <SectionHeader
          label="About"
          title="Digital Disruption Matrix 2026"
          description={aboutContent.intro}
        />
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <div className="grid gap-4 md:grid-cols-2">
          <DataCard title="Who this is for">
            <ul className="space-y-2 text-sm text-slate-300">
              {aboutContent.audience.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 bg-slate-900/55 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </DataCard>
          <DataCard title="How to interpret the matrix">
            <ul className="space-y-2 text-sm text-slate-300">
              {aboutContent.interpretation.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 bg-slate-900/55 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </DataCard>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.12}>
        <div className="space-y-4">
          <ExpandableAccordionSection
            title="Methodology summary"
            summary="Scoring logic, weighting pillars, and validation mechanics."
            defaultOpen
          >
            <ul className="space-y-2 text-sm text-slate-300">
              {aboutContent.methodology.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ExpandableAccordionSection>
          <ExpandableAccordionSection
            title="Research approach"
            summary="How qualitative and quantitative evidence are combined."
          >
            <ul className="space-y-2 text-sm text-slate-300">
              {aboutContent.researchApproach.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ExpandableAccordionSection>
          <DataCard title="Editorial and institutional context">
            <p className="text-sm leading-relaxed text-slate-300">{aboutContent.institutionalContext}</p>
          </DataCard>
        </div>
      </MotionReveal>
    </div>
  );
}
