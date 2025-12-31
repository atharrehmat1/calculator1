
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryNavigation } from '@/components/category-navigation';
import { PopularCalculators } from '@/components/popular-calculators';
import { AdvancedCalculator } from '@/components/advanced-calculator';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const AppStoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const PlayStoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
  </svg>
);

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-14 lg:py-16 bg-gradient-to-b from-white to-background dark:from-card dark:to-background">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 md:px-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
              Every Calculation
              <br />
              <span className="text-primary">You Need</span>—One Click Away
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-6">
              Over 3,700 free calculators covering everything from algebra and calculus to finance, 
              health, construction, and everyday calculations. Whether you're solving complex equations, 
              planning your budget, calculating loan payments, or converting units, we've got the perfect 
              tool for you. All calculators are completely free, easy to use, and work instantly—no downloads 
              or sign-ups required. Start calculating now and get accurate results in seconds.
            </p>
            {/* <div className="mt-8 max-w-lg mx-auto lg:mx-0">
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="h-14 text-lg font-headline w-full"
                  asChild
                >
                  <Link href="/get-app">
                    <AppStoreIcon className="w-8 h-8 mr-2" />
                    App Store
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 text-lg font-headline w-full"
                  asChild
                >
                  <Link href="/get-app">
                    <PlayStoreIcon className="w-8 h-8 mr-2" />
                    Google Play
                  </Link>
                </Button>
              </div>
            </div> */}
          </div>
          <div className="flex items-center justify-center">
            <AdvancedCalculator />
          </div>
        </div>
      </section>

      {/* Navigation + Search Section */}
      <section id="categories" className="w-full py-8 md:py-12 bg-background">
        <div className="container px-4 md:px-6">
          <CategoryNavigation />
        </div>
      </section>

      {/* Popular Calculators Section */}
      <section className="w-full py-8 md:py-12 bg-background">
        <div className="container px-4 md:px-6">
          <PopularCalculators />
        </div>
      </section>
    </div>
  );
}
