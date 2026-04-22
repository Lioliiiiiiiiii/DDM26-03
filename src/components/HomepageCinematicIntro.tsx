'use client';

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BackgroundLines } from '@/components/BackgroundLines';
import { InteractiveHeatmatrix } from '@/components/InteractiveHeatmatrix';
import { cn } from '@/lib/utils';
import { HomepageIntroContent, Industry, MatrixCell, Technology } from '@/types/matrix';

type HomepageCinematicIntroProps = {
  intro: HomepageIntroContent;
  technologies: Technology[];
  industries: Industry[];
  cells: MatrixCell[];
};

type NoiseLayout = {
  text: string;
  x: number;
  y: number;
  scale: number;
  driftX: number;
};

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

function CharReveal({
  char,
  index,
  total,
  scrollYProgress,
  emphasize,
  reducedMotion,
  rangeStart = 0.14,
  spread = 0.18,
  revealDuration = 0.05
}: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  emphasize: 'none' | 'noise' | 'loud' | 'out';
  reducedMotion: boolean;
  rangeStart?: number;
  spread?: number;
  revealDuration?: number;
}) {
  const start = rangeStart + (index / total) * spread;
  const end = start + revealDuration;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  if (reducedMotion) {
    return (
      <span
        className={cn(
          emphasize === 'noise' && 'text-[#fdba74]',
          emphasize === 'loud' && 'font-extrabold text-[#f97316] underline decoration-2 underline-offset-8 decoration-[#fb923c]',
          emphasize === 'out' && 'text-[#f97316]'
        )}
      >
        {char}
      </span>
    );
  }

  return (
    <motion.span
      style={{ opacity }}
      className={cn(
        emphasize === 'noise' && 'text-[#fdba74]',
        emphasize === 'loud' && 'font-extrabold text-[#f97316] underline decoration-2 underline-offset-8 decoration-[#fb923c]',
        emphasize === 'out' && 'text-[#f97316]'
      )}
    >
      {char}
    </motion.span>
  );
}

function NoiseSnippet({
  item,
  index,
  total,
  scrollYProgress,
  reducedMotion
}: {
  item: NoiseLayout;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  reducedMotion: boolean;
}) {
  const start = 0.38 + (index / total) * 0.24;
  const end = start + 0.02;
  const opacity = useTransform(scrollYProgress, [start, end, 0.7, 0.78], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [0.72, 0.8], [0, item.driftX]);
  const y = useTransform(scrollYProgress, [0.72, 0.8], [0, -8]);

  if (reducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="absolute inline-flex whitespace-nowrap rounded-full border border-[#fed7aa]/45 bg-[#ffedd5]/14 px-4 py-1 text-[11px] font-medium text-[#fdba74] shadow-[0_0_18px_rgba(251,146,60,0.12)] md:text-xs"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        opacity,
        x,
        y,
        fontSize: `${item.scale}rem`
      }}
    >
      {item.text}
    </motion.div>
  );
}

export function HomepageCinematicIntro({
  intro,
  technologies,
  industries,
  cells
}: HomepageCinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });
  const [matrixRevealActive, setMatrixRevealActive] = useState(Boolean(reduceMotion));
  const [matrixRevealResetKey, setMatrixRevealResetKey] = useState(0);
  const matrixRevealActiveRef = useRef(matrixRevealActive);

  const introOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.07], [1, 0.985]);

  const typewriterOpacity = useTransform(scrollYProgress, [0.11, 0.2, 0.44, 0.52], [0, 1, 1, 0]);
  const typewriterY = useTransform(scrollYProgress, [0.11, 0.45], [12, -8]);

  const sortOpacity = useTransform(scrollYProgress, [0.58, 0.67, 0.82, 0.89, 0.93], [0, 1, 1, 0.08, 0.05]);
  const sortY = useTransform(scrollYProgress, [0.58, 0.67, 0.82, 0.89, 0.93], [26, 0, 0, -24, -32]);

  const matrixOpacity = useTransform(scrollYProgress, [0.89, 0.93, 0.975, 1], [0, 0.12, 0.86, 1]);
  const matrixY = useTransform(scrollYProgress, [0.89, 0.93, 0.975, 1], [48, 24, 6, 0]);
  const matrixScale = useTransform(scrollYProgress, [0.89, 0.93, 0.975, 1], [0.8, 0.84, 0.91, 0.94]);

  const overlaysOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.16, 0.16, 0.16, 0]);
  const linesOpacity = useTransform(scrollYProgress, [0, 0.2, 0.55, 1], [0.82, 0.68, 0.52, 0.34]);

  const noiseLayout = useMemo(
    () =>
      intro.noiseStatements.map((text, index) => {
        const rng = makeRng(hashString(`${text}-${index}`));
        return {
          text,
          x: 6 + rng() * 88,
          y: 12 + rng() * 76,
          scale: 0.66 + rng() * 0.22,
          driftX: (rng() - 0.5) * 120
        } satisfies NoiseLayout;
      }),
    [intro.noiseStatements]
  );

  useEffect(() => {
    matrixRevealActiveRef.current = matrixRevealActive;
  }, [matrixRevealActive]);

  useEffect(() => {
    if (reduceMotion) {
      setMatrixRevealActive(true);
    }
  }, [reduceMotion]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (reduceMotion) {
      return;
    }

    if (latest > 0.965 && !matrixRevealActiveRef.current) {
      setMatrixRevealActive(true);
      return;
    }

    if (latest < 0.82 && matrixRevealActiveRef.current) {
      setMatrixRevealActive(false);
      setMatrixRevealResetKey((value) => value + 1);
    }
  });

  const typewriterLine = intro.typewriterLine;
  const sortLine = intro.sortHeadline;
  const sortSubtext = intro.sortSummary;

  return (
    <section
      ref={containerRef}
      className="relative left-1/2 right-1/2 -mx-[50vw] h-[680vh] w-screen"
      aria-label="Cinematic introduction"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] w-full overflow-hidden border-y border-white/10 bg-[#06090f]">
        <motion.div
          className="absolute left-0 top-0 z-40 h-1 bg-gradient-to-r from-[#fed7aa] via-[#fb923c] to-[#c2410c]"
          style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
        />

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(249,115,22,0.2),transparent_42%),radial-gradient(circle_at_72%_8%,rgba(251,191,36,0.14),transparent_32%),linear-gradient(120deg,#05070d_0%,#0b121c_48%,#0f1624_100%)]" />
          <motion.div className="absolute inset-0" style={{ opacity: linesOpacity }}>
            <BackgroundLines className="z-[2] mix-blend-screen" />
          </motion.div>
          <motion.div
            className="absolute -left-[16%] top-[-18%] h-[56vh] w-[56vh] rounded-full bg-orange-500/20 blur-[110px]"
            style={{ x: useTransform(scrollYProgress, [0, 1], [-30, 80]) }}
          />
          <motion.div
            className="absolute right-[-16%] top-[8%] h-[44vh] w-[44vh] rounded-full bg-amber-400/20 blur-[100px]"
            style={{ x: useTransform(scrollYProgress, [0, 1], [40, -80]) }}
          />
        </div>

        <motion.div className="pointer-events-none absolute inset-0 z-20" style={{ opacity: overlaysOpacity }}>
          <div className="absolute left-[6%] top-[15%] rotate-[-4deg] border border-white/20 bg-slate-900/65 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-200">
            SIGNAL STREAMS ACTIVE
          </div>
          <div className="absolute bottom-[12%] right-[8%] rotate-[10deg] border border-white/20 bg-slate-900/65 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-200">
            DDM / 2026 INDEX
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 md:px-16"
          style={{ opacity: introOpacity, scale: introScale }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#fdba74] md:text-sm">
            {intro.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-5xl text-5xl font-extrabold tracking-tight text-slate-100 md:text-7xl lg:text-[7.5vw] lg:leading-[0.95]">
            {intro.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-xl">{intro.heroSubtitle}</p>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center px-7 text-center md:px-16"
          style={{ opacity: typewriterOpacity, y: typewriterY }}
        >
          <p className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-100 md:text-5xl">
            {typewriterLine.split('').map((char, index) => {
              const marker = typewriterLine.toLowerCase();
              const isNoiseChar = marker.slice(Math.max(0, index - 4), index + 5).includes('noise');
              const isLoudChar = marker.slice(Math.max(0, index - 3), index + 4).includes('loud');

              return (
                <CharReveal
                  key={`char-${index}`}
                  char={char}
                  index={index}
                  total={typewriterLine.length}
                  scrollYProgress={scrollYProgress}
                  reducedMotion={Boolean(reduceMotion)}
                  emphasize={isLoudChar ? 'loud' : isNoiseChar ? 'noise' : 'none'}
                />
              );
            })}
          </p>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-10">
          {noiseLayout.map((item, index) => (
            <NoiseSnippet
              key={`${item.text}-${index}`}
              item={item}
              index={index}
              total={noiseLayout.length}
              scrollYProgress={scrollYProgress}
              reducedMotion={Boolean(reduceMotion)}
            />
          ))}
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
          style={{ opacity: sortOpacity, y: sortY }}
        >
          <div>
            <h2 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-100 md:text-5xl">
              {sortLine.split('').map((char, index) => {
                const marker = sortLine.toLowerCase();
                const isOut = marker.slice(Math.max(0, index - 2), index + 3).includes('out');

                return (
                  <CharReveal
                    key={`sort-char-${index}`}
                    char={char}
                    index={index}
                    total={sortLine.length}
                    scrollYProgress={scrollYProgress}
                    reducedMotion={Boolean(reduceMotion)}
                    emphasize={isOut ? 'out' : 'none'}
                    rangeStart={0.6}
                    spread={0.11}
                    revealDuration={0.055}
                  />
                );
              })}
            </h2>
            <p className="mt-4 max-w-3xl text-sm text-[#fed7aa] md:text-base">
              {sortSubtext.split('').map((char, index) => (
                <CharReveal
                  key={`sort-sub-char-${index}`}
                  char={char}
                  index={index}
                  total={sortSubtext.length}
                  scrollYProgress={scrollYProgress}
                  reducedMotion={Boolean(reduceMotion)}
                  emphasize="none"
                  rangeStart={0.63}
                  spread={0.13}
                  revealDuration={0.05}
                />
              ))}
            </p>
          </div>
        </motion.div>

        <motion.div
          id="heatmatrix"
          className="absolute inset-0 z-30 flex items-center justify-center px-4 pb-6 pt-10 md:px-8"
          style={{ opacity: matrixOpacity, y: matrixY, scale: matrixScale, transformOrigin: '50% 18%' }}
        >
          <InteractiveHeatmatrix
            technologies={technologies}
            industries={industries}
            cells={cells}
            compact
            showLegend={false}
            cinematicReveal={{
              enabled: true,
              active: matrixRevealActive,
              resetKey: matrixRevealResetKey
            }}
            className="w-full max-w-[860px] border-[#fdba74]/30 bg-slate-950/84"
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-7 left-1/2 z-30 -translate-x-1/2 text-[10px] uppercase tracking-[0.34em] text-slate-300"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [0.44, 0]) }}
        >
          {intro.scrollHint}
        </motion.div>
      </div>
    </section>
  );
}
