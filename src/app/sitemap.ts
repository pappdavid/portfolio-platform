import type { MetadataRoute } from 'next';
import notes from '@/data/field-notes.json';

const siteUrl = 'https://davidpapp.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/projects',
    '/security',
    '/privacy-policy',
    '/terms-of-service',
    '/demos/self-interview/index.html',
    '/demos/task-to-flow/index.html',
    '/demos/rolefit-quiz/index.html',
    '/demos/mercury/index.html',
    '/faultline/index.html',
    ...notes.map((note) => `/notes/${note.slug}`)
  ];

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: route.startsWith('/demos/') ? 'monthly' : 'weekly',
    priority: route === '/' ? 1 : route === '/projects' ? 0.9 : 0.7
  }));
}
