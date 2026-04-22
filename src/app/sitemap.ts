import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculator1.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  try {
    // 2. Fetch Categories for dynamic category pages
    const categories = await api.categories.getAll();
    const categoryRoutes: MetadataRoute.Sitemap = Array.isArray(categories)
      ? categories.map((cat) => ({
        url: `${SITE_URL}/calculators/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }))
      : [];

    // 3. Fetch all Calculators for individual dynamic pages
    // Since there are 3,700+, this might take a moment but Next.js handles it during build/revalidation
    const calculators = await api.calculators.getAll({ is_active: true });
    const calculatorRoutes: MetadataRoute.Sitemap = Array.isArray(calculators)
      ? calculators.map((calc) => ({
        url: `${SITE_URL}/calculators/${calc.category_slug || 'other'}/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }))
      : [];

    return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes];
  } catch (error) {
    console.error('[Sitemap] Error generating dynamic routes:', error);
    // Fallback to static routes if API fails
    return staticRoutes;
  }
}
