'use client';

import Link from 'next/link';
import { Spotlight } from '@/components/ui/spotlight';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { MermaidDiagram } from '@/components/shared/mermaid-diagram';
import { Button } from '@/components/ui/button';
import {
  IconShield,
  IconBrain,
  IconMessageCircle,
  IconArrowRight,
  IconCurrencyDollar,
  IconLock,
  IconMinimize
} from '@tabler/icons-react';

const proofPoints = [
  {
    metric: '40%',
    label: 'fewer support calls',
    detail: 'via structured guard rails'
  },
  {
    metric: 'Zero',
    label: 'injection incidents',
    detail: 'with input validation layer'
  },
  { metric: '3', label: 'product launches led', detail: 'end-to-end delivery' }
];

const pillars = [
  {
    title: 'MCP Sentinel',
    description:
      'Drop-in observability for agent tool calls. Log, guard, and audit every MCP interaction.',
    icon: IconShield,
    href: '/mcp',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Custom Training',
    description:
      'Codebase to dataset to LoRA — in your infra. Turn internal knowledge into fine-tuned models.',
    icon: IconBrain,
    href: '/training',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'RAG + 3D Chat',
    description:
      'Chat with your docs, render 3D outputs. Retrieval-augmented generation with visual context.',
    icon: IconMessageCircle,
    href: '/chat',
    color: 'from-orange-500 to-red-500'
  }
];

const howItWorksChart = `graph LR
  A[Your Codebase] --> B[MCP Sentinel]
  B --> C[Guard & Log]
  C --> D[Agent Tools]
  D --> E[Dashboard]
  A --> F[Training Pipeline]
  F --> G[Fine-tuned Model]
  G --> H[RAG Chat]
  H --> I[3D Viewer]`;

const philosophyItems = [
  {
    icon: IconCurrencyDollar,
    title: 'Cost-Aware',
    description:
      'Every API call has a price tag. Rate limiting, caching, and tiered routing keep costs predictable.'
  },
  {
    icon: IconLock,
    title: 'Security-First',
    description:
      'Input validation, HMAC signing, RLS policies, and guard rails are built in — not bolted on.'
  },
  {
    icon: IconMinimize,
    title: 'Minimal Surface',
    description:
      'Ship the smallest thing that works. No over-abstraction. Three lines of code beats a premature framework.'
  }
];

export function LandingContent() {
  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='relative flex min-h-[80vh] items-center justify-center overflow-hidden'>
        <Spotlight className='-top-40 -left-10 md:-top-20 md:-left-32' />
        <BackgroundBeams className='opacity-40' />
        <div className='relative z-10 mx-auto max-w-4xl px-4 text-center'>
          <TextGenerateEffect
            words='AI Engineering, Delivered'
            className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'
          />
          <p className='text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl'>
            Production-grade tools for agent observability, model fine-tuning,
            and retrieval-augmented chat — built with cost discipline and
            security in mind.
          </p>
          <div className='mt-8 flex items-center justify-center gap-4'>
            <Button asChild size='lg'>
              <Link href='/mcp'>
                Explore MCP Sentinel
                <IconArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/dashboard/overview'>View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Proof Points */}
      <section className='border-border/40 border-y py-16'>
        <div className='mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 sm:grid-cols-3'>
          {proofPoints.map((point) => (
            <div key={point.label} className='text-center'>
              <p className='text-foreground text-4xl font-bold'>
                {point.metric}
              </p>
              <p className='text-foreground mt-1 text-sm font-medium'>
                {point.label}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                {point.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className='py-20'>
        <div className='mx-auto max-w-6xl px-4'>
          <h2 className='text-foreground mb-4 text-center text-3xl font-bold'>
            Three Pillars
          </h2>
          <p className='text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-lg'>
            Each product solves a real problem in the AI engineering stack.
          </p>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {pillars.map((pillar) => (
              <Link key={pillar.title} href={pillar.href} className='group'>
                <HoverBorderGradient
                  as='div'
                  containerClassName='w-full rounded-xl'
                  className='bg-background flex h-full w-full flex-col gap-4 rounded-xl p-6'
                >
                  <div
                    className={`bg-gradient-to-br ${pillar.color} flex h-10 w-10 items-center justify-center rounded-lg`}
                  >
                    <pillar.icon className='h-5 w-5 text-white' />
                  </div>
                  <h3 className='text-foreground text-lg font-semibold'>
                    {pillar.title}
                  </h3>
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {pillar.description}
                  </p>
                  <span className='text-primary mt-auto text-sm font-medium group-hover:underline'>
                    Learn more &rarr;
                  </span>
                </HoverBorderGradient>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='bg-muted/30 py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-4 text-center text-3xl font-bold'>
            How It Works
          </h2>
          <p className='text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-lg'>
            A unified pipeline from codebase to deployed AI product.
          </p>
          <div className='bg-background rounded-xl border p-6'>
            <MermaidDiagram chart={howItWorksChart} />
          </div>
        </div>
      </section>

      {/* Build Philosophy */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <h2 className='text-foreground mb-4 text-center text-3xl font-bold'>
            Build Philosophy
          </h2>
          <p className='text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-lg'>
            Engineering principles that ship reliable AI products.
          </p>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {philosophyItems.map((item) => (
              <div
                key={item.title}
                className='bg-card rounded-xl border p-6 shadow-sm'
              >
                <item.icon className='text-primary mb-4 h-8 w-8' />
                <h3 className='text-foreground mb-2 text-lg font-semibold'>
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
    </div>
  );
}
