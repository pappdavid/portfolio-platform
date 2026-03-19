import { Metadata } from 'next';

interface PageMetaInput {
  title: string;
  description: string;
  slug: string;
}

export function generatePageMetadata({
  title,
  description,
  slug
}: PageMetaInput): Metadata {
  const fullTitle = `${title} — David Papp`;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: [{ url: `/og/${slug}.png`, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`/og/${slug}.png`]
    }
  };
}
