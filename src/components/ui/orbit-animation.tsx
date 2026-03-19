'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface OrbitAnimationProps {
  className?: string;
}

export function OrbitAnimation({ className }: OrbitAnimationProps) {
  const rings = [
    { size: 200, duration: 20, opacity: 0.08, delay: 0 },
    { size: 350, duration: 30, opacity: 0.06, delay: -5 },
    { size: 500, duration: 40, opacity: 0.04, delay: -10 }
  ];

  const orbs = [
    { ring: 0, size: 6, color: 'bg-blue-500', duration: 20, startAngle: 0 },
    { ring: 0, size: 4, color: 'bg-cyan-400', duration: 20, startAngle: 180 },
    { ring: 1, size: 8, color: 'bg-purple-500', duration: 30, startAngle: 90 },
    { ring: 1, size: 5, color: 'bg-pink-400', duration: 30, startAngle: 270 },
    { ring: 2, size: 10, color: 'bg-orange-500', duration: 40, startAngle: 45 },
    { ring: 2, size: 6, color: 'bg-red-400', duration: 40, startAngle: 225 }
  ];

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        {/* Rings */}
        {rings.map((ring, i) => (
          <motion.div
            key={`ring-${i}`}
            className='border-foreground/[0.06] absolute top-1/2 left-1/2 rounded-full border'
            style={{
              width: ring.size,
              height: ring.size,
              marginLeft: -ring.size / 2,
              marginTop: -ring.size / 2
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: ring.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: ring.delay
            }}
          />
        ))}

        {/* Orbiting dots */}
        {orbs.map((orb, i) => {
          const ringSize = rings[orb.ring].size;
          const radius = ringSize / 2;
          return (
            <motion.div
              key={`orb-${i}`}
              className='absolute top-1/2 left-1/2'
              style={{
                width: orb.size,
                height: orb.size,
                marginLeft: -orb.size / 2,
                marginTop: -orb.size / 2
              }}
              animate={{
                x: [
                  Math.cos((orb.startAngle * Math.PI) / 180) * radius,
                  Math.cos(((orb.startAngle + 360) * Math.PI) / 180) * radius
                ],
                y: [
                  Math.sin((orb.startAngle * Math.PI) / 180) * radius,
                  Math.sin(((orb.startAngle + 360) * Math.PI) / 180) * radius
                ]
              }}
              transition={{
                duration: orb.duration,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <div
                className={cn('h-full w-full rounded-full', orb.color)}
                style={{
                  boxShadow: `0 0 ${orb.size * 3}px ${orb.size}px currentColor`,
                  filter: 'blur(0.5px)'
                }}
              />
            </motion.div>
          );
        })}

        {/* Center glow */}
        <div className='bg-primary/10 absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl' />
      </div>
    </div>
  );
}
