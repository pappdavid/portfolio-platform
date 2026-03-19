import PageContainer from '@/components/layout/page-container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing — Portfolio Platform'
};

export default function BillingPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <h2 className='text-2xl font-bold tracking-tight'>Billing</h2>
        <p className='text-muted-foreground'>
          Billing is not available in this portfolio demo.
        </p>
      </div>
    </PageContainer>
  );
}
