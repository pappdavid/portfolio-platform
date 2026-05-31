import { Metadata } from 'next';
import { LandingContent } from '@/components/landing/landing-content';

export const metadata: Metadata = {
  title: 'David Papp — AI Solution Developer',
  description:
    '2nd-year BSc AI student at VU Amsterdam. I build production-quality LLM tools: agent observability, fine-tuning pipelines, and retrieval systems.'
};

export default function LandingPage() {
  return <LandingContent />;
}
