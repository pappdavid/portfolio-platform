import type { Metadata } from 'next';
import { VoidArchExperience } from '@/components/voidarch/voidarch-experience';

export const metadata: Metadata = {
  title: 'VoidArch — Systems Around the Model',
  description:
    'VoidArch is a modular architecture for persistent context, routing, observable execution, and durable evidence in long-running AI systems.'
};

export default function VoidArchPage() {
  return <VoidArchExperience />;
}
