import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  parseReferralNotes,
  type ReferralPersonalizationSnapshot
} from '@/lib/referral-personalization';

const TOKEN_RE = /^[a-f0-9]{16}$/;

export async function getReferralPersonalization(
  token: string | null | undefined
): Promise<ReferralPersonalizationSnapshot | null> {
  if (!token || !TOKEN_RE.test(token)) return null;

  const { data, error } = await supabaseAdmin
    .from('ref_links')
    .select('company, notes')
    .eq('token', token)
    .maybeSingle();

  if (error || !data) return null;
  return parseReferralNotes(data.notes, data.company) ?? { company: data.company };
}
