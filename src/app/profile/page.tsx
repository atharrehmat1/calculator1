'use client';

import { useEffect, useState } from 'react';
import {
  Heart,
  User,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/auth-context';
import { api, type Calculator } from '@/lib/api';
import { getCategoryIcon } from '@/lib/categories';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [favoriteCalculators, setFavoriteCalculators] = useState<Calculator[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/auth');
                return;
            }
            
            // Fetch user favorites
            const fetchFavorites = async () => {
                try {
                    setLoadingFavorites(true);
                    const favorites = await api.calculatorInteractions.getUserFavorites();
                    setFavoriteCalculators(favorites);
                } catch (error: any) {
                    console.error('Error fetching favorites:', error);
                    if (error.message !== 'Authentication required') {
                        // Only set empty array if it's not an auth error (auth error will redirect)
                        setFavoriteCalculators([]);
                    }
                } finally {
                    setLoadingFavorites(false);
                }
            };

            fetchFavorites();
        }
    }, [user, authLoading, router]);

    const hasFavorites = favoriteCalculators.length > 0;

    if (authLoading || loadingFavorites) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="h-32 bg-muted rounded-lg"></div>
                    <div className="h-64 bg-muted rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

  return (
    <div className="container mx-auto px-4 py-12">
        <Card className="w-full max-w-4xl mx-auto mb-8 bg-card/50">
            <CardContent className="p-6 flex items-center gap-6">
                 <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt={user.name} />
                    <AvatarFallback>
                        <User className="h-10 w-10" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Welcome Back, {user.name}!</h1>
                    <p className="text-muted-foreground mt-1">{user.email}</p>
                </div>
            </CardContent>
        </Card>

      <section>
        <h2 className="text-3xl font-bold text-center font-headline mb-8">
          My Favorites
        </h2>
        {hasFavorites ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteCalculators.map((calc) => {
                const IconComponent = getCategoryIcon(calc.category_slug) as LucideIcon;
                const href = `/calculators/${calc.category_slug}/${calc.slug}`;
                return (
              <Card key={calc.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
                        <CardTitle className="font-headline text-lg">{calc.name}</CardTitle>
                    </div>
                     <CardDescription className="pt-2">{calc.subtitle || calc.description || 'No description available.'}</CardDescription>
                </CardHeader>
                 <CardFooter className="mt-auto">
                    <Button asChild variant="secondary" className="w-full">
                        <Link href={href}>
                        Launch
                        <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    </CardFooter>
              </Card>
                );
            })}
            </div>
        ) : (
            <div className="text-center py-12 bg-card rounded-lg">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground">Click the heart icon on any calculator to add it to your favorites.</p>
                 <Button asChild className="mt-4" variant="outline">
                    <Link href="/">Find Calculators to Love</Link>
                </Button>
            </div>
        )}
      </section>
    </div>
  );
}
