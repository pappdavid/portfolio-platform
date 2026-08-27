import type { ReferralPersonalizationSnapshot } from '@/lib/referral-personalization';

/** Hunt CVs print `davidpapp.dev/{slug}` and link `/?c={slug}` until a `/r/<token>` exists. */
export const COMPANY_SLUG_QUERY_PARAM = 'c';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export function parseCompanySlug(input: unknown): string | null {
  const raw = Array.isArray(input) ? input[0] : input;
  if (typeof raw !== 'string') return null;
  const slug = raw.trim().toLowerCase();
  if (slug.length < 2 || slug.length > 64) return null;
  if (slug.includes('--')) return null;
  if (!SLUG_RE.test(slug)) return null;
  return slug;
}

export function humanizeCompanySlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Lightweight audience framing from a company slug. The company *name* is the
 * only derived field — no role, focus list, or featured projects. Chat/AMA
 * must not treat this as evidence about the company.
 */
export function snapshotFromCompanySlug(
  slug: string
): ReferralPersonalizationSnapshot {
  const company = humanizeCompanySlug(slug);
  return {
    company,
    heroTag: `Context: ${company}`,
    chatContext: `Visitor arrived via company slug "${slug}" (${company}). Use this only as audience framing. Do not state or infer facts about the company.`
  };
}

export function snapshotFromCompanySearchParam(
  value: unknown
): ReferralPersonalizationSnapshot | null {
  const slug = parseCompanySlug(value);
  return slug ? snapshotFromCompanySlug(slug) : null;
}

/** Cookie-backed referral wins; otherwise the `?c=` slug snapshot. */
export function mergeReferralWithCompanySlug(
  referral: ReferralPersonalizationSnapshot | null | undefined,
  companyParam: unknown
): ReferralPersonalizationSnapshot | null {
  if (referral) return referral;
  return snapshotFromCompanySearchParam(companyParam);
}
