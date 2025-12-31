'use client';

import Link from 'next/link';
import { getCategories, type Category } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export function CategoryList({ currentCategory }: { currentCategory?: string }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (error) {
                // Error handled silently
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Categories</CardTitle>
            </CardHeader>
            <CardContent>
                <nav className="flex flex-col gap-2">
                    {categories.filter(cat => cat.count > 0).map(category => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className={cn(
                                'flex justify-between items-center px-3 py-2 text-sm rounded-md transition-colors',
                                currentCategory === category.slug
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            )}
                        >
                            <span>{category.name}</span>
                            <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                currentCategory === category.slug
                                    ? 'bg-primary-foreground text-primary'
                                    : 'bg-muted text-muted-foreground'
                            )}>{category.count}</span>
                        </Link>
                    ))}
                </nav>
            </CardContent>
        </Card>
    );
}
