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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { api } from './api';

export type Category = {
    id: number;
    slug: string;
    name: string;
    icon: LucideIcon;
    href: string;
    count: number;
};

// Icon mapping for categories
const categoryIconMap: Record<string, LucideIcon> = {
  'math': Sigma,
  'finance': Landmark,
  'physics': Atom,
  'chemistry': FlaskConical,
  'health': HeartPulse,
  'health-care': HeartPulse,
  'conversion': ArrowRightLeft,
  'construction': Construction,
  'everyday': Scale,
  'statistics': BarChart3,
  'biology': Leaf,
  'ecology': Leaf,
  'food': UtensilsCrossed,
  'sports': Trophy,
};

// Categories to show on the main browse section
export const MAIN_CATEGORY_SLUGS = [
  'biology',
  'chemistry',
  'construction',
  'conversion',
  'ecology',
  'everyday',
  'finance',
  'food',
  'health',
  'math',
  'physics',
  'sports',
  'statistics',
];

// Fetch categories from API
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await api.categories.getAll();
    const calculators = await api.calculators.getAll({ is_active: true });
    
    // Count calculators per category
    const calculatorCounts: Record<number, number> = {};
    if (Array.isArray(calculators)) {
      calculators.forEach(calc => {
        calculatorCounts[calc.category_id] = (calculatorCounts[calc.category_id] || 0) + 1;
      });
    }
    
    const mappedCategories = Array.isArray(categories) ? categories.map((cat: any) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      icon: categoryIconMap[cat.slug] || Leaf,
      href: `/calculators/${cat.slug}`,
      count: calculatorCounts[cat.id] || 0,
    })) : [];
    
    return mappedCategories;
  } catch (error) {
    return [];
  }
}

// Get main categories (for browse section)
export async function getMainCategories(): Promise<Category[]> {
  const allCategories = await getCategories();
  
  const mainCategories = allCategories
    .filter(cat => MAIN_CATEGORY_SLUGS.includes(cat.slug))
    .filter(cat => cat.count > 0); // Only show categories with calculators
  
  return mainCategories;
}

// Get other categories (for other categories page)
export async function getOtherCategories(): Promise<Category[]> {
  const allCategories = await getCategories();
  
  const otherCategories = allCategories
    .filter(cat => !MAIN_CATEGORY_SLUGS.includes(cat.slug))
    .filter(cat => cat.count > 0); // Only show categories with calculators
  
  return otherCategories;
}

// Get icon for a category slug
export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIconMap[slug] || Leaf;
}
