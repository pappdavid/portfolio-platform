import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { LandingContent } from '@/components/landing/landing-content';
import { ReferralBanner } from '@/components/landing/referral-banner';
import { getReferralPersonalization } from '@/lib/referral-context';
import { REFERRAL_COOKIE } from '@/lib/referral-personalization';

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

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFERRAL_COOKIE)?.value;
  const referral = await getReferralPersonalization(token);

  return (
    <>
      <ReferralBanner referral={referral} />
      <LandingContent />
    </>
  );
}
