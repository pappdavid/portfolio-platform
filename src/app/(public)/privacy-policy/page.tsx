import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy'
};

export default function PrivacyPolicyPage() {
  return (
    <div className='py-20'>
      <article className='prose dark:prose-invert mx-auto max-w-3xl px-4'>
        <h1>Privacy Policy</h1>
        <p className='lead'>Last updated: September 2026</p>

        <h2>Data We Collect</h2>
        <p>When you use this site, the following data may be collected:</p>
        <ul>
          <li>
            <strong>Account data</strong> — email address and profile
            information provided via Clerk authentication.
          </li>
          <li>
            <strong>Referral visits</strong> — when you arrive via a referral
            link (<code>/r/&lt;token&gt;</code>), the site records the visit
            for the link owner: a truncated IP address (last octet removed,
            IPv4; equivalent truncation for IPv6), your browser user-agent
            string, and the country derived from the request. No full IP
            addresses are stored, and no cross-site tracking occurs.
          </li>
          <li>
            <strong>Referral cookie</strong> — a referral link sets one
            first-party, HTTP-only cookie (<code>dp_ref</code>) lasting 30
            days so the site can show you the role-relevant version of the
            page. It contains the referral token only, is not used for
            advertising, and is not shared with third parties.
          </li>
          <li>
            <strong>Demo usage</strong> — when a signed-in recruiter uses a
            demo, the demo type and account are logged to enforce demo
            quotas.
          </li>
          <li>
            <strong>Rate-limit counters</strong> — short-lived request
            counters for the assistant and referral endpoints. Assistant
            conversations themselves are not persisted by this site.
          </li>
        </ul>

        <h2>How We Use Your Data</h2>
        <ul>
          <li>To provide and maintain the site.</li>
          <li>To show referral recipients the most relevant version of the
            site content.</li>
          <li>To enforce rate limits, demo quotas, and prevent abuse.</li>
          <li>To improve the site based on aggregate usage patterns.</li>
        </ul>

        <h2>Retention</h2>
        <p>
          Referral visit records are deleted automatically after 90 days.
          Rate-limit counters expire within hours. Account data is kept until
          you delete your account. Demo quota records are kept while the
          quota is active and expire with it.
        </p>

        <h2>Data Storage</h2>
        <p>
          All data is stored in Supabase with row-level security (RLS)
          enabled. Authentication is managed by Clerk. No data is sold, and
          no analytics or advertising scripts are used.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your
          personal data by contacting us. Account deletion can be initiated
          through the dashboard profile settings. Because referral visit
          records contain no full IP addresses or direct identifiers, they
          cannot normally be linked back to you; deletion requests will
          nonetheless be honoured where feasible.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential cookies for authentication (Clerk session) and
          theme preference, plus the first-party referral cookie described
          above. No tracking or advertising cookies are used, and there is no
          third-party analytics on this site.
        </p>

        <h2>Contact</h2>
        <p>For privacy-related questions, contact contact@davidpapp.dev.</p>
      </article>
    </div>
  );
}
