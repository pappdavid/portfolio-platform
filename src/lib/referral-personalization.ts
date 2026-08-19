export const REFERRAL_COOKIE = 'dp_ref';

export interface ReferralPersonalizationSnapshot {
  company: string;
  role?: string;
  applicationId?: string;
  focus?: string[];
  featuredProjects?: string[];
  chatContext?: string;
  heroTag?: string;
  ctaLabel?: string;
}

interface ReferralNotesEnvelope {
  v: 1;
  note?: string;
  personalization: ReferralPersonalizationSnapshot;
}

function cleanString(value: unknown, max = 500): string | undefined {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.trim().slice(0, max);
  return cleaned || undefined;
}

function cleanList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const cleaned = value
    .map((item) => cleanString(item, 120))
    .filter((item): item is string => Boolean(item))
    .slice(0, 8);
  return cleaned.length ? cleaned : undefined;
}

export function normalizeReferralPersonalization(
  input: unknown,
  companyOverride?: string
): ReferralPersonalizationSnapshot | null {
  if (!input || typeof input !== 'object') return null;
  const value = input as Record<string, unknown>;
  const company = cleanString(companyOverride ?? value.company, 160);
  if (!company) return null;
  return {
    company,
    role: cleanString(value.role, 180),
    applicationId: cleanString(value.applicationId, 120),
    focus: cleanList(value.focus),
    featuredProjects: cleanList(value.featuredProjects),
    chatContext: cleanString(value.chatContext, 1200),
    heroTag: cleanString(value.heroTag, 220),
    ctaLabel: cleanString(value.ctaLabel, 120)
  };
}

export function serializeReferralNotes(
  note: string | undefined,
  personalization: ReferralPersonalizationSnapshot
): string {
  const normalized = normalizeReferralPersonalization(personalization);
  if (!normalized) throw new Error('Invalid referral personalization');
  const envelope: ReferralNotesEnvelope = {
    v: 1,
    note: cleanString(note, 1000),
    personalization: normalized
  };
  return JSON.stringify(envelope);
}

export function parseReferralNotes(
  notes: string | null | undefined,
  company: string
): ReferralPersonalizationSnapshot | null {
  if (!notes) return null;
  try {
    const parsed = JSON.parse(notes) as Partial<ReferralNotesEnvelope>;
    if (parsed.v !== 1 || !parsed.personalization) return null;
    return normalizeReferralPersonalization(parsed.personalization, company);
  } catch {
    return null;
  }
}

export interface ReferralPresentation {
  heroTag: string;
  projectsCta: string;
  target?: string;
  roleFocus?: string;
  chatGreeting: string;
  chatContextLabel: string;
}

export function buildReferralPresentation(
  snapshot: ReferralPersonalizationSnapshot | null | undefined
): ReferralPresentation {
  if (!snapshot) {
    return {
      heroTag: 'Building AI-first solutions. One agent at a time.',
      projectsCta: '[projects]',
      chatGreeting:
        "Session active. Grounded in David's public GitHub projects and factual profile. Ask me about his engineering work.",
      chatContextLabel: 'context: github_public'
    };
  }

  const target = snapshot.role
    ? `${snapshot.company} · ${snapshot.role}`
    : snapshot.company;
  const roleFocus = snapshot.focus?.slice(0, 4).join(' · ');
  const defaultHeroTag = snapshot.role
    ? `Role context: ${snapshot.role} at ${snapshot.company}${roleFocus ? ` · ${roleFocus}` : ''}`
    : `Referral context: ${snapshot.company}${roleFocus ? ` · ${roleFocus}` : ''}`;

  return {
    heroTag: snapshot.heroTag || defaultHeroTag,
    projectsCta: snapshot.ctaLabel || '[relevant projects]',
    target,
    roleFocus,
    chatGreeting: `Referral context loaded for ${target}. Ask which verified projects and experience are most relevant.`,
    chatContextLabel: 'context: github_public + referral'
  };
}

export function buildReferralRetrievalQuery(
  question: string,
  snapshot: ReferralPersonalizationSnapshot | null | undefined
): string {
  if (!snapshot) return question;
  return [
    question,
    snapshot.role,
    ...(snapshot.focus || []),
    ...(snapshot.featuredProjects || [])
  ]
    .filter(Boolean)
    .join(' ');
}

export function prioritizeReferralProjects<T extends { name: string }>(
  projects: readonly T[],
  snapshot: ReferralPersonalizationSnapshot | null | undefined
): T[] {
  if (!snapshot?.featuredProjects?.length) return [...projects];
  const rank = new Map(
    snapshot.featuredProjects.map((name, index) => [name.toLowerCase(), index])
  );
  return [...projects].sort((a, b) => {
    const ar = rank.get(a.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    const br = rank.get(b.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    return ar - br;
  });
}

export function buildReferralChatContext(
  snapshot: ReferralPersonalizationSnapshot
): string {
  const lines = [
    'Referral context for this visitor:',
    `Company: ${snapshot.company}`,
    snapshot.role ? `Role: ${snapshot.role}` : undefined,
    snapshot.focus?.length
      ? `Relevant focus: ${snapshot.focus.join(', ')}`
      : undefined,
    snapshot.chatContext
      ? `Application framing: ${snapshot.chatContext}`
      : undefined,
    'Company and role names in referral context are routing metadata, not factual evidence about the employer.',
    'Do not state or infer facts about the company, its products, priorities, culture, technology stack, or hiring criteria unless those facts appear in independently retrieved factual context.',
    'Use referral context only to prioritize relevant material already present in David’s factual profile and retrieved portfolio context.',
    'Do not treat referral context as evidence that David has any skill, achievement, relationship, or experience unless the normal factual context independently supports it.'
  ];
  return lines.filter(Boolean).join('\n');
}
