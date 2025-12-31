'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getMainCategories, type Category } from '@/lib/categories';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CategoryNavigation() {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await getMainCategories();
        setMainCategories(categories);
      } catch (error) {
        setMainCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-center font-headline mb-4">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(13)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-center font-headline mb-6">
        Browse by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mainCategories.filter(cat => cat.count > 0).map((category) => (
          <Link href={category.href} key={category.slug} className="group">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full bg-white dark:bg-card">
              <CardContent className="p-6 flex flex-col items-start justify-center gap-3 text-left">
                <category.icon className="h-8 w-8 text-primary mb-2" />
                <span className="font-semibold font-headline text-lg text-foreground">
                  {category.name}
                </span>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">{category.count} calculators</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        <Link href="/categories" className="group">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full bg-white dark:bg-card">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-3 text-center h-full">
              <MoreHorizontal className="h-8 w-8 text-primary mb-2" />
              <span className="font-semibold font-headline text-lg text-foreground">
                Other Categories
              </span>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                View all categories
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
