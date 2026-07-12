import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service'
};

export default function TermsOfServicePage() {
  return (
    <div className='py-20'>
      <article className='prose dark:prose-invert mx-auto max-w-3xl px-4'>
        <h1>Terms of Service</h1>
        <p className='lead'>Last updated: July 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using this personal portfolio site, you agree to be
          bound by these terms. If you do not agree, do not use the site.
        </p>

        <h2>Use of Services</h2>
        <p>You agree to:</p>
        <ul>
          <li>Use the site only for lawful purposes.</li>
          <li>Not attempt to circumvent rate limits or security measures.</li>
          <li>
            Not use the site to process data you do not own or have rights to.
          </li>
          <li>
            Not attempt to disrupt or abuse the site or its assistant endpoints.
          </li>
        </ul>

        <h2>Assistant Usage</h2>
        <p>
          The assistant endpoints are rate-limited. Abuse may result in
          temporary blocking.
        </p>

        <h2>Disclaimer</h2>
        <p>
          This personal portfolio site is provided &ldquo;as is&rdquo; without
          warranty of any kind. AI-generated assistant answers should be
          verified against the linked repositories and CV.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          We are not liable for any indirect, incidental, or consequential
          damages arising from your use of this site.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms at any time. Continued use constitutes
          acceptance of updated terms.
        </p>
      </article>
    </div>
  );
}
