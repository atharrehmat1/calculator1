import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculator1.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/auth/',
        '/profile/',
        '/session-debug/',
        '/backupCalculators/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
