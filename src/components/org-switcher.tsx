'use client';

import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { IconShieldCheck } from '@tabler/icons-react';

export function OrgSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' asChild>
          <Link href='/dashboard/overview'>
            <div className='bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <IconShieldCheck className='size-4' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>Portfolio</span>
              <span className='text-muted-foreground truncate text-xs'>
                AI Engineering
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
