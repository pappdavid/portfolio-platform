import localFont from 'next/font/local';
import { cn } from '@/lib/utils';

// Geist — self-hosted (no network required at build time)
const fontSans = localFont({
  src: '../../../public/fonts/geist.woff2',
  variable: '--font-sans',
  display: 'swap'
});

const fontMono = localFont({
  src: '../../../public/fonts/geist-mono.woff2',
  variable: '--font-mono',
  display: 'swap'
});

// Remaining themes use these CSS variable names.
// The variables are declared here so the classes exist on <body>;
// actual font stacks are set per-theme in the theme CSS files.
const fontInstrument = localFont({
  src: '../../../public/fonts/geist.woff2',
  variable: '--font-instrument',
  display: 'optional'
});

const fontNotoMono = localFont({
  src: '../../../public/fonts/geist-mono.woff2',
  variable: '--font-noto-mono',
  display: 'optional'
});

const fontMullish = localFont({
  src: '../../../public/fonts/geist.woff2',
  variable: '--font-mullish',
  display: 'optional'
});

const fontInter = localFont({
  src: '../../../public/fonts/geist.woff2',
  variable: '--font-inter',
  display: 'optional'
});

const fontArchitectsDaughter = localFont({
  src: '../../../public/fonts/geist.woff2',
  variable: '--font-architects-daughter',
  display: 'optional'
});

const fontDMSans = localFont({
  src: '../../../public/fonts/geist.woff2',
  variable: '--font-dm-sans',
  display: 'optional'
});

const fontFiraCode = localFont({
  src: '../../../public/fonts/geist-mono.woff2',
  variable: '--font-fira-code',
  display: 'optional'
});

const fontOutfit = localFont({
  src: '../../../public/fonts/geist.woff2',
  variable: '--font-outfit',
  display: 'optional'
});

const fontSpaceMono = localFont({
  src: '../../../public/fonts/geist-mono.woff2',
  variable: '--font-space-mono',
  display: 'optional'
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInstrument.variable,
  fontNotoMono.variable,
  fontMullish.variable,
  fontInter.variable,
  fontArchitectsDaughter.variable,
  fontDMSans.variable,
  fontFiraCode.variable,
  fontOutfit.variable,
  fontSpaceMono.variable
);
