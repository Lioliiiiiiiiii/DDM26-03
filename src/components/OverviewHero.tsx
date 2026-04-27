import Link from 'next/link';

type OverviewHeroProps = {
  label: 'Industry Overview' | 'Technology Overview';
  title: string;
  definition: string;
  perspectiveTitle: string;
};

const PERSPECTIVE_PLACEHOLDER =
  "This perspective section will summarize the Chair's interpretation of the signals behind this page. It will connect the quantitative matrix results with expert judgment, sector context, and implementation realities. The final editorial version should explain what matters strategically, where uncertainty remains, and what leaders should watch next. This placeholder will be replaced once the Chair's commentary is finalized.";

export function OverviewHero({ label, title, definition, perspectiveTitle }: OverviewHeroProps) {
  return (
    <section className="relative overflow-hidden pb-8 pt-1 md:pb-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-orange-500/10 to-transparent" />

      <div className="relative">
        <Link
          href="/"
          className="inline-flex rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-orange-300/45 hover:text-orange-100"
        >
          Back to Heatmatrix
        </Link>

        <div className="mt-8 max-w-5xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300/90">{label}</p>
          <h1 className="text-4xl font-extrabold leading-[0.98] tracking-tight text-slate-100 md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {definition ? (
            <p className="max-w-4xl text-base leading-8 text-slate-300 md:text-lg md:leading-9">{definition}</p>
          ) : null}
        </div>

        <div className="mt-10 max-w-4xl border-l border-orange-300/40 pl-5 md:mt-12 md:pl-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">{perspectiveTitle}</p>
          <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg md:leading-9">
            {PERSPECTIVE_PLACEHOLDER}
          </p>
        </div>
      </div>
    </section>
  );
}
