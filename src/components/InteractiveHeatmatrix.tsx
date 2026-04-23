'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Industry, MatrixCell, Technology } from '@/types/matrix';
import { cn } from '@/lib/utils';
import { getMatrixColor } from '@/lib/matrix';

type InteractiveHeatmatrixProps = {
  technologies: Technology[];
  industries: Industry[];
  cells: MatrixCell[];
  className?: string;
  compact?: boolean;
  showLegend?: boolean;
  highlightTechnologySlug?: string;
  highlightIndustrySlug?: string;
  highlightCellId?: string;
  cinematicReveal?: {
    enabled: boolean;
    active: boolean;
    resetKey?: number;
  };
};

type HoverState = {
  cell: MatrixCell;
  x: number;
  y: number;
} | null;

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const makeRng = (seed: number) => {
  let state = seed;
  return () => {
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
};

export function InteractiveHeatmatrix({
  technologies,
  industries,
  cells,
  className,
  compact = false,
  showLegend = true,
  highlightTechnologySlug,
  highlightIndustrySlug,
  highlightCellId,
  cinematicReveal
}: InteractiveHeatmatrixProps) {
  const [hovered, setHovered] = useState<HoverState>(null);
  const rowLabelWidth = compact ? 170 : 190;
  const cellWidth = compact ? 92 : 112;
  const cellHeight = compact ? 58 : 64;
  const cinematicEnabled = Boolean(cinematicReveal?.enabled);
  const cinematicActive = Boolean(cinematicReveal?.active);

  const cellMap = useMemo(
    () =>
      new Map(cells.map((cell) => [`${cell.technologySlug}::${cell.industrySlug}`, cell])) as Map<
        string,
        MatrixCell
      >,
    [cells]
  );

  const orderedCellKeys = useMemo(
    () =>
      industries.flatMap((industry) =>
        technologies.map((technology) => `${technology.slug}::${industry.slug}`)
      ),
    [industries, technologies]
  );

  const [cellRevealState, setCellRevealState] = useState<Record<string, 0 | 1 | 2>>({});
  const [labelsVisible, setLabelsVisible] = useState(!cinematicEnabled);
  const revealTimersRef = useRef<number[]>([]);

  const clearRevealTimers = () => {
    revealTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    revealTimersRef.current = [];
  };

  useEffect(() => {
    if (!cinematicEnabled) {
      clearRevealTimers();
      setCellRevealState({});
      setLabelsVisible(true);
      return;
    }

    clearRevealTimers();
    setHovered(null);
    setLabelsVisible(false);
    setCellRevealState(
      Object.fromEntries(orderedCellKeys.map((key) => [key, 0])) as Record<string, 0 | 1 | 2>
    );

    if (!cinematicActive) {
      return;
    }

    const seed = hashString(`ddm-cinematic-${cinematicReveal?.resetKey ?? 0}`);
    const rng = makeRng(seed);
    const order = [...orderedCellKeys];

    for (let index = order.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }

    order.forEach((key, index) => {
      const startDelay = index * 32;
      const lockDelay = startDelay + 170 + Math.round(rng() * 90);

      revealTimersRef.current.push(
        window.setTimeout(() => {
          setCellRevealState((previous) => ({ ...previous, [key]: 1 }));
        }, startDelay)
      );

      revealTimersRef.current.push(
        window.setTimeout(() => {
          setCellRevealState((previous) => ({ ...previous, [key]: 2 }));
        }, lockDelay)
      );
    });

    const labelsDelay = order.length * 32 + 320;
    revealTimersRef.current.push(
      window.setTimeout(() => {
        setLabelsVisible(true);
      }, labelsDelay)
    );

    return () => {
      clearRevealTimers();
    };
  }, [cinematicActive, cinematicEnabled, cinematicReveal?.resetKey, orderedCellKeys]);

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[940px] rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-panel md:p-6',
        className
      )}
    >
      <div className="relative overflow-x-auto">
        <div className="mx-auto w-fit min-w-[720px]">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `${rowLabelWidth}px repeat(${technologies.length}, minmax(${cellWidth}px, 1fr))`
            }}
          >
            <div
              className={cn(
                'sticky left-0 z-20 rounded-xl border border-transparent bg-slate-950/90 p-3 transition duration-300',
                cinematicEnabled && !labelsVisible && 'pointer-events-none translate-y-1 opacity-0'
              )}
            />
            {technologies.map((technology) => {
              const active = technology.slug === highlightTechnologySlug;

              return (
                <Link
                  key={technology.slug}
                  href={`/technology/${technology.slug}`}
                  className={cn(
                    'rounded-xl border p-2.5 text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] transition duration-300 whitespace-normal break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/80 md:p-3 md:text-xs',
                    active
                      ? 'border-orange-300/70 bg-orange-500/15 text-orange-100'
                      : 'border-white/10 bg-slate-900/70 text-slate-200 hover:border-orange-300/50 hover:text-orange-100',
                    cinematicEnabled && !labelsVisible && 'pointer-events-none translate-y-1 opacity-0'
                  )}
                  tabIndex={cinematicEnabled && !labelsVisible ? -1 : undefined}
                >
                  {technology.shortName}
                </Link>
              );
            })}

            {industries.map((industry) => {
              const rowActive = industry.slug === highlightIndustrySlug;

              return (
                <Fragment key={industry.slug}>
                  <Link
                    href={`/industry/${industry.slug}`}
                    className={cn(
                      'sticky left-0 z-20 rounded-xl border p-3 text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/80',
                      rowActive
                        ? 'border-orange-300/70 bg-orange-500/15 text-orange-100'
                        : 'border-white/10 bg-slate-900/80 text-slate-200 hover:border-orange-300/40 hover:text-orange-100',
                      cinematicEnabled && !labelsVisible && 'pointer-events-none translate-y-1 opacity-0'
                    )}
                    tabIndex={cinematicEnabled && !labelsVisible ? -1 : undefined}
                  >
                    {industry.name}
                  </Link>
                  {technologies.map((technology) => {
                    const key = `${technology.slug}::${industry.slug}`;
                    const cell = cellMap.get(key);
                    const revealState = cinematicEnabled ? (cellRevealState[key] ?? 0) : 2;
                    const hiddenCell = revealState === 0;
                    const flickerCell = revealState === 1;
                    if (!cell) {
                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-white/10 bg-slate-900/60"
                          style={{ height: `${cellHeight}px` }}
                        />
                      );
                    }

                    const isHighlighted =
                      cell.id === highlightCellId ||
                      cell.technologySlug === highlightTechnologySlug ||
                      cell.industrySlug === highlightIndustrySlug;

                    return (
                      <Link
                        href={`/matrix/${technology.slug}/${industry.slug}`}
                        key={key}
                        className={cn(
                          'group relative overflow-hidden rounded-xl border bg-gradient-to-br text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/80',
                          getMatrixColor(cell.score),
                          isHighlighted
                            ? 'border-orange-300/75 shadow-glow'
                            : 'border-white/10 hover:-translate-y-0.5 hover:border-orange-300/45 hover:shadow-glow',
                          hiddenCell && 'pointer-events-none scale-[0.96] opacity-0',
                          flickerCell && 'heat-flicker'
                        )}
                        style={{ height: `${cellHeight}px` }}
                        onMouseEnter={(event) => {
                          if (hiddenCell) {
                            return;
                          }
                          const bounds = event.currentTarget.getBoundingClientRect();
                          setHovered({
                            cell,
                            x: bounds.left + bounds.width / 2,
                            y: bounds.top - 12
                          });
                        }}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={(event) => {
                          if (hiddenCell) {
                            return;
                          }
                          const bounds = event.currentTarget.getBoundingClientRect();
                          setHovered({
                            cell,
                            x: bounds.left + bounds.width / 2,
                            y: bounds.top - 12
                          });
                        }}
                        onBlur={() => setHovered(null)}
                        aria-label={`${technology.name} x ${industry.name}: score ${cell.score}`}
                        tabIndex={hiddenCell ? -1 : undefined}
                      >
                        <span className="sr-only">{`${technology.name} x ${industry.name}`}</span>
                        <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                          <span className="absolute inset-0 bg-white/10" />
                        </span>
                      </Link>
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {hovered ? (
            <motion.div
              key={hovered.cell.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none fixed z-[70] w-72 rounded-xl border border-orange-300/45 bg-slate-900/95 p-3 shadow-glow"
              style={{ top: hovered.y, left: hovered.x, transform: 'translate(-50%, -100%)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">Quick View</p>
              <p className="mt-1 text-sm text-slate-100">{hovered.cell.summary}</p>
              <p className="mt-2 text-xs text-slate-300">Matrix score: {hovered.cell.score}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {showLegend ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
          <span className="font-semibold uppercase tracking-[0.16em] text-slate-400">Intensity</span>
          <div className="ml-1 flex items-center gap-1">
            <span className="h-3 w-8 rounded-sm bg-gradient-to-r from-[#ffedd5] to-[#fed7aa]" />
            <span className="h-3 w-8 rounded-sm bg-gradient-to-r from-[#fed7aa] to-[#fdba74]" />
            <span className="h-3 w-8 rounded-sm bg-gradient-to-r from-[#fdba74] to-[#fb923c]" />
            <span className="h-3 w-8 rounded-sm bg-gradient-to-r from-[#fb923c] to-[#f97316]" />
            <span className="h-3 w-8 rounded-sm bg-gradient-to-r from-[#f97316] to-[#ea580c]" />
            <span className="h-3 w-8 rounded-sm bg-gradient-to-r from-[#ea580c] to-[#c2410c]" />
          </div>
          <span className="text-slate-400">Low</span>
          <span className="text-slate-400">Medium</span>
          <span className="text-slate-400">High</span>
        </div>
      ) : null}
    </div>
  );
}
