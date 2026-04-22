import { RankingItem } from '@/types/matrix';

type RankingListProps = {
  title: string;
  items: RankingItem[];
};

export function RankingList({ title, items }: RankingListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item, index) => (
          <li key={item.label} className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-200">
                {index + 1}. {item.label}
              </span>
              <span className="font-semibold text-orange-300">{item.score}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300"
                style={{ width: `${item.score}%` }}
                aria-hidden
              />
            </div>
            {item.detail ? <p className="text-xs text-slate-400">{item.detail}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
