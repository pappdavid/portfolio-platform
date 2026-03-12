import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { demoRefLinks } from '@/constants/demo-data';

export async function GET(req: NextRequest) {
  // Demo mode: return seeded fake referral links (read-only)
  const isDemoMode = req.cookies.get('demo_mode')?.value === 'true';
  if (isDemoMode) {
    return NextResponse.json({ links: demoRefLinks });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: links, error: linksError } = await supabaseAdmin
    .from('ref_links')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

  if (!links || links.length === 0) {
    return NextResponse.json({ links: [] });
  }

  const linkIds = links.map((l) => l.id);
  const { data: events, error: eventsError } = await supabaseAdmin
    .from('ref_events')
    .select('*')
    .in('link_id', linkIds)
    .order('created_at', { ascending: false });

  if (eventsError) {
    return NextResponse.json({ error: eventsError.message }, { status: 500 });
  }

  const linksWithEvents = links.map((link) => ({
    ...link,
    events: (events || []).filter((e) => e.link_id === link.id),
    event_count: (events || []).filter((e) => e.link_id === link.id).length
  }));

  return NextResponse.json({ links: linksWithEvents });
}
