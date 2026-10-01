import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LandingContent } from '@/components/landing/landing-content';
import { ReferralPrivacy } from '@/components/landing/referral-privacy';
import { ReferralBanner } from '@/components/landing/referral-banner';
import { getReferralPersonalization } from '@/lib/referral-context';
import {
  mergeReferralWithCompanySlug,
  parseCompanySlug
} from '@/lib/company-slug';
import { resolveJobTypeFromSearchParams } from '@/lib/job-type';

export const metadata: Metadata = {
  title: 'David Papp — AI Solutions Developer',
  description:
    'AI Solutions Developer at WEBINFORM and studying Econometrics and Data Science at VU Amsterdam. University studies began in 2024; changed to this programme in September 2026; graduation expected in 2028. Open-source agent-security prototypes: PromptShield, agentsec-hook-pack, mcpguard-lite, agentmap, approveops.',
  openGraph: {
    title: 'David Papp — AI Solutions Developer',
    description: 'Open to full-time AI engineering roles.',
    images: [{ url: '/og-preview.jpg', width: 1200, height: 630 }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Papp — AI Solutions Developer',
    images: ['/og-preview.jpg']
  }
};

export default async function LandingPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ?role=<job type> personalizes the landing page for a class of roles.
  // Canonical URLs live at /roles/<id>; the query form redirects there so the
  // personalized variant stays linkable and prerenderable.
  const params = (await searchParams) ?? {};
  const jobType = resolveJobTypeFromSearchParams(params);
  if (jobType) {
    const context = new URLSearchParams();
    if (typeof params.ref === 'string' && /^[a-f0-9]{16}$/.test(params.ref)) {
      context.set('ref', params.ref);
    }
    const company = parseCompanySlug(params.c);
    if (company) context.set('c', company);
    const query = context.toString();
    redirect(`/roles/${jobType.id}${query ? `?${query}` : ''}`);
  }

  const token = typeof params.ref === 'string' ? params.ref : undefined;
  const pageReferral = await getReferralPersonalization(token);
  // Hunt CVs use /?c=<company-slug> until a native /r/<token> is bound.
  // Current-page referral context wins. The slug only frames the audience —
  // it does not invent facts about the company.
  const referral = mergeReferralWithCompanySlug(pageReferral, params.c);

  return (
    <>
      <ReferralBanner referral={referral} />
      {pageReferral && token && <ReferralPrivacy key={token} token={token} />}
      <LandingContent referral={referral} />
    </>
  );
}
