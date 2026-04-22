import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DataCardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function DataCard({ title, subtitle, children, className }: DataCardProps) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/70 p-5 shadow-panel backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300/35 hover:shadow-glow',
        className
      )}
    >
      {(title || subtitle) && (
        <header className="mb-4 space-y-1">
          {title ? <h3 className="text-base font-semibold text-slate-100">{title}</h3> : null}
          {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </article>
  );
}
