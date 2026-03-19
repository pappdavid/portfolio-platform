import { supabaseAdmin } from '@/lib/supabase/admin';

export interface CompanyInfo {
  companyId: string;
  name: string;
  domain: string;
}

/**
 * Resolves or creates a company row for the given Clerk user.
 * Uses the user's primary email domain as the company identifier.
 */
export async function getOrCreateCompanyForUser(user: {
  id: string;
  primaryEmailAddress?: { emailAddress: string } | null;
  emailAddresses?: { emailAddress: string }[];
}): Promise<CompanyInfo> {
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress ??
    `${user.id}@unknown.local`;

  const parts = email.split('@');
  const domain = parts[1] ?? 'unknown.local';
  const name = domain.split('.')[0] ?? domain;

  // Check for existing company
  const { data: existing } = await supabaseAdmin
    .from('companies')
    .select('id, name, domain')
    .eq('domain', domain)
    .maybeSingle();

  if (existing) {
    return {
      companyId: existing.id,
      name: existing.name,
      domain: existing.domain
    };
  }

  // Create new company
  const { data: created, error } = await supabaseAdmin
    .from('companies')
    .insert({ name, domain })
    .select('id, name, domain')
    .single();

  if (error || !created) {
    throw new Error(
      `Failed to create company for domain ${domain}: ${error?.message}`
    );
  }

  return { companyId: created.id, name: created.name, domain: created.domain };
}
