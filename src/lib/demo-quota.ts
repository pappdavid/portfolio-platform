import { supabaseAdmin } from '@/lib/supabase/admin';

export type DemoType = 'mcp' | 'training' | 'rag';

const DEMO_DEFAULTS: Record<DemoType, number> = {
  mcp: 50,
  training: 3,
  rag: 20
};

const DEMO_DURATION_DAYS = 15;

export class DemoExpiredError extends Error {
  readonly code = 'DEMO_EXPIRED';
  constructor() {
    super('Demo period has expired');
    this.name = 'DemoExpiredError';
  }
}

export class QuotaExhaustedError extends Error {
  readonly code = 'QUOTA_EXHAUSTED';
  constructor() {
    super('Demo quota exhausted');
    this.name = 'QuotaExhaustedError';
  }
}

export interface QuotaInfo {
  id: string;
  companyId: string;
  demoType: DemoType;
  remaining: number;
  status: string;
  startAt: string;
  endAt: string;
}

/**
 * Ensures a quota row exists for the given company + demo type.
 * Creates one with default values if missing.
 */
export async function ensureQuotaForDemo(
  companyId: string,
  demoType: DemoType
): Promise<QuotaInfo> {
  const { data: existing } = await supabaseAdmin
    .from('demo_quotas')
    .select('*')
    .eq('company_id', companyId)
    .eq('demo_type', demoType)
    .maybeSingle();

  if (existing) {
    return mapQuotaRow(existing);
  }

  const now = new Date();
  const endAt = new Date(now);
  endAt.setDate(endAt.getDate() + DEMO_DURATION_DAYS);

  const { data: created, error } = await supabaseAdmin
    .from('demo_quotas')
    .insert({
      company_id: companyId,
      demo_type: demoType,
      start_at: now.toISOString(),
      end_at: endAt.toISOString(),
      remaining: DEMO_DEFAULTS[demoType],
      status: 'active'
    })
    .select('*')
    .single();

  if (error || !created) {
    throw new Error(`Failed to create quota: ${error?.message}`);
  }

  return mapQuotaRow(created);
}

/**
 * Checks the quota and decrements it if valid.
 * Inserts a demo_event row on success.
 * Throws DemoExpiredError or QuotaExhaustedError on failure.
 */
export async function checkAndConsumeQuota(
  companyId: string,
  demoType: DemoType,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<QuotaInfo> {
  const quota = await ensureQuotaForDemo(companyId, demoType);

  const now = new Date();

  if (quota.status === 'expired' || now > new Date(quota.endAt)) {
    // Mark as expired if not already
    if (quota.status !== 'expired') {
      await supabaseAdmin
        .from('demo_quotas')
        .update({ status: 'expired' })
        .eq('id', quota.id);
    }
    throw new DemoExpiredError();
  }

  if (quota.remaining <= 0) {
    throw new QuotaExhaustedError();
  }

  // Decrement remaining
  const { data: updated, error: updateError } = await supabaseAdmin
    .from('demo_quotas')
    .update({ remaining: quota.remaining - 1 })
    .eq('id', quota.id)
    .select('*')
    .single();

  if (updateError || !updated) {
    throw new Error(`Failed to decrement quota: ${updateError?.message}`);
  }

  // Log the demo event
  await supabaseAdmin.from('demo_events').insert({
    company_id: companyId,
    user_id: userId,
    demo_type: demoType,
    metadata: metadata ?? null
  });

  return mapQuotaRow(updated);
}

/**
 * Fetches the current quota for a company + demo type without consuming it.
 * Returns null if no quota exists yet.
 */
export async function getQuotaInfo(
  companyId: string,
  demoType: DemoType
): Promise<QuotaInfo | null> {
  const { data } = await supabaseAdmin
    .from('demo_quotas')
    .select('*')
    .eq('company_id', companyId)
    .eq('demo_type', demoType)
    .maybeSingle();

  if (!data) return null;
  return mapQuotaRow(data);
}

function mapQuotaRow(row: Record<string, unknown>): QuotaInfo {
  return {
    id: row.id as string,
    companyId: row.company_id as string,
    demoType: row.demo_type as DemoType,
    remaining: row.remaining as number,
    status: row.status as string,
    startAt: row.start_at as string,
    endAt: row.end_at as string
  };
}
