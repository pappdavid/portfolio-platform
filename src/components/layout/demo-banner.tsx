import Link from 'next/link';
import { IconEye, IconX } from '@tabler/icons-react';

export function DemoBanner() {
  return (
    <div className='bg-primary/10 border-primary/20 flex items-center justify-between border-b px-4 py-2 text-sm'>
      <div className='flex items-center gap-2'>
        <IconEye className='text-primary size-4 shrink-0' />
        <span className='font-medium'>Demo Mode</span>
        <span className='text-muted-foreground hidden sm:inline'>
          — You are viewing sample data. No account required.
        </span>
      </div>
      <Link
        href='/api/demo?action=exit'
        className='text-muted-foreground hover:text-foreground flex items-center gap-1 rounded px-2 py-0.5 text-xs transition-colors'
        aria-label='Exit demo mode'
      >
        <IconX className='size-3' />
        <span>Exit Demo</span>
      </Link>
    </div>
  );
}
