import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { ReferralsDashboardContent } from '@/features/referrals/components/referrals-dashboard-content';

export const metadata = {
  title: 'Referrals Dashboard'
};

export default function ReferralsDashboardPage() {
  return (
    <PageContainer>
      <Heading
        title='Referrals'
        description='Track referral links and visits.'
      />
      <ReferralsDashboardContent />
    </PageContainer>
  );
}
