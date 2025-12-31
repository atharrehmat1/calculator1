"use client";

import Link, { LinkProps } from 'next/link';
import { useTranslation } from '@/contexts/translation-context';
import { getLocalizedPath } from '@/lib/language-routing';
import { forwardRef } from 'react';

interface LocalizedLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ href, children, ...props }, ref) => {
    const { currentLanguage } = useTranslation();
    
    // Don't localize external links, hash links, or API routes
    const shouldLocalize = 
      href.startsWith('/') && 
      !href.startsWith('/api') && 
      !href.startsWith('/_next') &&
      !href.startsWith('/auth') &&
      !href.startsWith('/#') &&
      !href.match(/^\/[a-z]{2}(\/|$)/); // Don't double-add language prefix
    
    const localizedHref = shouldLocalize 
      ? getLocalizedPath(href.slice(1), currentLanguage)
      : href;
    
    return (
      <Link ref={ref} href={localizedHref} {...props}>
        {children}
      </Link>
    );
  }
);

LocalizedLink.displayName = 'LocalizedLink';

export default LocalizedLink;

