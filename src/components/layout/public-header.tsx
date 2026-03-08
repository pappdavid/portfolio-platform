'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { publicNavItems } from '@/config/nav-config';

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className='border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4'>
        <Link href='/' className='text-lg font-bold tracking-tight'>
          David Papp
        </Link>

        {/* Desktop nav */}
        <nav className='hidden items-center gap-1 md:flex'>
          {publicNavItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.url && 'text-foreground'
              )}
            >
              {item.title}
            </Link>
          ))}
          <Button asChild size='sm' className='ml-2'>
            <Link href='/dashboard/overview'>Dashboard</Link>
          </Button>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className='md:hidden'>
            <Button variant='ghost' size='icon'>
              <IconMenu2 className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='w-72'>
            <nav className='mt-8 flex flex-col gap-2'>
              {publicNavItems.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.url && 'text-foreground'
                  )}
                >
                  {item.title}
                </Link>
              ))}
              <Button asChild size='sm' className='mt-4'>
                <Link href='/dashboard/overview'>Dashboard</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
