import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service'
};

export default function TermsOfServicePage() {
  return (
    <div className='py-20'>
      <article className='prose dark:prose-invert mx-auto max-w-3xl px-4'>
        <h1>Terms of Service</h1>
        <p className='lead'>Last updated: March 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using this platform, you agree to be bound by these
          terms. If you do not agree, do not use the platform.
        </p>

        <h2>Use of Services</h2>
        <p>You agree to:</p>
        <ul>
          <li>Use the platform only for lawful purposes.</li>
          <li>Not attempt to circumvent rate limits or security measures.</li>
          <li>
            Not use the platform to process data you do not own or have rights
            to.
          </li>
          <li>Not reverse engineer or redistribute platform components.</li>
        </ul>

        <h2>API Usage</h2>
        <p>
          MCP Sentinel API keys are personal and non-transferable. Abuse of API
          endpoints may result in rate limiting or key revocation.
        </p>

        <h2>Training Data</h2>
        <p>
          You retain ownership of all data you upload to the training pipeline.
          We do not use your training data for any purpose other than processing
          your requested fine-tuning job.
        </p>

        <h2>Disclaimer</h2>
        <p>
          This platform is provided &ldquo;as is&rdquo; without warranty of any
          kind. AI-generated outputs should be reviewed before use in production
          systems.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          We are not liable for any indirect, incidental, or consequential
          damages arising from your use of the platform.
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
