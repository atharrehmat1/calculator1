
"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getCategories, type Category } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from "./logo";
import { useAuth } from "@/contexts/auth-context";
import { UserProfileMenu } from "./user-profile-menu";
import { api, type Calculator } from "@/lib/api";
import { LanguageSelector } from "./language-selector";


export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Calculator[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        // Error handled silently
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const currentCategory = categories.find(c => pathname?.includes(c.href));
    if (currentCategory) {
      setActiveCategory(currentCategory.slug);
    } else {
      setActiveCategory(null);
    }
  }, [categories, pathname]);

  // Search functionality
  useEffect(() => {
    const searchCalculators = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const allCalculators = await api.calculators.getAll({ is_active: true });
        const query = searchQuery.toLowerCase();
        const filtered = allCalculators
          .filter(calc => 
            calc.name.toLowerCase().includes(query) ||
            calc.description?.toLowerCase().includes(query) ||
            calc.subtitle?.toLowerCase().includes(query) ||
            calc.category_name?.toLowerCase().includes(query) ||
            calc.subcategory_name?.toLowerCase().includes(query)
          )
          .slice(0, 10); // Limit to 10 results
        
        setSearchResults(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch (error) {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(searchCalculators, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCalculatorClick = (calc: Calculator) => {
    setSearchQuery("");
    setShowSuggestions(false);
    router.push(`/calculators/${calc.category_slug}/${calc.slug}`);
  };

  // Check if we're on the homepage
  const isHomePage = pathname === "/";

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b",
        isScrolled ? "bg-background/95 backdrop-blur-sm" : "bg-background"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold font-headline text-foreground">
            Calculator1.org
          </span>
        </Link>

        <div className="flex-1 flex justify-center px-4 lg:px-16">
          <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
             <Input
                type="search"
                placeholder="Search calculators..."
                className="w-full rounded-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && searchResults.length > 0 && setShowSuggestions(true)}
              />
             {showSuggestions && searchResults.length > 0 && (
               <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                 {searchResults.map((calc) => (
                   <button
                     key={calc.id}
                     onClick={() => handleCalculatorClick(calc)}
                     className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                   >
                     <div className="font-medium text-sm">{calc.name}</div>
                     {(calc.subtitle || calc.description) && (
                       <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                         {calc.subtitle || calc.description}
                       </div>
                     )}
                     <div className="text-xs text-muted-foreground mt-1">
                       {calc.category_name} {calc.subcategory_name && `• ${calc.subcategory_name}`}
                     </div>
                   </button>
                 ))}
               </div>
             )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
          <LanguageSelector />
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <UserProfileMenu />
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth">Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {!isHomePage && (
        <nav className="border-t lg:hidden">
          <div className="container px-4 md:px-6">
              <Carousel
                opts={{
                  align: "start",
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {categories.filter(cat => cat.count > 0).map((category) => (
                    <CarouselItem key={category.id} className="basis-auto">
                      <Link href={category.href}>
                        <div className={cn(
                            "py-3 px-4 text-sm font-medium transition-colors relative border-b-2", 
                            activeCategory === category.slug 
                              ? "text-primary border-primary" 
                              : "text-gray-700 dark:text-muted-foreground hover:text-foreground border-transparent"
                          )}>
                          {category.name}
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
                </div>
              </Carousel>
          </div>
        </nav>
      )}
    </header>
  );
}
