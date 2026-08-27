import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LandingContent } from '@/components/landing/landing-content';
import { ReferralBanner } from '@/components/landing/referral-banner';
import { getReferralPersonalization } from '@/lib/referral-context';
import { REFERRAL_COOKIE } from '@/lib/referral-personalization';
import { mergeReferralWithCompanySlug } from '@/lib/company-slug';
import { resolveJobTypeFromSearchParams } from '@/lib/job-type';

export const metadata: Metadata = {
  title: 'David Papp — AI Solutions Developer',
  description:
    'AI Solutions Developer at WEBINFORM and BSc AI student at VU Amsterdam. Open-source agent-security prototypes: PromptShield, agentsec-hook-pack, mcpguard-lite, agentmap, approveops.',
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
    redirect(`/roles/${jobType.id}`);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(REFERRAL_COOKIE)?.value;
  const cookieReferral = await getReferralPersonalization(token);
  // Hunt CVs use /?c=<company-slug> until a native /r/<token> is bound.
  // Cookie-backed referral still wins. The slug only frames the audience —
  // it does not invent facts about the company.
  const referral = mergeReferralWithCompanySlug(cookieReferral, params.c);

  return (
    <>
      <ReferralBanner referral={referral} />
      <LandingContent referral={referral} />
    </>
  );
}
