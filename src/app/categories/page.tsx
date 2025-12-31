import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getOtherCategories, type Category } from '@/lib/categories';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Ensure this page is always rendered dynamically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AllCategoriesPage() {
  // Show only the categories not in the main browse section
  let otherCategories: Category[] = [];
  try {
    otherCategories = await getOtherCategories();
    console.log('[Categories Page] Other categories fetched:', {
      count: otherCategories.length,
      categories: otherCategories.map(c => ({ name: c.name, slug: c.slug, count: c.count }))
    });
  } catch (error) {
    console.error('[Categories Page] Error fetching other categories:', error);
    otherCategories = [];
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Button variant="ghost" size="icon" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-4xl font-bold font-headline mb-2">Other Categories</h1>
        <p className="text-muted-foreground">
          Browse through additional calculator categories
        </p>
      </div>
      
      {otherCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {otherCategories.map((category) => (
            <Link href={category.href} key={category.slug} className="group">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full bg-white dark:bg-card">
                <CardContent className="p-6 flex flex-col items-start justify-center gap-3 text-left">
                  <category.icon className="h-8 w-8 text-primary mb-2" />
                  <span className="font-semibold font-headline text-lg text-foreground">
                    {category.name}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    {category.count} calculator{category.count !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No additional categories available.</p>
          <p className="text-sm text-muted-foreground">
            All categories are currently displayed in the main browse section.
          </p>
        </div>
      )}
    </div>
  );
}

