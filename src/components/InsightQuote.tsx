import { Quote } from '@/types/matrix';

export function InsightQuote({ speaker, role, text }: Quote) {
  return (
    <blockquote className="rounded-2xl border border-orange-300/20 bg-gradient-to-r from-orange-500/10 via-amber-400/5 to-transparent p-5 shadow-panel">
      <p className="text-base leading-relaxed text-slate-100">&ldquo;{text}&rdquo;</p>
      <footer className="mt-4">
        <p className="text-sm font-semibold text-orange-200">{speaker}</p>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{role}</p>
      </footer>
    </blockquote>
  );
}
