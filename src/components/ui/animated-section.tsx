'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 40,
  once = true
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 }
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, ...offset }}
      animate={
        isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }
      }
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      {children}
    </motion.div>
  );
}
