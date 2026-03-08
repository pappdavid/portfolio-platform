import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText
} from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'About — David Papp',
  description:
    'AI engineer focused on production-grade tooling: agent observability, fine-tuning pipelines, and retrieval systems.'
};

export default function AboutPage() {
  return (
    <div className='flex flex-col'>
      {/* Bio */}
      <section className='py-20'>
        <div className='mx-auto max-w-3xl px-4'>
          <Badge variant='secondary' className='mb-4'>
            About
          </Badge>
          <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
            David Papp
          </h1>
          <p className='text-muted-foreground mt-6 text-lg leading-relaxed'>
            AI engineer building production-grade tools for teams that ship LLM
            products. I focus on the infrastructure between models and users —
            observability, guard rails, fine-tuning pipelines, and retrieval
            systems.
          </p>
          <p className='text-muted-foreground mt-4 text-lg leading-relaxed'>
            Previously led three product launches end-to-end. I care about cost
            discipline, security by default, and shipping the simplest thing
            that works.
          </p>
        </div>
      </section>

      {/* Target Roles */}
      <section className='bg-muted/30 py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='text-foreground mb-6 text-2xl font-bold'>What I Do</h2>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            {[
              {
                title: 'AI Engineering',
                description:
                  'Building and deploying LLM-powered products — from prompt engineering to model fine-tuning to production infrastructure.'
              },
              {
                title: 'Platform Development',
                description:
                  'Full-stack TypeScript/Python with Next.js, Supabase, and cloud-native tooling. Emphasis on developer experience.'
              },
              {
                title: 'Technical Leadership',
                description:
                  'Scoping work, unblocking teams, and making architecture decisions that balance speed with maintainability.'
              },
              {
                title: 'Consulting',
                description:
                  'Available for short engagements: AI strategy review, architecture audit, and prototype-to-production handoff.'
              }
            ].map((item) => (
              <div
                key={item.title}
                className='bg-background rounded-xl border p-6'
              >
                <h3 className='text-foreground mb-2 font-semibold'>
                  {item.title}
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section className='py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='text-foreground mb-6 text-2xl font-bold'>Links</h2>
          <div className='flex flex-wrap gap-4'>
            <Button asChild variant='outline' size='lg'>
              <a
                href='https://github.com/davidpapp'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconBrandGithub className='mr-2 h-5 w-5' />
                GitHub
              </a>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <a
                href='https://linkedin.com/in/davidpapp'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconBrandLinkedin className='mr-2 h-5 w-5' />
                LinkedIn
              </a>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <a href='/cv.pdf' target='_blank' rel='noopener noreferrer'>
                <IconFileText className='mr-2 h-5 w-5' />
                CV (PDF)
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
