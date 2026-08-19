import type { ReferralPersonalizationSnapshot } from '@/lib/referral-personalization';

interface ReferralBannerProps {
  referral: ReferralPersonalizationSnapshot | null;
}

export function ReferralBanner({ referral }: ReferralBannerProps) {
  if (!referral) return null;

  return (
    <div className='relative z-20 border-b border-[var(--dp-border)] bg-[rgba(10,10,10,0.92)] px-4 py-2 font-mono text-xs text-[var(--dp-text-dim)] backdrop-blur'>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1'>
        <span className='font-bold text-[var(--dp-accent)]'>
          REFERRAL_CONTEXT
        </span>
        <span>{'//'}</span>
        <span className='text-[var(--dp-text)]'>{referral.company}</span>
        {referral.role && (
          <>
            <span>·</span>
            <span>{referral.role}</span>
          </>
        )}
        {referral.focus?.slice(0, 4).map((item) => (
          <span
            key={item}
            className='border border-[var(--dp-border)] px-1.5 py-0.5 text-[10px] text-[var(--dp-accent-muted)]'
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
