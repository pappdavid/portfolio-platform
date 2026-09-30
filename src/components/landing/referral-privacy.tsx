'use client';

import { useState } from 'react';

export function ReferralPrivacy({ token }: { token: string }) {
  const [choice, setChoice] = useState<'off' | 'allowed' | 'rejected'>('off');
  const [receipt, setReceipt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function count() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/ref/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'count', consent: true, token })
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setReceipt(data.receipt);
      setChoice('allowed');
    } catch {
      setError('Counting is unavailable. No further tracking will occur.');
    } finally {
      setBusy(false);
    }
  }
  async function withdraw() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/ref/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'withdraw', receipt })
      });
      if (!response.ok) throw new Error();
      setChoice('rejected');
      setReceipt('');
    } catch {
      setError(
        'Unable to remove this count. Contact contact@davidpapp.dev for help.'
      );
    } finally {
      setBusy(false);
    }
  }
  const button =
    'border border-current rounded px-3 py-1.5 text-sm disabled:opacity-50';
  return (
    <aside
      aria-label='Optional visit counting'
      className='relative z-20 border-b border-[var(--dp-border)] bg-[var(--dp-bg)] px-4 py-3 text-sm text-[var(--dp-text)]'
    >
      <div className='mx-auto flex max-w-6xl flex-wrap items-center gap-3'>
        <p className='min-w-64 flex-1'>
          This link selects company and role content for this page. Counting is
          optional and off until you allow one aggregate page count. No IP,
          browser details, tracking cookie, or activity history is saved.{' '}
          <a className='underline' href='/privacy-policy'>
            Privacy details
          </a>
        </p>
        {choice === 'off' && (
          <>
            <button
              className={button}
              disabled={busy}
              onClick={() => setChoice('rejected')}
            >
              Reject counting
            </button>
            <button className={button} disabled={busy} onClick={count}>
              Allow this count
            </button>
          </>
        )}
        {choice === 'allowed' && (
          <>
            <span role='status'>
              One count allowed. Withdraw on this page within 24 hours.
            </span>
            <button className={button} disabled={busy} onClick={withdraw}>
              Withdraw and remove count
            </button>
          </>
        )}
        {choice === 'rejected' && (
          <span role='status'>Counting off. The page works normally.</span>
        )}
        {error && <p role='alert'>{error}</p>}
      </div>
    </aside>
  );
}
