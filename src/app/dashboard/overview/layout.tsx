import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import {
  IconShieldCheck,
  IconDatabase,
  IconMessageCircle,
  IconKey,
  IconInfoCircle
} from '@tabler/icons-react';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import Link from 'next/link';
import React from 'react';

async function getStats(userId: string) {
  const [mcpRes, datasetsRes, keysRes] = await Promise.all([
    supabaseAdmin
      .from('mcp_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabaseAdmin
      .from('datasets')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabaseAdmin
      .from('mcp_api_keys')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('revoked_at', null)
  ]);
  return {
    mcpCalls: mcpRes.count ?? 0,
    datasets: datasetsRes.count ?? 0,
    activeKeys: keysRes.count ?? 0
  };
}

export default async function OverViewLayout({
  pie_stats,
  bar_stats,
  area_stats
}: {
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const { userId } = await auth();
  const stats = userId
    ? await getStats(userId)
    : { mcpCalls: 0, datasets: 0, activeKeys: 0 };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        {!userId && (
          <div className='bg-muted/60 border-border flex items-center gap-3 rounded-lg border px-4 py-3 text-sm'>
            <IconInfoCircle className='text-muted-foreground h-4 w-4 shrink-0' />
            <span className='text-muted-foreground flex-1'>
              You&apos;re viewing a read-only demo. Real data appears after
              sign-in.
            </span>
            <Button asChild size='sm' variant='outline'>
              <Link href='/auth/sign-in'>Sign in</Link>
            </Button>
          </div>
        )}
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Dashboard Overview
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>MCP Calls</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.mcpCalls.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconShieldCheck className='size-3.5' />
                  Sentinel
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>
                Total tool call events logged
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Datasets Generated</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.datasets.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconDatabase className='size-3.5' />
                  Training
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>
                JSONL datasets from code repos
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Chat Sessions</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                —
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconMessageCircle className='size-3.5' />
                  Coming Soon
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>
                Persistent chat history not yet enabled
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Active API Keys</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {stats.activeKeys}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconKey className='size-3.5' />
                  Keys
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>Non-revoked MCP keys</div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-7'>{bar_stats}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
