import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'Sign in — David Papp',
  description: 'Sign in to the dashboard.'
};

export default function Page() {
  return <SignInViewPage />;
}
