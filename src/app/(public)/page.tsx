import { Metadata } from 'next';
import { LandingContent } from '@/components/landing/landing-content';

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

export default function LandingPage() {
  return <LandingContent />;
}
