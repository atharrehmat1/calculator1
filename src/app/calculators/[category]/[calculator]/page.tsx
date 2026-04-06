import type { Metadata, ResolvingMetadata } from 'next';
import CalculatorClient from './calculator-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nextjs-app.onrender.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchCalculatorBySlug(slug: string, categorySlug: string) {
  try {
    const categoriesRes = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (!categoriesRes.ok) return null;
    const categories = await categoriesRes.json();
    const category = categories.find((c: any) => c.slug === categorySlug);

    if (!category) return null;

    const calcRes = await fetch(
      `${API_BASE_URL}/calculators/slug/${slug}?category_id=${category.id}`,
      { cache: 'no-store' }
    );
    if (!calcRes.ok) return null;
    return calcRes.json();
  } catch {
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
