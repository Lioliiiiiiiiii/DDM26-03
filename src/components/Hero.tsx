import Link from 'next/link';
import { heroStats } from '@/data';

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function Hero({ eyebrow, title, description, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-hero-aurora px-6 py-12 shadow-panel md:px-10 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(251,146,60,0.22),transparent_35%)]" aria-hidden />
      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-end">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">{eyebrow}</p>
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-slate-50 md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-200 md:text-base">{description}</p>
          {ctaLabel && ctaHref ? (
            <Link
              href={ctaHref}
              className="inline-flex rounded-lg border border-orange-300/45 bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/30"
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-slate-900/65 px-4 py-3 backdrop-blur-sm"
            >
              <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</dt>
              <dd className="mt-1 text-xl font-semibold text-orange-100">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
