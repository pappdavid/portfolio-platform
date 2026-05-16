import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { datasetId, apiKey } = body as {
    datasetId?: string;
    apiKey?: string;
  };

  const { data, error } = await supabaseAdmin
    .from('training_jobs')
    .insert({
      user_id: userId,
      dataset_id: datasetId ?? null,
      provider: 'openai',
      model: 'llama-3.1-8b',
      preset: 'qa',
      status: 'queued',
      ...(apiKey ? { api_key: apiKey } : {})
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ jobId: data.id });
}
