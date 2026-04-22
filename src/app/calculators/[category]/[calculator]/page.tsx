import type { Metadata, ResolvingMetadata } from 'next';
import CalculatorClient from './calculator-client';
import { API_BASE_URL } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculator1.org';

async function fetchCalculatorBySlug(slug: string, categorySlug: string) {
  try {
    // 1. Try to fetch with category context first (correct structure)
    const categoriesRes = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (categoriesRes.ok) {
      const categories = await categoriesRes.json();
      const category = categories.find((c: any) => c.slug === categorySlug);

      if (category) {
        const calcRes = await fetch(
          `${API_BASE_URL}/calculators/slug/${slug}?category_id=${category.id}`,
          { cache: 'no-store' }
        );
        if (calcRes.ok) return await calcRes.json();
      } else {
        console.warn(`[Metadata] Category not found for slug: ${categorySlug}. Trying fallback fetch by calculator slug only.`);
      }
    }

    // 2. Fallback: Try to fetch by slug directly (the backend might support this or we search manually)
    // Looking at the admin panel's list logic, sometimes slugs can be fetched regardless of category
    const allCalcsRes = await fetch(`${API_BASE_URL}/calculators`, { cache: 'no-store' });
    if (allCalcsRes.ok) {
      const allCalculators = await allCalcsRes.json();
      const found = allCalculators.find((c: any) => c.slug === slug);
      if (found) {
        console.log(`[Metadata] Found calculator via fallback for slug: ${slug}`);
        return found;
      }
    }

    console.error(`[Metadata] Failed to find calculator for slug "${slug}" in category "${categorySlug}". API URL: ${API_BASE_URL}`);
    return null;
  } catch (error) {
    console.error(`[Metadata] Error fetching calculator metadata:`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string; calculator: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category: categorySlug, calculator: calculatorSlug } = await params;
  const calculator = await fetchCalculatorBySlug(calculatorSlug, categorySlug);

  if (!calculator) {
    return {
      title: 'Calculator Not Found - Calculator1.org',
      description: 'The calculator you are looking for does not exist.',
      robots: 'noindex',
    };
  }

  const title = calculator.meta_title || `${calculator.name} - Free Online Calculator`;
  const description = calculator.meta_description ||
    (calculator.description
      ? calculator.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Use our free ${calculator.name} to calculate results quickly and easily.`);
  const keywords = calculator.meta_keywords || `${calculator.name}, calculator, free online calculator`;
  const canonicalUrl = `${SITE_URL}/calculators/${categorySlug}/${calculatorSlug}`;

  const featuredImage = calculator.featured_image
    ? (calculator.featured_image.startsWith('http')
      ? calculator.featured_image
      : `${API_BASE_URL.replace('/api', '')}${calculator.featured_image}`)
    : null;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Calculator1.org',
      images: featuredImage ? [{ url: featuredImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: featuredImage ? [featuredImage] : undefined,
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ category: string; calculator: string }>;
}) {
  const { category, calculator: calculatorSlug } = await params;

  return <CalculatorClient categorySlug={category} calculatorSlug={calculatorSlug} />;
}
