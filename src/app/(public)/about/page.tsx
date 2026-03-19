import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
  IconMail,
  IconCalendar
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

      {/* Skills */}
      <section className='py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='text-foreground mb-6 text-2xl font-bold'>Skills</h2>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {[
              {
                group: 'LLM Application Layer',
                level: 'Daily use',
                levelColor: 'text-[#22c55e]',
                context:
                  'Prompt engineering, structured outputs, tool calling, and guard rail design.',
                tags: [
                  'OpenAI API',
                  'Anthropic API',
                  'LangChain',
                  'Structured Outputs'
                ]
              },
              {
                group: 'RAG & Retrieval',
                level: 'Active',
                levelColor: 'text-[#06b6d4]',
                context:
                  'Document chunking, embedding pipelines, vector search, and reranking.',
                tags: [
                  'pgvector',
                  'Supabase',
                  'OpenAI Embeddings',
                  'Hybrid Search'
                ]
              },
              {
                group: 'Agentic Systems',
                level: 'Daily use',
                levelColor: 'text-[#22c55e]',
                context:
                  'MCP protocol, injection detection, observability middleware, and cost guards.',
                tags: ['MCP', 'Guard Rails', 'Event Logging', 'HMAC Signing']
              },
              {
                group: 'Full-Stack Engineering',
                level: 'Daily use',
                levelColor: 'text-[#22c55e]',
                context:
                  'End-to-end TypeScript/Python products with auth, DB, and deployment.',
                tags: ['Next.js', 'TypeScript', 'Supabase', 'Clerk', 'Vercel']
              },
              {
                group: 'Model Training & Infra',
                level: 'Active',
                levelColor: 'text-[#06b6d4]',
                context:
                  'LoRA fine-tuning, JSONL dataset prep, eval loops, and job management.',
                tags: ['LoRA', 'JSONL', 'Python', 'Docker', 'HuggingFace']
              }
            ].map((item) => (
              <div
                key={item.group}
                className='bg-background rounded-xl border p-5'
              >
                <div className='mb-2 flex items-center justify-between'>
                  <h3 className='text-foreground text-sm font-semibold'>
                    {item.group}
                  </h3>
                  <span className={`font-mono text-xs ${item.levelColor}`}>
                    {item.level}
                  </span>
                </div>
                <p className='text-muted-foreground mb-3 text-xs leading-relaxed'>
                  {item.context}
                </p>
                <div className='flex flex-wrap gap-1.5'>
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant='secondary' className='text-xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className='bg-muted/30 py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='text-foreground mb-2 text-2xl font-bold'>
            Got an AI role or project in mind?
          </h2>
          <p className='text-muted-foreground mb-8 text-lg'>
            I&apos;m open to full-time roles and short engagements.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Button asChild size='lg'>
              <a href='mailto:contact@davidpapp.dev'>
                <IconMail className='mr-2 h-5 w-5' />
                Email me about a role
              </a>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <a
                href='https://calendly.com/david-webinform/30min'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconCalendar className='mr-2 h-5 w-5' />
                Book a 20-min intro call
              </a>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <a href='/cv.pdf' target='_blank' rel='noopener noreferrer'>
                <IconFileText className='mr-2 h-5 w-5' />
                Download CV
              </a>
            </Button>
          </div>
          <div className='mt-8 flex flex-wrap gap-2'>
            <Button asChild variant='ghost' size='sm'>
              <a
                href='https://github.com/pappdavid'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconBrandGithub className='mr-2 h-4 w-4' />
                GitHub
              </a>
            </Button>
            <Button asChild variant='ghost' size='sm'>
              <a
                href='https://www.linkedin.com/in/dávid-papp'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconBrandLinkedin className='mr-2 h-4 w-4' />
                LinkedIn
              </a>
            </Button>
            <Button asChild variant='ghost' size='sm'>
              <a href='/cv.pdf' target='_blank' rel='noopener noreferrer'>
                <IconFileText className='mr-2 h-4 w-4' />
                CV (PDF)
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
