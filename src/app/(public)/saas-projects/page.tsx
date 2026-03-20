import { Metadata } from 'next';
import { SaasProjectsContent } from '@/components/saas-projects/saas-projects-content';

export const metadata: Metadata = {
  title: 'SaaS Projects — David Papp',
  description:
    'Side projects from the Code Shame org — a Vercel + Supabase + Clerk + Redis stack, updated daily.'
};

export default function SaasProjectsPage() {
  return <SaasProjectsContent />;
}
