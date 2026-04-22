'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type MotionRevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
};

export function MotionReveal({ children, delay = 0, y = 22 }: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
