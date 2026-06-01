import { Metadata } from 'next';
import { LandingContent } from '@/components/landing/landing-content';

export const metadata: Metadata = {
  title: 'David Papp — AI Solution Developer',
  description:
    'Building AI-first solutions. MCP Sentinel, agent-cli-mcp-rust, and production agent security architectures.',
  openGraph: {
    title: 'David Papp — AI Solution Developer',
    description:
      'Open to part-time AI engineering roles and internships from July 2026.',
    images: [{ url: '/og-preview.jpg', width: 1200, height: 630 }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Papp — AI Solution Developer',
    images: ['/og-preview.jpg']
  }
};

export default function LandingPage() {
  return <LandingContent />;
}
