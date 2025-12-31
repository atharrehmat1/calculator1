'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sigma,
  Landmark,
  Atom,
  FlaskConical,
  HeartPulse,
  ArrowRightLeft,
  BarChart3,
  Construction,
  Scale,
  Leaf,
  UtensilsCrossed,
  Trophy,
  Calculator,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DefaultCategory {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
}

const DEFAULT_CATEGORIES: DefaultCategory[] = [
  {
    name: 'Math',
    slug: 'math',
    icon: Sigma,
    description: 'Algebra, geometry, calculus, and more',
  },
  {
    name: 'Finance',
    slug: 'finance',
    icon: Landmark,
    description: 'Loans, investments, mortgages',
  },
  {
    name: 'Physics',
    slug: 'physics',
    icon: Atom,
    description: 'Motion, energy, forces',
  },
  {
    name: 'Chemistry',
    slug: 'chemistry',
    icon: FlaskConical,
    description: 'Molecular weight, reactions',
  },
  {
    name: 'Health',
    slug: 'health',
    icon: HeartPulse,
    description: 'BMI, body fat, calories',
  },
  {
    name: 'Conversion',
    slug: 'conversion',
    icon: ArrowRightLeft,
    description: 'Unit converters',
  },
  {
    name: 'Statistics',
    slug: 'statistics',
    icon: BarChart3,
    description: 'Probability, distributions',
  },
  {
    name: 'Construction',
    slug: 'construction',
    icon: Construction,
    description: 'Area, volume, materials',
  },
  {
    name: 'Food',
    slug: 'food',
    icon: UtensilsCrossed,
    description: 'Nutrition, recipes',
  },
  {
    name: 'Sports',
    slug: 'sports',
    icon: Trophy,
    description: 'Fitness, performance',
  },
];

export function DefaultCategoryCards() {
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
          {DEFAULT_CATEGORIES.map((category) => (
            <Link 
              href={`/calculators/${category.slug}`} 
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
                      {category.description}
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

