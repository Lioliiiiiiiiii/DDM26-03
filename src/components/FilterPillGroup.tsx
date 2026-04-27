'use client';

import { cn } from '@/lib/utils';

export type FilterPillOption = {
  slug: string;
  name: string;
};

type FilterPillGroupProps = {
  options: FilterPillOption[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  ariaLabel: string;
  className?: string;
};

export function FilterPillGroup({
  options,
  selectedSlug,
  onSelect,
  ariaLabel,
  className
}: FilterPillGroupProps) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = option.slug === selectedSlug;

        return (
          <button
            key={option.slug}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.slug)}
            className={cn(
              'rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] transition',
              isActive
                ? 'border-orange-300/60 bg-orange-500/20 text-orange-100'
                : 'border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/20 hover:text-slate-100'
            )}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}
