import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import projectsData from '@/data/saas-projects.json';

type SaasProject = {
  slug: string;
  name: string;
  description: string;
  url: string;
  screenshotPath: string;
  updatedAt: string;
};

const projects = projectsData as SaasProject[];

function formatUpdatedAt(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function SaasProjectsContent() {
  const lastUpdated =
    projects.length > 0 ? formatUpdatedAt(projects[0].updatedAt) : null;

  return (
    <div className='flex flex-col'>
      {/* Hero */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4'>
          <Badge variant='secondary' className='mb-4'>
            SaaS Projects
          </Badge>
          <h1 className='text-foreground text-4xl font-bold tracking-tight sm:text-5xl'>
            SaaS Projects
          </h1>
          <p className='text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed'>
            These projects serve the purpose of making a few bucks to recoup the
            money spent on RunPod, AI tools, and hosting bills — and my
            crippling domain hoarding. The projects are pulled daily from my
            GitHub org automatically, so some of them are not listed anywhere
            and cannot be subscribed to yet. They are built from a very
            extensive template and use a Vercel + Supabase + Clerk + Redis stack
            with my custom shadcn element library. It was first AWS-based, but
            it ended up being easier to use a fixed stack with optional
            components.
          </p>
          {lastUpdated && (
            <p className='text-muted-foreground mt-3 text-sm'>
              Last synced: {lastUpdated}
            </p>
          )}
        </div>
      </section>

      {/* Project Grid */}
      <section className='bg-muted/30 py-12'>
        <div className='mx-auto max-w-6xl px-4'>
          {projects.length === 0 ? (
            <p className='text-muted-foreground text-center text-sm'>
              No projects synced yet — check back after the first daily run.
            </p>
          ) : (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {projects.map((project) => (
                <div
                  key={project.slug}
                  className='bg-background overflow-hidden rounded-xl border'
                >
                  {/* Screenshot */}
                  <div className='bg-muted relative aspect-video w-full overflow-hidden'>
                    <Image
                      src={project.screenshotPath}
                      alt={`${project.name} screenshot`}
                      fill
                      className='object-cover object-top'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  </div>

                  {/* Body */}
                  <div className='p-5'>
                    <h3 className='text-foreground font-semibold'>
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                        {project.description}
                      </p>
                    )}
                    <a
                      href={project.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary mt-3 block text-sm underline-offset-2 hover:underline'
                    >
                      Visit →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className='py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'>
            Interested in something similar?
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            Available for AI engineering roles and short consulting engagements.
          </p>
          <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button size='lg' asChild>
              <a href='mailto:hello@davidpapp.dev'>Email me</a>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <a
                href='https://cal.com/davidpapp/intro'
                target='_blank'
                rel='noopener noreferrer'
              >
                Book a call
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
