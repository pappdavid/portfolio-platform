import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security'
};

export default function SecurityPage() {
  return (
    <div className='py-20'>
      <article className='prose dark:prose-invert mx-auto max-w-3xl px-4'>
        <h1>Security</h1>
        <p className='lead'>
          Security practices and responsible disclosure policy.
        </p>

        <h2>Infrastructure</h2>
        <ul>
          <li>
            <strong>Authentication</strong> — Clerk handles all auth flows with
            session management, MFA support, and OAuth providers.
          </li>
          <li>
            <strong>Database</strong> — Supabase with row-level security (RLS)
            on all tables. Service role key is never exposed to the client.
          </li>
          <li>
            <strong>Rate Limiting</strong> — Upstash Redis sliding-window
            limiters on the public chat and assistant endpoints.
          </li>
        </ul>

        <h2>Data Protection</h2>
        <ul>
          <li>All connections use HTTPS/TLS.</li>
          <li>Assistant chat conversations are not persisted by this site.</li>
        </ul>

        <h2>Responsible Disclosure</h2>
        <p>
          If you discover a security vulnerability, please report it responsibly
          to contact@davidpapp.dev. This is a personal portfolio site maintained
          by one person; reports are handled on a best-effort basis.
        </p>

        <h2>Dependencies</h2>
        <p>npm dependencies are updated and patched on a best-effort basis.</p>
      </article>
    </div>
  );
}
