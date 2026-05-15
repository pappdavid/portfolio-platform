import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';
import '@/styles/themes/davidpapp.css';

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className='bg-[#060608]'
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,197,94,0.06) 0%, transparent 60%)'
      }}
    >
      <PublicHeader />
      <main className='relative min-h-[calc(100dvh-3.5rem)]'>{children}</main>
      <Footer />
    </div>
  );
}
