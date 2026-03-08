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
            <strong>Rate Limiting</strong> — Upstash Redis sliding window
            limiters on all API endpoints.
          </li>
          <li>
            <strong>HMAC Signing</strong> — MCP API requests are signed with
            HMAC-SHA256 to prevent tampering.
          </li>
        </ul>

        <h2>MCP Sentinel Guards</h2>
        <ul>
          <li>Prompt injection detection on all incoming tool calls.</li>
          <li>PII scanning with automatic redaction.</li>
          <li>Cost tracking with per-key spending limits.</li>
          <li>Output validation against expected schemas.</li>
        </ul>

        <h2>Data Protection</h2>
        <ul>
          <li>All connections use HTTPS/TLS.</li>
          <li>API keys are hashed before storage.</li>
          <li>
            Training data is processed in-memory and not persisted beyond the
            job lifecycle.
          </li>
          <li>Chat conversations are ephemeral unless explicitly saved.</li>
        </ul>

        <h2>Responsible Disclosure</h2>
        <p>
          If you discover a security vulnerability, please report it
          responsibly. Contact details are available on the About page. We aim
          to acknowledge reports within 48 hours and resolve critical issues
          within 7 days.
        </p>

        <h2>Dependencies</h2>
        <p>
          We regularly audit npm dependencies and apply security patches.
          Critical vulnerabilities are addressed within 24 hours of disclosure.
        </p>
      </article>
    </div>
  );
}
