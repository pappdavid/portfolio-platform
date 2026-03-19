import PageContainer from '@/components/layout/page-container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings — Portfolio Platform'
};

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>Settings coming soon.</p>
      </div>
    </PageContainer>
  );
}
