import { cn } from '@/lib/utils';

interface MonoEyebrowProps {
  children: React.ReactNode;
  color?: 'green' | 'purple' | 'orange';
  className?: string;
}

const colorMap = {
  green: 'border-[#22c55e]/30 bg-[#22c55e]/8 text-[#22c55e]',
  purple: 'border-[#a855f7]/30 bg-[#a855f7]/8 text-[#a855f7]',
  orange: 'border-[#f97316]/30 bg-[#f97316]/8 text-[#f97316]'
};

export function MonoEyebrow({
  children,
  color = 'green',
  className
}: MonoEyebrowProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1',
        'font-mono text-[11px] tracking-[0.06em] uppercase',
        colorMap[color],
        className
      )}
    >
      {children}
    </div>
  );
}
