import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Referral event retention (GDPR storage-limitation).
 *
 * Visit events (truncated IP, user agent, country) are kept for 90 days,
 * matching the privacy policy. Called best-effort alongside event inserts;
 * failures never block a visit (degrade-open, like the rate limiter).
 */
export const REF_EVENTS_RETENTION_DAYS = 90;

export async function purgeExpiredRefEvents(): Promise<void> {
  const cutoff = new Date(
    Date.now() - REF_EVENTS_RETENTION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  await supabaseAdmin
    .from('ref_events')
    .delete()
    .lt('created_at', cutoff);
}
