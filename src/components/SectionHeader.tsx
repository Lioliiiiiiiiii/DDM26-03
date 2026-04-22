import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-300/90">{label}</p>
      ) : null}
      <h2 className="max-w-4xl text-2xl font-semibold leading-tight text-slate-100 md:text-3xl">{title}</h2>
      {description ? (
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">{description}</p>
      ) : null}
    </div>
  );
}
