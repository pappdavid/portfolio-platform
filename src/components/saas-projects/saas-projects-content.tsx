import Image from 'next/image';
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
    <div className='shell relative py-16' style={{ fontFamily: 'var(--font-hud-mono)' }}>
      {/* Header Prompt */}
      <header className='block'>
        <div className='sec-head'>
          <span className='sec-cmd'>cat saas_catalog.db</span>
          {projects.length > 0 && (
            <span className='sec-note'>[{projects.length} products provisioned]</span>
          )}
        </div>
        <p className='prose mb-6' style={{ color: 'var(--dp-text-dim)', fontSize: '13px', lineHeight: '1.6' }}>
          These side-projects are built and self-provisioned dynamically via the{' '}
          <span style={{ color: 'var(--dp-accent)' }}>saas-core</span> Product Factory. On push, 
          automated GitHub Actions orchestrate Vercel serverless deployments, Supabase PostgreSQL, 
          Upstash Redis caching, Resend lists, and Stripe billing products idempotently in under 5 minutes.
        </p>
        {lastUpdated && (
          <p style={{ color: 'var(--dp-text-dim)', fontSize: '11px' }}>
            {'// last daily db sync: '}
            <span style={{ color: 'var(--dp-accent-muted)' }}>{lastUpdated}</span>
          </p>
        )}
      </header>

      {/* Grid */}
      <section className='block'>
        {projects.length === 0 ? (
          <p className='text-center text-xs' style={{ color: 'var(--dp-text-dim)' }}>
            [ERROR: no active product catalog entries found]
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <div
                key={project.slug}
                className='term-window rounded-none overflow-hidden flex flex-col'
                style={{
                  border: '1px solid var(--dp-border)',
                  background: 'var(--dp-bg-raised)',
                  borderRadius: '0px'
                }}
              >
                {/* Traffic-lights Chrome Header */}
                <div 
                  className='term-titlebar flex items-center justify-between' 
                  style={{ 
                    padding: '8px 12px',
                    background: 'var(--dp-bg-titlebar)',
                    borderBottom: '1px solid var(--dp-border)'
                  }}
                >
                  <div className='flex gap-1.5'>
                    <span 
                      className='w-2.5 h-2.5 rounded-full' 
                      style={{ background: 'var(--dot-red)' }} 
                    />
                    <span 
                      className='w-2.5 h-2.5 rounded-full' 
                      style={{ background: 'var(--dot-yellow)' }} 
                    />
                    <span 
                      className='w-2.5 h-2.5 rounded-full' 
                      style={{ background: 'var(--dot-green)' }} 
                    />
                  </div>
                  <span 
                    className='text-[10px]' 
                    style={{ color: 'var(--dp-text-dim)', fontSize: '10px' }}
                  >
                    {project.slug}.davidpapp.dev
                  </span>
                </div>

                {/* Aspect-Video Screenshot */}
                <div 
                  className='relative aspect-video w-full overflow-hidden'
                  style={{ background: 'var(--dp-bg)' }}
                >
                  <Image
                    src={project.screenshotPath}
                    alt={`${project.name} preview`}
                    fill
                    className='object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-300'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  />
                </div>

                {/* Details Body */}
                <div 
                  className='p-5 flex-1 flex flex-col justify-between'
                  style={{ borderTop: '1px solid var(--dp-border)' }}
                >
                  <div>
                    <h3 
                      style={{ 
                        color: 'var(--dp-accent)', 
                        fontSize: '13px', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {project.name}
                    </h3>
                    <p 
                      style={{ 
                        color: 'var(--dp-text-dim)', 
                        fontSize: '11px', 
                        marginTop: '8px', 
                        lineHeight: '1.5' 
                      }}
                    >
                      {project.description || 'Idle boilerplate template ready for core logic.'}
                    </p>
                  </div>
                  
                  <div className='mt-4 pt-3' style={{ borderTop: '1px dotted var(--dp-border)' }}>
                    <a
                      href={project.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='row-link font-bold text-[11px]'
                    >
                      {'[visit active demo ->]'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Footer */}
      <section className='block py-16' style={{ borderTop: '1px solid var(--dp-border)' }}>
        <div className='text-center max-w-2xl mx-auto'>
          <h2 style={{ color: 'var(--dp-text)', fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            // Interested in hiring me?
          </h2>
          <p style={{ color: 'var(--dp-text-dim)', fontSize: '13px', marginTop: '8px', lineHeight: '1.6' }}>
            I am available for full-time AI solutions engineering roles and high-impact short consulting contracts.
          </p>
          <div className='cta-row justify-center mt-8'>
            <a href='mailto:contact@davidpapp.dev' className='cta cta-resume glitch-hover'>
              [email contact]
            </a>
            <a
              href='https://calendly.com/david-webinform/30min'
              target='_blank'
              rel='noopener noreferrer'
              className='cta glitch-hover'
            >
              [schedule live call]
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
