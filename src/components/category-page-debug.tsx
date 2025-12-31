'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { getCategories } from '@/lib/categories';
import Link from 'next/link';

export function CategoryPageDebug() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Always show debug for now (temporarily enabled for Render debugging)
  // Can be toggled with ?debug=false to hide
  const showDebug = searchParams?.get('debug') !== 'false';

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        const categorySlug = pathname?.split('/').pop() || '';
        
        console.log('[CategoryPageDebug] Pathname:', pathname);
        console.log('[CategoryPageDebug] Category slug from pathname:', categorySlug);
        
        const allCategories = await getCategories();
        console.log('[CategoryPageDebug] Categories fetched:', {
          count: allCategories.length,
          slugs: allCategories.map(c => c.slug),
          categories: allCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
        });
        
        console.log('[CategoryPageDebug] Looking for category with slug:', categorySlug);
        console.log('[CategoryPageDebug] Available slugs:', allCategories.map(c => c.slug));
        console.log('[CategoryPageDebug] Slug match check:', {
          searchedSlug: categorySlug,
          availableSlugs: allCategories.map(c => c.slug),
          exactMatch: allCategories.some(c => c.slug === categorySlug),
          caseInsensitiveMatch: allCategories.some(c => c.slug.toLowerCase() === categorySlug.toLowerCase()),
          matchingCategory: allCategories.find(c => c.slug === categorySlug || c.slug.toLowerCase() === categorySlug.toLowerCase())
        });
        
        const category = allCategories.find(c => c.slug === categorySlug);
        
        if (!category) {
          console.warn('[CategoryPageDebug] ❌ Category not found!', {
            searchedSlug: categorySlug,
            availableSlugs: allCategories.map(c => c.slug),
            allCategories: allCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
          });
        } else {
          console.log('[CategoryPageDebug] ✅ Category found:', {
            id: category.id,
            name: category.name,
            slug: category.slug
          });
        }
        
        let calculators: any[] = [];
        let subcategories: any[] = [];
        
        if (category) {
          try {
            calculators = await api.calculators.getAll({ 
              category_id: category.id, 
              is_active: true 
            });
          } catch (error) {
            console.error('[CategoryPageDebug] Error fetching calculators:', error);
          }
          
          try {
            subcategories = await api.subcategories.getAll(category.id);
          } catch (error) {
            console.error('[CategoryPageDebug] Error fetching subcategories:', error);
          }
        }
        
        setDebugInfo({
          pathname,
          categorySlug,
          category,
          allCategoriesCount: allCategories.length,
          allCategories: allCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug })),
          calculatorsCount: calculators.length,
          calculators: calculators.map(c => ({ id: c.id, name: c.name, subcategory_id: c.subcategory_id })),
          subcategoriesCount: subcategories.length,
          subcategories: subcategories.map(s => ({ id: s.id, name: s.name, category_id: s.category_id })),
          categoryFound: !!category
        });
      } catch (error) {
        console.error('[CategoryPageDebug] Error:', error);
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          pathname
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (pathname?.includes('/calculators/')) {
      fetchDebugInfo();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  // Only show on category pages
  if (!pathname?.includes('/calculators/')) {
    return null;
  }
  
  // Always show in production for now (can be toggled with ?debug=true in URL)
  // This ensures it shows on Render deployment
  const shouldShow = showDebug || true; // Temporarily always show
  
  if (!shouldShow) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded mb-4">
        <p className="text-sm font-semibold">Loading debug info...</p>
      </div>
    );
  }

  if (!debugInfo) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4 bg-blue-50 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-400 rounded mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">🐛 Category Page Debug Info</h3>
        <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">
          {typeof window !== 'undefined' ? 'Client-side' : 'Server-side'}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Pathname:</strong> {debugInfo.pathname}
        </div>
        <div>
          <strong>Category Slug:</strong> {debugInfo.categorySlug}
        </div>
        <div>
          <strong>Category Found:</strong> {debugInfo.categoryFound ? '✅ Yes' : '❌ No'}
        </div>
        {debugInfo.category ? (
          <>
            <div>
              <strong>Category:</strong> {debugInfo.category.name} (ID: {debugInfo.category.id})
            </div>
            <div>
              <strong>Calculators:</strong> {debugInfo.calculatorsCount}
            </div>
            <div>
              <strong>Subcategories:</strong> {debugInfo.subcategoriesCount}
            </div>
            {debugInfo.subcategoriesCount > 0 && (
              <div>
                <strong>Subcategory Names:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {debugInfo.subcategories?.map((sub: any) => (
                    <li key={sub.id}>{sub.name} (ID: {sub.id})</li>
                  ))}
                </ul>
              </div>
            )}
            {debugInfo.calculatorsCount > 0 && (
              <div>
                <strong>Calculator Names:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  {debugInfo.calculators?.slice(0, 5).map((calc: any) => (
                    <li key={calc.id}>{calc.name} (Subcategory ID: {calc.subcategory_id})</li>
                  ))}
                  {debugInfo.calculatorsCount > 5 && <li>... and {debugInfo.calculatorsCount - 5} more</li>}
                </ul>
              </div>
            )}
          </>
        ) : (
            <div>
              <strong className="text-red-600 dark:text-red-400">❌ Category "{debugInfo.categorySlug}" NOT FOUND</strong>
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900 rounded">
                <strong>Available Categories ({debugInfo.allCategoriesCount}):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  {debugInfo.allCategories?.map((cat: any) => (
                    <li key={cat.id}>
                      <Link href={`/calculators/${cat.slug}`} className="text-primary hover:underline font-medium">
                        {cat.name} ({cat.slug}) - ID: {cat.id}
                      </Link>
                    </li>
                  ))}
                </ul>
                {!debugInfo.allCategories?.some((cat: any) => cat.slug.toLowerCase() === debugInfo.categorySlug?.toLowerCase()) && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    ⚠️ No category found with slug "{debugInfo.categorySlug}" (case-insensitive check also failed)
                  </p>
                )}
              </div>
            </div>
        )}
        {debugInfo.error && (
          <div className="text-red-600 dark:text-red-400">
            <strong>Error:</strong> {debugInfo.error}
          </div>
        )}
        <details className="mt-2">
          <summary className="cursor-pointer font-semibold">Full Debug Data</summary>
          <pre className="mt-2 text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-auto max-h-64">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

