'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { IconMenu2 } from '@tabler/icons-react';
import { publicNavItems } from '@/config/nav-config';

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <header className='sticky top-0 z-50 border-b border-white/[0.07] bg-[#060608]/90 backdrop-blur-sm'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-6'>
        <Link
          href='/'
          className='font-mono text-sm font-medium tracking-tight text-white'
        >
          David<span className='text-[#22c55e]'>_</span>Papp
        </Link>

        {/* Desktop nav */}
        <nav className='hidden items-center gap-1 md:flex'>
          {publicNavItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium text-[#71717a] transition-colors hover:text-white',
                pathname === item.url && 'text-white'
              )}
            >
              {item.title}
            </Link>
          ))}
          <a
            href='mailto:contact@davidpapp.dev'
            className='ml-2 rounded-lg border border-white/10 bg-white/[0.08] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.12]'
          >
            Contact
          </a>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className='md:hidden'>
            <button className='rounded-md p-2 text-[#71717a] hover:text-white'>
              <IconMenu2 className='h-5 w-5' />
            </button>
          </SheetTrigger>
          <SheetContent
            side='right'
            className='w-72 border-white/[0.07] bg-[#0a0a0c]'
          >
            <nav className='mt-8 flex flex-col gap-2'>
              {publicNavItems.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium text-[#71717a] transition-colors hover:text-white',
                    pathname === item.url && 'text-white'
                  )}
                >
                  {item.title}
                </Link>
              ))}
              <a
                href='mailto:contact@davidpapp.dev'
                onClick={() => setOpen(false)}
                className='mt-4 rounded-lg bg-[#22c55e] px-4 py-2 text-center text-sm font-semibold text-black'
              >
                Contact
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
