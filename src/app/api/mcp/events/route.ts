import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { demoMcpEvents } from '@/constants/demo-data';

export async function GET(req: NextRequest) {
  // Demo mode: return seeded fake events (read-only)
  const isDemoMode = req.cookies.get('demo_mode')?.value === 'true';
  if (isDemoMode) {
    return NextResponse.json({ events: demoMcpEvents });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('mcp_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data });
}
