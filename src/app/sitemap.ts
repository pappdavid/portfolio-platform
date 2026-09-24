import type { MetadataRoute } from 'next';

const siteUrl = 'https://davidpapp.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/about',
    '/projects',
    '/security',
    '/privacy-policy',
    '/terms-of-service',
    '/demos/self-interview/',
    '/demos/task-to-flow/',
    '/demos/rolefit-quiz/'
  ];

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: route.startsWith('/demos/') ? 'monthly' : 'weekly',
    priority: route === '/' ? 1 : route === '/projects' ? 0.9 : 0.7
  }));
}
