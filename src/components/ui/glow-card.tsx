'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(120,119,198,0.3)'
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-px transition-colors hover:border-white/[0.15]',
        className
      )}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
    >
      {/* Glow effect */}
      <div
        className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 60%)`
            : 'none'
        }}
      />
      {/* Content */}
      <div className='bg-card relative z-10 h-full rounded-[15px] p-6'>
        {children}
      </div>
    </motion.div>
  );
}
