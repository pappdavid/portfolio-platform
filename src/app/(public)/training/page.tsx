import { Metadata } from 'next';
import { TrainingContent } from '@/components/training/training-content';

export const metadata: Metadata = {
  title: 'Custom Training — Codebase to LoRA',
  description:
    'Turn internal codebases into fine-tuned models. Automated dataset generation, training pipeline, and evaluation.'
};

export default function TrainingPage() {
  return <TrainingContent />;
}
