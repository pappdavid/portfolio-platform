import { Glyph } from '@/components/landing/glyph';

export function HeroCTAs() {
  return (
    <div className="flex flex-col gap-3 mt-10">
      <div className="flex gap-3 flex-wrap">
        <a href="mailto:contact@davidpapp.dev" className="dp-btn dp-btn-primary">
          <Glyph kind="mail" size={14} color="#0c0b09" /> Email me
        </a>
        <a href="https://calendly.com/david-webinform/30min" target="_blank" rel="noopener noreferrer" className="dp-btn dp-btn-ghost">
          <Glyph kind="cal" size={14} /> Book a 20-min call
        </a>
      </div>
      <a href="/cv.pdf" download className="dp-btn dp-btn-ghost" style={{ width: 'fit-content' }}>
        <Glyph kind="download" size={14} /> Download CV
      </a>
    </div>
  );
}
