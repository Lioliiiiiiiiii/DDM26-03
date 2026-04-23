'use client';

import { useEffect, useRef, useState } from 'react';
import { InteractiveHeatmatrix } from '@/components/InteractiveHeatmatrix';
import { Industry, MatrixCell, Technology } from '@/types/matrix';

type HomepageMethodologyMatrixProps = {
  technologies: Technology[];
  industries: Industry[];
  cells: MatrixCell[];
};

export function HomepageMethodologyMatrix({
  technologies,
  industries,
  cells
}: HomepageMethodologyMatrixProps) {
  const matrixContainerRef = useRef<HTMLDivElement>(null);
  const [revealActive, setRevealActive] = useState(false);

  useEffect(() => {
    const element = matrixContainerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setRevealActive(true);
        observer.disconnect();
      },
      {
        threshold: 0.25,
        rootMargin: '-6% 0px -10% 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={matrixContainerRef} className="space-y-4">
      <div className="space-y-3">
        <h2 className="max-w-4xl text-2xl font-semibold leading-tight text-slate-100 md:text-3xl">
          Explore our Heatmatrix
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-orange-200/90 md:text-base">
          Interactive analysis of 5 disruptive technologies reshaping 10 industry sectors. Click to explore
          our dynamic dataset and reveal strategic insights across technologies, sectors, and their
          intersections.
        </p>
      </div>
      <InteractiveHeatmatrix
        technologies={technologies}
        industries={industries}
        cells={cells}
        compact
        gridPreset="homepage"
        cinematicReveal={{ enabled: true, active: revealActive }}
        className="w-full max-w-[900px] border-[#fdba74]/30 bg-slate-950/84 p-2.5 md:p-3"
      />
    </div>
  );
}
