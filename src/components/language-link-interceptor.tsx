"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/translation-context';
import { getLocalizedPath } from '@/lib/language-routing';

export function LanguageLinkInterceptor({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentLanguage } = useTranslation();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;
      
      // Skip external links, hash links, API routes, auth routes, and already-localized links
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        href.startsWith('/api') ||
        href.startsWith('/_next') ||
        href.startsWith('/auth') ||
        href.match(/^\/[a-z]{2}(\/|$)/) // Already has language prefix
      ) {
        return;
      }
      
      // Check if it's an internal link that needs localization
      if (href.startsWith('/')) {
        e.preventDefault();
        const localizedHref = getLocalizedPath(href.slice(1), currentLanguage);
        router.push(localizedHref);
      }
    };
    
    // Use capture phase to intercept before Next.js Link handles it
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [currentLanguage, router]);
  
  return <>{children}</>;
}

export default LanguageLinkInterceptor;

