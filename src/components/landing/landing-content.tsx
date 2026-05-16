'use client';

import { useRef } from 'react';
import { SceneBackground } from '@/components/landing/scene-background';
import { Chrome2 } from '@/components/landing/chrome2';
import { HeroSection } from '@/components/landing/hero-section';
import { ProofSection } from '@/components/landing/proof-section';
import { SystemsSection } from '@/components/landing/systems-section';
import { AssistantSection } from '@/components/landing/assistant-section';
import { ContactSection } from '@/components/landing/contact-section';
import { FooterSig } from '@/components/landing/footer-sig';
import type { ThreeCanvasRef } from '@/components/landing/three-canvas';

export function LandingContent() {
  // Shared canvas ref — passed both to the page-wide scene background
  // (which owns the actual ThreeCanvas instance) and to SystemsSection so
  // dossier hover still drives module focus inside the same scene.
  const canvasRef = useRef<ThreeCanvasRef | null>(null);

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <SceneBackground ref={canvasRef} />
      <Chrome2 />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <ProofSection />
        <SystemsSection canvasRef={canvasRef} />
        <AssistantSection />
        <ContactSection />
      </main>
      <FooterSig />
    </div>
  );
}
