'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  gradient?: string;
  delay?: number;
}

export function AnimatedGradientText({
  text,
  className,
  gradient = 'from-foreground via-primary to-foreground',
  delay = 0
}: AnimatedGradientTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const chars = text.split('');

  return (
    <motion.span
      ref={ref}
      className={cn(
        `inline-block bg-gradient-to-r ${gradient} bg-[length:200%_auto] bg-clip-text text-transparent`,
        className
      )}
      animate={
        isInView ? { backgroundPosition: ['0% center', '200% center'] } : {}
      }
      transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className='inline-block'
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.21, 0.47, 0.32, 0.98]
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
