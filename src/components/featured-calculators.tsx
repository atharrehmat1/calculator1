'use client';

import { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { api, type Calculator as CalculatorType } from '@/lib/api';

export function FeaturedCalculators() {
  const [calculators, setCalculators] = useState<CalculatorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostUsed = async () => {
      try {
        setLoading(true);
        
        const data = await api.calculators.getAll({ most_used: true, is_active: true });
        
        const limitedData = Array.isArray(data) ? data.slice(0, 9) : [];
        setCalculators(limitedData);
      } catch (error) {
        // Fallback to empty array on error
        setCalculators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMostUsed();
  }, []);

  if (loading) {
    return (
      <>
        <h2 className="text-3xl font-bold text-center font-headline mb-8">
          Most Used Calculators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                <div className="flex-1">
                  <div className="h-5 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </CardHeader>
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
        Most Used Calculators
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <Card key={calc.id} className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
              <Calculator className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-lg">{calc.name}</CardTitle>
                <CardDescription>
                  {calc.description || `${calc.category_name} - ${calc.subcategory_name}`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild variant="secondary" className="w-full">
                <Link href={`/calculators/${calc.category_slug}/${calc.subcategory_slug}/${calc.slug}`}>
                  Launch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button variant="outline" asChild size="lg">
          <Link href="#categories">
            See More Calculators
          </Link>
        </Button>
      </div>
    </>
  );
}
