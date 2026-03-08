import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { TrainingDashboardContent } from '@/features/training-dashboard/components/training-dashboard-content';

export const metadata = {
  title: 'Training Dashboard'
};

export default function TrainingDashboardPage() {
  return (
    <PageContainer>
      <Heading
        title='Training'
        description='View datasets and training job status.'
      />
      <TrainingDashboardContent />
    </PageContainer>
  );
}
