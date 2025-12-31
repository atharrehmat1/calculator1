"use client";

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/translation-context';
import { getLocalizedPath } from '@/lib/language-routing';
import { useCallback, useMemo } from 'react';

export function useLocalizedRouter() {
  const router = useRouter();
  const { currentLanguage } = useTranslation();
  
  const localizeUrl = useCallback((url: string) => {
    // Don't localize external links, hash links, or API routes
    const shouldLocalize = 
      url.startsWith('/') && 
      !url.startsWith('/api') && 
      !url.startsWith('/_next') &&
      !url.startsWith('/auth') &&
      !url.startsWith('/#') &&
      !url.match(/^\/[a-z]{2}(\/|$)/); // Don't double-add language prefix
    
    if (shouldLocalize) {
      return getLocalizedPath(url.slice(1), currentLanguage);
    }
    return url;
  }, [currentLanguage]);
  
  const push = useCallback((url: string, options?: Parameters<typeof router.push>[1]) => {
    return router.push(localizeUrl(url), options);
  }, [router, localizeUrl]);
  
  const replace = useCallback((url: string, options?: Parameters<typeof router.replace>[1]) => {
    return router.replace(localizeUrl(url), options);
  }, [router, localizeUrl]);
  
  const prefetch = useCallback((url: string) => {
    return router.prefetch(localizeUrl(url));
  }, [router, localizeUrl]);
  
  return useMemo(() => ({
    ...router,
    push,
    replace,
    prefetch,
    localizeUrl,
  }), [router, push, replace, prefetch, localizeUrl]);
}

export default useLocalizedRouter;

