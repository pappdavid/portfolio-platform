import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { demoDatasets, demoTrainingJobs } from '@/constants/demo-data';

export async function GET(req: NextRequest) {
  // Demo mode: return seeded fake datasets and jobs (read-only)
  const isDemoMode = req.cookies.get('demo_mode')?.value === 'true';
  if (isDemoMode) {
    return NextResponse.json({
      datasets: demoDatasets,
      jobs: demoTrainingJobs
    });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: datasets, error: dsError } = await supabaseAdmin
    .from('datasets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (dsError) {
    return NextResponse.json({ error: dsError.message }, { status: 500 });
  }

  const { data: jobs, error: jobsError } = await supabaseAdmin
    .from('training_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (jobsError) {
    return NextResponse.json({ error: jobsError.message }, { status: 500 });
  }

  return NextResponse.json({ datasets: datasets || [], jobs: jobs || [] });
}
