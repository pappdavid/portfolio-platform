import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: links, error: linksError } = await supabaseAdmin
    .from('ref_links')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', { ascending: false });

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

  if (!links || links.length === 0) {
    return NextResponse.json({ links: [] });
  }

  return NextResponse.json({
    links: links.map((link) => ({
      ...link,
      events: [],
      event_count:
        Number(link.legacy_visit_count || 0) +
        Number(link.consented_visit_count || 0)
    }))
  });
}
