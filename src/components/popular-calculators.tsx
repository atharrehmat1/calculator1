'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { api, type Calculator as CalculatorType } from '@/lib/api';
import { getCategoryIcon } from '@/lib/categories';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PopularCalculators() {
  const [calculators, setCalculators] = useState<CalculatorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        
        const data = await api.calculators.getAll({ popular: true, is_active: true });
        
        const limitedData = Array.isArray(data) ? data.slice(0, 12) : [];
        
        setCalculators(limitedData);
      } catch (error) {
        setCalculators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  if (loading) {
    return (
      <>
        <h2 className="text-3xl font-bold text-center font-headline mb-8">
          Popular Calculators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col h-full animate-pulse">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-muted rounded-xl" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-4 bg-muted rounded w-4/6" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-10 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (calculators.length === 0) {
    return null; // Don't show section if no calculators
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-center font-headline mb-8">
        Popular Calculators
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => {
          const IconComponent = getCategoryIcon(calc.category_slug) as LucideIcon;
          
          const subtitleValue = calc.subtitle && calc.subtitle.trim() ? calc.subtitle : null;
          const descriptionValue = calc.description && calc.description.trim() ? calc.description : null;
          const displayText = subtitleValue || descriptionValue || 'No description available.';
          
          return (
            <Link 
              key={calc.id} 
              href={`/calculators/${calc.category_slug}/${calc.slug}`}
              className="block group"
            >
              <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      {IconComponent && (
                        <IconComponent className="w-7 h-7 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-xl font-headline leading-tight line-clamp-2 flex-1">
                      {calc.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {displayText}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    <span>Use Calculator</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}

