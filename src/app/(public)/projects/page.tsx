import { Metadata } from 'next';
import { ProjectsContent } from '@/components/projects/projects-content';

export const metadata: Metadata = {
  title: 'Showcase — David Papp',
  description:
    'Open-source AI-agent security prototypes and developer tools, with real source excerpts and live demos.'
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
