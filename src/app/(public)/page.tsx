import { Metadata } from 'next';
import { LandingContent } from '@/components/landing/landing-content';

export const metadata: Metadata = {
  title: 'David Papp — AI Solution Developer',
  description:
    '2nd-year BSc AI student at VU Amsterdam. I build production-quality LLM tools: agent observability, fine-tuning pipelines, and retrieval systems.',
  openGraph: {
    title: 'David Papp — AI Solution Developer',
    description:
      '2nd-year BSc AI student at VU Amsterdam. I build production-quality LLM tools: agent observability, fine-tuning pipelines, and retrieval systems.',
    url: 'https://davidpapp.dev',
    siteName: 'David Papp Portfolio OS',
    images: [
      {
        url: '/og/portfolio.png',
        width: 1200,
        height: 630,
        alt: 'David Papp Portfolio OS — AI Solution Developer'
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
};

export default function LandingPage() {
  return <LandingContent />;
}
