import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const days = Number(req.nextUrl.searchParams.get('days') ?? '30');
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const { data, error } = await supabaseAdmin
    .from('mcp_events')
    .select('*')
    .eq('user_id', userId)
    .gt('created_at', since)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data });
}
