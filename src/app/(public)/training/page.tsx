import { generatePageMetadata } from '@/lib/metadata';
import { TrainingContent } from '@/components/training/training-content';

export const metadata = generatePageMetadata({
  title: 'Custom Training',
  description:
    'Automated pipeline to convert codebases into fine-tuning datasets with LoRA support.',
  slug: 'training'
});

export default function TrainingPage() {
  return <TrainingContent />;
}
