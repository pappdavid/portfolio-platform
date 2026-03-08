import { Metadata } from 'next';
import { LandingContent } from '@/components/landing/landing-content';

export const metadata: Metadata = {
  title: 'David Papp — AI Engineering, Delivered',
  description:
    'Production-grade AI tools: MCP Sentinel for agent observability, Custom Training pipelines, and RAG + 3D Chat.'
};

export default function LandingPage() {
  return <LandingContent />;
}
