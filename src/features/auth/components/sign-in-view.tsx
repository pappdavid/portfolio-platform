import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInViewPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-[var(--dp-bg)] px-4 py-12 text-[var(--dp-text)]'>
      <section className='w-full max-w-md border border-[var(--dp-border)] bg-[var(--dp-bg-raised)] p-6 shadow-2xl shadow-black/30 sm:p-8'>
        <Link
          href='/'
          className='font-mono text-sm text-[var(--dp-accent)] hover:underline'
        >
          davidpapp.dev
        </Link>
        <p className='mt-8 font-mono text-xs tracking-[0.2em] text-[var(--dp-accent-muted)]'>
          ACCOUNT ACCESS
        </p>
        <h1 className='mt-2 text-2xl font-semibold tracking-tight'>Sign in</h1>
        <p className='mt-2 text-sm leading-relaxed text-[var(--dp-text-dim)]'>
          Sign in to continue to the dashboard.
        </p>
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
          <ClerkSignInForm
            appearance={{
              variables: {
                colorPrimary: 'var(--dp-accent)',
                colorBackground: 'var(--dp-bg-raised)',
                colorText: 'var(--dp-text)',
                colorTextSecondary: 'var(--dp-text-dim)',
                colorInputBackground: 'var(--dp-bg)',
                colorInputText: 'var(--dp-text)',
                borderRadius: '0px'
              },
              elements: {
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-[var(--dp-text)]',
                headerSubtitle: 'text-[var(--dp-text-dim)]',
                formButtonPrimary:
                  'rounded-none bg-[var(--dp-accent)] text-black hover:opacity-90',
                formFieldInput:
                  'rounded-none border-[var(--dp-border)] bg-[var(--dp-bg)] text-[var(--dp-text)]',
                footerActionLink: 'text-[var(--dp-accent)]'
              }
            }}
          />
        ) : (
          <p
            role='status'
            className='max-w-xs text-center text-sm text-[var(--dp-text-dim)]'
          >
            Authentication is not configured in this local build.
          </p>
        )}
      </section>
    </main>
  );
}
