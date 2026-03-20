import { generatePageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
  IconMail,
  IconCalendar
} from '@tabler/icons-react';

export const metadata = generatePageMetadata({
  title: 'About',
  description:
    'AI engineering student at VU Amsterdam, building production-quality tools for the LLM stack.',
  slug: 'about'
});

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
            AI engineering student at VU Amsterdam, building production-quality
            tools for the LLM stack. I focus on the infrastructure between
            models and users — observability, guard rails, fine-tuning
            pipelines, and retrieval systems.
          </p>
        </div>
      </section>

      {/* Background */}
      <section className='bg-muted/30 py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='text-foreground mb-6 text-2xl font-bold'>
            Background
          </h2>
          <p className='text-muted-foreground mb-4 text-base leading-relaxed'>
            I consulted for an AI-first startup where I restructured their LLM
            backend to cut unnecessary OpenAI API calls by ~40% and closed a
            prompt injection vulnerability in their moderation layer. I
            consistently take the technical lead role in hackathon and
            rapid-build teams of 4–5 people.
          </p>
          <p className='text-muted-foreground text-base leading-relaxed'>
            Before university, I worked as a Project Assistant at 4iG (Budapest)
            on two large public-sector IT projects, and taught programming at
            Logiscool.
          </p>
        </div>
      </section>

      {/* Education */}
      <section className='py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='text-foreground mb-6 text-2xl font-bold'>Education</h2>
          <div className='space-y-6'>
            <div className='bg-background rounded-xl border p-6'>
              <div className='mb-1 flex items-start justify-between gap-4'>
                <h3 className='text-foreground font-semibold'>
                  BSc Artificial Intelligence — Vrije Universiteit Amsterdam
                </h3>
                <span className='text-muted-foreground shrink-0 text-sm'>
                  Sep 2023 – Expected 2026
                </span>
              </div>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Machine Learning · Deep Learning · NLP · Computer Vision · Data
                Mining · Algorithms &amp; Complexity · Statistics
              </p>
            </div>
            <div className='bg-background rounded-xl border p-6'>
              <div className='mb-1 flex items-start justify-between gap-4'>
                <h3 className='text-foreground font-semibold'>
                  Advanced Studies in Computer Science — Milestone Institute,
                  Budapest
                </h3>
                <span className='text-muted-foreground shrink-0 text-sm'>
                  2019–2023
                </span>
              </div>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Led the Computer Sciences Society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className='bg-muted/30 py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='text-foreground mb-6 text-2xl font-bold'>Skills</h2>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {[
              {
                group: 'AI & LLM Tooling',
                level: 'Daily use',
                levelColor: 'text-[#22c55e]',
                context:
                  'Prompt engineering, structured outputs, tool calling, guard rail design.',
                evidence: [
                  { label: 'MCP Sentinel', href: '/projects/mcp-sentinel' },
                  { label: 'RAG Chat', href: '/projects/rag-chat' }
                ],
                tags: [
                  'OpenAI API',
                  'Anthropic API',
                  'LangChain',
                  'CrewAI',
                  'HuggingFace',
                  'Structured Outputs'
                ]
              },
              {
                group: 'RAG & Retrieval',
                level: 'Active',
                levelColor: 'text-[#06b6d4]',
                context:
                  'Embedding pipelines, vector search (pgvector), cross-encoder reranking, citation enforcement.',
                evidence: [{ label: 'RAG Chat', href: '/projects/rag-chat' }],
                tags: [
                  'pgvector',
                  'Supabase',
                  'OpenAI Embeddings',
                  'Hybrid Search'
                ]
              },
              {
                group: 'Agentic Systems & Security',
                level: 'Daily use',
                levelColor: 'text-[#22c55e]',
                context:
                  'MCP protocol, injection detection, PII scanning, moderation hardening, cost-based rate limiting.',
                evidence: [
                  { label: 'MCP Sentinel', href: '/projects/mcp-sentinel' },
                  { label: 'Startup consulting', href: '/about' }
                ],
                tags: ['MCP', 'Guard Rails', 'HMAC Signing', 'Event Logging']
              },
              {
                group: 'Backend & Data',
                level: 'Active',
                levelColor: 'text-[#06b6d4]',
                context:
                  'Full-stack TypeScript/Python. Auth, database, rate limiting, and deployment.',
                evidence: [{ label: 'All projects', href: '/projects' }],
                tags: [
                  'Python',
                  'Django',
                  'TypeScript',
                  'Next.js',
                  'PostgreSQL',
                  'Supabase',
                  'AWS Lambda',
                  'DynamoDB',
                  'Docker',
                  'Kafka (basic)'
                ]
              },
              {
                group: 'Frontend & Infra',
                level: 'Working',
                levelColor: 'text-[#f59e0b]',
                context:
                  'Built this portfolio platform end-to-end: auth (Clerk), database (Supabase + RLS), rate limiting (Upstash), and deployment (Vercel).',
                evidence: [
                  { label: 'This platform', href: '/projects/portfolio' }
                ],
                tags: ['React', 'Tailwind', 'Vercel', 'Cloudflare', 'Clerk']
              },
              {
                group: 'Model Training',
                level: 'Active',
                levelColor: 'text-[#06b6d4]',
                context:
                  'Built the dataset-to-LoRA pipeline: codebase ingestion, AST-aware chunking, JSONL formatting, and fine-tune job management.',
                evidence: [
                  { label: 'Training Pipeline', href: '/projects/training' }
                ],
                tags: [
                  'LoRA / PEFT',
                  'JSONL',
                  'AST Chunking',
                  'HuggingFace Hub'
                ]
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
                <p className='text-muted-foreground mb-2 text-xs leading-relaxed'>
                  {item.context}
                </p>
                <p className='mb-3 text-xs'>
                  <span className='text-muted-foreground'>See: </span>
                  {item.evidence.map((ev, i) => (
                    <span key={ev.href}>
                      {i > 0 && (
                        <span className='text-muted-foreground'>, </span>
                      )}
                      <Link
                        href={ev.href}
                        className='text-[#22c55e] hover:underline'
                      >
                        {ev.label}
                      </Link>
                    </span>
                  ))}
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

      {/* Availability */}
      <section className='py-16'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='text-foreground mb-4 text-2xl font-bold'>
            Availability
          </h2>
          <p className='text-muted-foreground mb-8 text-base leading-relaxed'>
            Based in Rotterdam, Netherlands. Available for part-time roles
            during studies, full-time from mid-2026. Open to: junior
            AI/automation engineer, full-stack AI, and data science roles.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Button asChild size='lg'>
              <a href='mailto:contact@davidpapp.dev'>
                <IconMail className='mr-2 h-5 w-5' />
                Email me
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
                github.com/pappdavid
              </a>
            </Button>
            <Button asChild variant='ghost' size='sm'>
              <a
                href='https://www.linkedin.com/in/dávid-papp'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconBrandLinkedin className='mr-2 h-4 w-4' />
                linkedin.com/in/dávid-papp
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
