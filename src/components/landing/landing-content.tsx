'use client';

import { useRef } from 'react';
import { WorldBg } from '@/components/landing/world-bg';
import { Chrome2 } from '@/components/landing/chrome2';
import { HeroSection } from '@/components/landing/hero-section';
import { ProofSection } from '@/components/landing/proof-section';
import { SystemsSection } from '@/components/landing/systems-section';
import { AssistantSection } from '@/components/landing/assistant-section';
import { ContactSection } from '@/components/landing/contact-section';
import { FooterSig } from '@/components/landing/footer-sig';
import type { ThreeCanvasRef } from '@/components/landing/three-canvas';

export function LandingContent() {
  const canvasRef = useRef<ThreeCanvasRef | null>(null);

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <WorldBg />
      <Chrome2 />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection canvasRef={canvasRef} />
        <ProofSection />
        <SystemsSection canvasRef={canvasRef} />
        <AssistantSection />
        <ContactSection />
      </main>
      <FooterSig />
    </div>
  );
}
