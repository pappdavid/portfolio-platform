import { Metadata } from 'next';
import { SaasProjectsContent } from '@/components/saas-projects/saas-projects-content';

export const metadata: Metadata = {
  title: 'SaaS Projects — David Papp',
  description:
    'A catalogue of small side-project prototypes, each with a public Vercel demo.'
};

export default function SaasProjectsPage() {
  return <SaasProjectsContent />;
}
