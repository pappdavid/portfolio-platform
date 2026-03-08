import { Metadata } from 'next';
import { ProjectsContent } from '@/components/projects/projects-content';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A showcase of AI engineering work across observability, training, and retrieval systems.'
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
