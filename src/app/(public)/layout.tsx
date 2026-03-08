import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className='min-h-[calc(100dvh-3.5rem)]'>{children}</main>
      <Footer />
    </>
  );
}
