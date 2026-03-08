import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy'
};

export default function PrivacyPolicyPage() {
  return (
    <div className='py-20'>
      <article className='prose dark:prose-invert mx-auto max-w-3xl px-4'>
        <h1>Privacy Policy</h1>
        <p className='lead'>Last updated: March 2026</p>

        <h2>Data We Collect</h2>
        <p>When you use this platform, we may collect the following data:</p>
        <ul>
          <li>
            <strong>Account data</strong> — email address and profile
            information provided via Clerk authentication.
          </li>
          <li>
            <strong>Usage data</strong> — page views, feature usage, and
            interaction patterns for analytics.
          </li>
          <li>
            <strong>API logs</strong> — MCP event logs, training job metadata,
            and chat session data stored in Supabase.
          </li>
        </ul>

        <h2>How We Use Your Data</h2>
        <ul>
          <li>To provide and maintain the platform services.</li>
          <li>To enforce rate limits and prevent abuse.</li>
          <li>To improve the platform based on aggregate usage patterns.</li>
        </ul>

        <h2>Data Storage</h2>
        <p>
          All data is stored in Supabase with row-level security (RLS) enabled.
          Authentication is managed by Clerk. No data is sold or shared with
          third parties.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data by contacting us. Account deletion can be initiated through the
          dashboard profile settings.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential cookies for authentication (Clerk session) and theme
          preference. No tracking cookies are used.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy-related questions, reach out via the contact information
          on the About page.
        </p>
      </article>
    </div>
  );
}
