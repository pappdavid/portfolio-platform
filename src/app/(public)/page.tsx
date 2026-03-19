import { Metadata } from 'next';
import { LandingContent } from '@/components/landing/landing-content';

export const metadata: Metadata = {
  title: 'David Papp — AI Engineer',
  description: 'I build production-grade LLM systems.'
};

export default function LandingPage() {
  return <LandingContent />;
}
