'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type FloatingPathsProps = {
  position: number;
};

type BackgroundLinesProps = {
  className?: string;
};

function FloatingPaths({ position }: FloatingPathsProps) {
  const paths = useMemo(
    () => {
      const colors = ['#d34c10', '#ff7f2a', '#ffc285'];
      return (
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        d: `M-${380 - index * 5 * position} -${189 + index * 6}C-${
          380 - index * 5 * position
        } -${189 + index * 6} -${312 - index * 5 * position} ${216 - index * 6} ${
          152 - index * 5 * position
        } ${343 - index * 6}C${616 - index * 5 * position} ${470 - index * 6} ${
          684 - index * 5 * position
        } ${875 - index * 6} ${684 - index * 5 * position} ${875 - index * 6}`,
        color: colors[index % colors.length],
        width: 0.5 + index * 0.03,
        duration: 20 + ((index * 1.9 + (position === 1 ? 0 : 3.2)) % 9),
        delay: index * 0.04
      }))
    );
    },
    [position]
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="h-full w-full" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        {paths.map((path) => (
          <motion.path
            key={`${position}-${path.id}`}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.4}
            initial={{ pathLength: 0.3, opacity: 0.58 }}
            animate={{
              pathLength: 1,
              opacity: [0.5, 1, 0.5],
              pathOffset: [0, 1, 0]
            }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundLines({ className }: BackgroundLinesProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
