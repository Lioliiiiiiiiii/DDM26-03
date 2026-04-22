'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

type ExpandableAccordionSectionProps = {
  title: string;
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function ExpandableAccordionSection({
  title,
  summary,
  children,
  defaultOpen = false
}: ExpandableAccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/65 p-4 md:p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-100 md:text-lg">{title}</h3>
          <p className="text-sm text-slate-300">{summary}</p>
        </div>
        <span
          aria-hidden
          className={cn(
            'mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center text-orange-300 transition-transform',
            open && 'rotate-180'
          )}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M5.7 7.7a1 1 0 0 1 1.4 0L10 10.6l2.9-2.9a1 1 0 1 1 1.4 1.4l-3.6 3.6a1 1 0 0 1-1.4 0L5.7 9.1a1 1 0 0 1 0-1.4Z" />
          </svg>
        </span>
      </button>
      {open ? <div className="mt-4 border-t border-white/10 pt-4">{children}</div> : null}
    </section>
  );
}
