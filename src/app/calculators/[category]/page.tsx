import { getCategories } from '@/lib/categories';
import { api } from '@/lib/api';
import Link from 'next/link';
import { CategoryList } from '@/components/category-list';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

// Disable static generation for this page to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ category: string }> | { category: string } }): Promise<Metadata> {
  try {
    const resolvedParams = await Promise.resolve(params);
    const allCategories = await getCategories();
    const category = allCategories.find(c => c.slug === resolvedParams.category) || 
                     allCategories.find(c => c.slug.toLowerCase() === resolvedParams.category?.toLowerCase());
    
    if (!category) {
      return {
        title: 'Category Not Found',
        description: 'The requested category was not found.',
      };
    }

    // Use meta tags from database if available, otherwise use defaults
    const title = category.meta_title || `${category.name} Calculators - Free Online Tools`;
    const description = category.meta_description || 
      category.description || 
      `Browse our collection of free ${category.name.toLowerCase()} calculators. Easy to use tools for all your calculation needs.`;
    const keywords = category.meta_keywords || `${category.name.toLowerCase()}, calculator, online calculator, free calculator`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Calculators',
      description: 'Browse our collection of free online calculators.',
    };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> | { category: string } }) {
    try {
        // Handle both sync and async params (Next.js 14+ compatibility)
        const resolvedParams = await Promise.resolve(params);
        
        // Log to both console and create a debug object that can be accessed
        const debugData = {
            category: resolvedParams.category,
            categoryType: typeof resolvedParams.category,
            categoryLength: resolvedParams.category?.length,
            allParams: resolvedParams,
            isPromise: params instanceof Promise,
            timestamp: new Date().toISOString()
        };
        
        console.log('[CategoryPage] ========== PAGE LOAD STARTED ==========');
        console.log('[CategoryPage] Received params:', debugData);
        
        // Store debug data in a global variable for client-side access
        if (typeof globalThis !== 'undefined') {
            (globalThis as any).__categoryPageDebug__ = debugData;
        }
        
        const allCategories = await getCategories();
        console.log('[CategoryPage] Categories fetched from getCategories():', {
            count: allCategories.length,
            slugs: allCategories.map(c => c.slug),
            categories: allCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
        });
        
        console.log('[CategoryPage] Searching for category with slug:', resolvedParams.category);
        console.log('[CategoryPage] Available slugs:', allCategories.map(c => ({
            slug: c.slug,
            matches: c.slug === resolvedParams.category,
            lowercaseMatches: c.slug.toLowerCase() === resolvedParams.category?.toLowerCase()
        })));
        
        // Try exact match first
        let category = allCategories.find(c => c.slug === resolvedParams.category);
        
        // If not found, try case-insensitive match
        if (!category) {
            category = allCategories.find(c => c.slug.toLowerCase() === resolvedParams.category?.toLowerCase());
            
            if (category) {
                console.log('[CategoryPage] Category found via case-insensitive match:', {
                    searchedSlug: resolvedParams.category,
                    foundSlug: category.slug,
                    foundName: category.name
                });
            }
        }
        
        if (!category) {
            console.error('[CategoryPage] ========== CATEGORY NOT FOUND ==========');
            console.error('[CategoryPage] Search params:', {
                searchedSlug: resolvedParams.category,
                searchedSlugLower: resolvedParams.category?.toLowerCase(),
                availableSlugs: allCategories.map(c => c.slug),
                availableSlugsLower: allCategories.map(c => c.slug.toLowerCase()),
            });
            
            return (
                <div className="container py-12">
                    <h1 className="text-3xl font-bold mb-4">Category not found</h1>
                    <div className="space-y-2 text-muted-foreground">
                        <p>The category "{resolvedParams.category}" was not found.</p>
                        <p className="text-sm">Available categories:</p>
                        <ul className="list-disc list-inside text-sm">
                            {allCategories.map(cat => (
                                <li key={cat.id}>
                                    <Link href={`/calculators/${cat.slug}`} className="text-primary hover:underline">
                                        {cat.name} ({cat.slug})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }

        console.log('[CategoryPage] ========== CATEGORY FOUND ==========');
        console.log('[CategoryPage] Category details:', {
            categoryId: category.id,
            categoryName: category.name,
            categorySlug: category.slug,
            categoryHref: category.href,
            categoryCount: category.count
        });

        // Fetch calculators and subcategories in parallel
        let calculators: any[] = [];
        let subcategories: any[] = [];

        try {
            calculators = await api.calculators.getAll({ 
                category_id: category.id, 
                is_active: true 
            });
            console.log('[CategoryPage] Calculators fetched:', {
                count: calculators.length,
                calculators: calculators.map(c => ({ id: c.id, name: c.name, subcategory_id: c.subcategory_id }))
            });
        } catch (error) {
            console.error('[CategoryPage] Error fetching calculators:', error);
            // Continue with empty array
        }

        try {
            subcategories = await api.subcategories.getAll(category.id);
            console.log('[CategoryPage] Subcategories fetched:', {
                count: subcategories.length,
                subcategories: subcategories.map(s => ({ id: s.id, name: s.name, category_id: s.category_id }))
            });
        } catch (error) {
            console.error('[CategoryPage] Error fetching subcategories:', error);
            // Continue with empty array
        }

        // Group calculators by subcategory
        const calculatorsBySubcategory: Record<number, any[]> = {};
        calculators.forEach(calc => {
            if (!calculatorsBySubcategory[calc.subcategory_id]) {
                calculatorsBySubcategory[calc.subcategory_id] = [];
            }
            calculatorsBySubcategory[calc.subcategory_id].push(calc);
        });

        // Filter subcategories to only show those with calculators
        // Sort subcategories by name, but only include those that have calculators
        const sortedSubcategories = Array.isArray(subcategories) 
            ? [...subcategories]
                .filter(sub => {
                    const calcCount = calculatorsBySubcategory[sub.id]?.length || 0;
                    return calcCount > 0; // Only show subcategories with calculators
                })
                .sort((a, b) => a.name.localeCompare(b.name))
            : [];

        console.log('[CategoryPage] Final data:', {
            subcategoriesCount: sortedSubcategories.length,
            calculatorsCount: calculators.length,
            calculatorsBySubcategory: Object.keys(calculatorsBySubcategory).map(key => ({
                subcategoryId: parseInt(key),
                calculatorCount: calculatorsBySubcategory[parseInt(key)].length
            }))
        });

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Category Sidebar - Show on desktop/laptop (lg and above), hide on mobile/tablet */}
                    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <CategoryList currentCategory={category.slug} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-4xl font-bold mb-2 text-primary">{category.name} Calculators</h1>
                        <p className="text-muted-foreground mb-8">
                            Browse through our collection of {calculators.length} free {category.name.toLowerCase()} calculators.
                        </p>
                        
                        <div className="bg-card p-6 rounded-lg shadow-sm">
                    {sortedSubcategories.length > 0 ? (
                        <div className="space-y-12 mt-8">
                            {sortedSubcategories.map(subcategory => {
                                const subcategoryCalculators = calculatorsBySubcategory[subcategory.id] || [];
                                
                                // Only show subcategories that have calculators (filtered above)
                                return (
                                    <div key={subcategory.id}>
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <ArrowRight className="h-6 w-6 text-primary" />
                                            {subcategory.name}
                                            <span className="text-sm font-normal text-muted-foreground">
                                                ({subcategoryCalculators.length} {subcategoryCalculators.length === 1 ? 'calculator' : 'calculators'})
                                            </span>
                                        </h2>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                                            {subcategoryCalculators.map(calc => (
                                                <li key={calc.id} className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-primary dark:bg-white flex-shrink-0" />
                                                    <Link 
                                                        href={`/calculators/${category.slug}/${calc.slug}`}
                                                        className="text-primary dark:text-foreground hover:underline font-normal text-sm"
                                                    >
                                                        {calc.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    ) : calculators.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                            {calculators.map(calc => (
                                <li key={calc.id} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary dark:bg-white flex-shrink-0" />
                                    <Link 
                                        href={`/calculators/${category.slug}/${calc.slug}`}
                                        className="text-primary dark:text-foreground hover:underline font-normal text-sm"
                                    >
                                        {calc.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">No calculators found</h2>
                            <p className="text-muted-foreground mb-4">
                                There are no calculators available in the {category.name} category yet.
                            </p>
                            {sortedSubcategories.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-2">Subcategories in this category:</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {sortedSubcategories.map(sub => (
                                            <li key={sub.id} className="text-muted-foreground">{sub.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('[CategoryPage] ========== ERROR OCCURRED ==========');
        console.error('[CategoryPage] Error type:', error?.constructor?.name);
        console.error('[CategoryPage] Error message:', error instanceof Error ? error.message : error);
        console.error('[CategoryPage] Error stack:', error instanceof Error ? error.stack : undefined);
        console.error('[CategoryPage] Full error object:', error);
        console.error('[CategoryPage] Params at error time:', resolvedParams);
        
        return (
            <div className="container py-12">
                <h1 className="text-3xl font-bold mb-4">Error loading category</h1>
                <div className="space-y-2 text-muted-foreground">
                    <p className="font-semibold">Error details:</p>
                    <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
                    {error instanceof Error && error.stack && (
                        <details className="mt-4">
                            <summary className="cursor-pointer text-sm">Technical details</summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                                {error.stack}
                            </pre>
                        </details>
                    )}
                </div>
            </div>
        );
    }
}

export async function generateStaticParams() {
    const categories = await getCategories();
    return categories.map(category => ({
        category: category.slug,
    }));
}
