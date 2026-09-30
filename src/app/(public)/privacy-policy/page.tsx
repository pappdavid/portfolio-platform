import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy and optional counting' };
export default function PrivacyPolicyPage() {
  return (
    <div className='py-20'>
      <article className='prose dark:prose-invert mx-auto max-w-3xl px-4'>
        <h1>Privacy and optional counting</h1>
        <p>
          Updated 30 September 2026. This portfolio is operated by David Papp.
          Privacy contact:{' '}
          <a href='mailto:contact@davidpapp.dev'>contact@davidpapp.dev</a>.
        </p>
        <h2>Referral links and your choice</h2>
        <p>
          A referral link selects company and role content for the current page.
          The URL contains the application link token. Opening it does not
          record a visit, set a persistent referral cookie, or collect browsing
          activity. Do not share the link if you want to keep that application
          context private. Outgoing links use a no-referrer policy.
        </p>
        <p>
          Optional counting is off by default. The page offers equally
          accessible “Reject counting” and “Allow this count” buttons. Rejection
          does not affect the content or assistant. Allowing increases a counter
          for that application link once. The site stores only an aggregate
          count and coarse calendar dates, without an IP address, browser
          user-agent, country, visitor fingerprint, page trail or time-on-page
          measurement.
        </p>
        <p>
          After allowing, “Withdraw and remove count” is available on the same
          page. A random withdrawal receipt is held only in the page’s memory;
          the server stores its hash and link association for up to 24 hours of
          withdrawal access. Closing or reloading loses that receipt, and the
          aggregate cannot then be matched to an individual visitor. Expired
          receipts are removed on later counting/withdrawal requests and by the
          existing daily sync job; deletion may be delayed if those operations
          fail. Every new page starts with counting off.
        </p>
        <p>
          Old request-level referral records were replaced with explicitly
          labelled legacy totals and coarse dates. Their raw IP, browser and
          country fields were removed. Those historical counts are not evidence
          of consent or unique people. Aggregates remain with their application
          link until that link is deleted or a review determines they are no
          longer needed.
        </p>
        <h2>Security processing and preferences</h2>
        <p>
          Hosting necessarily processes network requests, including IP
          addresses. Vercel and other processors may retain security and service
          logs under their policies. This is separate from optional referral
          counting. Rate limits use a server-hashed identifier with a daily key
          rotation before sending it to Upstash Redis. Upstash rate-limit
          analytics are disabled for new requests. Rate-limit counters have
          short operational windows; provider backups and historical logs
          require separate retention review.
        </p>
        <p>
          Referral and automatic theme cookies are no longer set. Previously
          issued referral/theme cookies are expired when you revisit the site.
          Theme choices on the public page stay in page memory. Authentication
          and dashboard features may use Clerk session cookies and preference
          storage; these are not represented as blanket-exempt cookies. Their
          purposes, necessity and processor settings require review before
          expanding their use.
        </p>
        <h2>AI assistant and demos</h2>
        <p>
          When you ask the assistant a question, the conversation and relevant
          portfolio context are sent to the configured AI service, through
          Vercel AI Gateway or OpenRouter and its model provider. Do not submit
          sensitive personal information. The application does not write raw
          conversations into its own database, but this does not guarantee that
          providers keep no logs. Provider retention, international transfers,
          contractual terms and any zero-retention option must be reviewed.
        </p>
        <p>
          Account features can process email and profile information through
          Clerk. Demo quota/event tables are not active in this site’s current
          database. Enabling account/demo usage recording requires a separate
          retention and related-account-deletion review; privacy requests can be
          sent to the contact above.
        </p>
        <h2>Storage, access and your rights</h2>
        <p>
          Supabase stores application metadata, aggregate counts and temporary
          withdrawal receipts. Browser access is restricted with row-level
          security and permissions; trusted server operations use privileged
          service credentials. Authentication is provided by Clerk, hosting by
          Vercel and rate limiting by Upstash. No service credential is included
          in browser code.
        </p>
        <p>
          You can request access, correction, deletion, objection, or
          information about processing at the privacy contact above. Optional
          counting uses the explicit page choice described here. Legal bases for
          necessary hosting, security, account/demo processing, processor
          agreements and international transfers remain subject to review; this
          implementation is not a legal compliance certification.
        </p>
      </article>
    </div>
  );
}
