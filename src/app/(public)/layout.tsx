import '@/styles/themes/davidpapp.css';
import { ThreeCanvas } from '@/components/landing/three-canvas';

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='crt-flicker relative min-h-screen overflow-hidden bg-[#0a0a0a] text-[#e8e8e8] selection:bg-[rgba(0,255,136,0.25)] selection:text-white'>
      {/* Fullscreen ThreeJS Constellation Background */}
      <div className='pointer-events-none fixed inset-0 z-0'>
        <ThreeCanvas className='h-full w-full' />
      </div>

      {/* Radial vignette overlay to keep monospace text clean and legible */}
      <div
        className='pointer-events-none fixed inset-0 z-1'
        style={{
          background:
            'radial-gradient(circle at center, transparent 45%, rgba(10, 10, 10, 0.75) 95%)'
        }}
      />

      {/* CRT Scanline overlay */}
      <div className='crt-overlay' />

      {/* Main page content */}
      <main className='relative z-10 min-h-screen'>{children}</main>
    </div>
  );
}
