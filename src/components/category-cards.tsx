'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getMainCategories, type Category } from '@/lib/categories';
import { DefaultCategoryCards } from './default-category-cards';
import { useEffect, useState } from 'react';

export function CategoryCards() {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await getMainCategories();
        setMainCategories(categories);
        setError(false);
      } catch (error) {
        setError(true);
        setMainCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center font-headline mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If error or no categories, show default categories
  if (error || mainCategories.length === 0) {
    return <DefaultCategoryCards />;
  }

  // Show fetched categories if available
  return (
    <div className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our wide range of calculator categories to find exactly what you need
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mainCategories.filter(cat => cat.count > 0).map((category) => (
            <Link 
              href={category.href} 
              key={category.slug} 
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-primary/50 bg-white dark:bg-card">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <category.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold font-headline text-xl text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} {category.count === 1 ? 'calculator' : 'calculators'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

