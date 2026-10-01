import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'clerk.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  async redirects() {
    // Directory URLs otherwise leave relative Vite assets resolving against
    // /demos/ after Next normalizes away the trailing slash. Canonicalize both
    // spellings to the actual document URL; query context survives the redirect.
    const demos = ['rolefit-quiz', 'self-interview', 'task-to-flow'];
    const demoIndex = demos.map((slug) => ({
      source: `/demos/${slug}`,
      destination: `/demos/${slug}/index.html`,
      permanent: false
    }));

    // Routes shared externally in earlier versions of the site. The pages
    // they pointed at described projects that no longer exist in that form,
    // so they now land on the honest projects index.
    const stale = [
      '/mcp',
      '/training',
      '/chat',
      '/projects/mcp-sentinel',
      '/projects/rag-chat',
      '/projects/training',
      '/projects/portfolio'
    ];
    return [
      ...demoIndex,
      ...stale.map((source) => ({
        source,
        destination: '/projects',
        permanent: false
      }))
    ];
  },
  async headers() {
    return [
      {
        // Every other route stays framed-down: no embedding anywhere.
        // NOTE: this catch-all MUST stay BEFORE the /demos/:path* rule —
        // when two sources match the same route, the later rule's value
        // wins for a repeated key. With the old order the DENY here
        // overrode the demos' SAMEORIGIN, so every demo iframe on
        // /roles/<id> was blocked (ERR_BLOCKED_BY_RESPONSE) and rendered
        // as an empty box (verified locally + on the live Vercel deploy
        // 2026-09-02).
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer'
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      },
      {
        // Vendored demo bundles must be embeddable in the portfolio site's
        // iframe strip, so they use SAMEORIGIN instead of the strict
        // no-frame guard above. Order matters: this must come after the
        // catch-all or DENY wins.
        source: '/demos/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
