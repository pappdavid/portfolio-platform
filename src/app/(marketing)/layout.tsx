import type { Metadata } from 'next';
import '@/styles/themes/davidpapp.css';

export const metadata: Metadata = {
  title: 'David Papp — AI Engineering',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
