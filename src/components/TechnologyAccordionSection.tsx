'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

type TechnologyAccordionSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function TechnologyAccordionSection({
  title,
  children,
  defaultOpen = false
}: TechnologyAccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3 text-left text-ink transition hover:brightness-105"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold tracking-[0.02em]">{title}</span>
        <span
          aria-hidden
          className={cn(
            'inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-950/80 text-amber-200 transition-transform',
            open && 'rotate-180'
          )}
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
            <path d="M5.7 7.7a1 1 0 0 1 1.4 0L10 10.6l2.9-2.9a1 1 0 1 1 1.4 1.4l-3.6 3.6a1 1 0 0 1-1.4 0L5.7 9.1a1 1 0 0 1 0-1.4Z" />
          </svg>
        </span>
      </button>
      {open ? <div className="space-y-4 p-4 md:p-5">{children}</div> : null}
    </section>
  );
}
