import '@/styles/themes/davidpapp.css';

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#0a0a0a] text-[#e8e8e8] selection:bg-[rgba(0,255,136,0.25)] selection:text-white'>
      <main className='relative min-h-screen'>{children}</main>
    </div>
  );
}
