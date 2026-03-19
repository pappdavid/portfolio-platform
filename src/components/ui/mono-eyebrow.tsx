import { cn } from '@/lib/utils';

interface MonoEyebrowProps {
  children: React.ReactNode;
  color?: 'green' | 'purple' | 'orange';
  className?: string;
}

const colorMap = {
  green: 'border-[#22c55e]/30 bg-[rgba(34,197,94,0.08)] text-[#22c55e]',
  purple: 'border-[#a855f7]/30 bg-[rgba(168,85,247,0.08)] text-[#a855f7]',
  orange: 'border-[#f97316]/30 bg-[rgba(249,115,22,0.08)] text-[#f97316]'
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
