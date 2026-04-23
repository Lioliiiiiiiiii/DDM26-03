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
    <div ref={matrixContainerRef}>
      <InteractiveHeatmatrix
        technologies={technologies}
        industries={industries}
        cells={cells}
        compact
        gridPreset="homepage"
        cinematicReveal={{ enabled: true, active: revealActive }}
        className="w-full max-w-[760px] border-[#fdba74]/30 bg-slate-950/84 p-2.5 md:p-3"
      />
    </div>
  );
}
