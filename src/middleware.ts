import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { URL_CODE_TO_LANGUAGE } from '@/lib/language-routing';

// Valid language codes (excluding 'en' since English uses root URL)
const VALID_LANG_CODES = Object.keys(URL_CODE_TO_LANGUAGE);
const NON_ENGLISH_LANG_CODES = VALID_LANG_CODES.filter(code => code !== 'en');

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next();
  }

  const pathnameParts = pathname.split('/').filter(Boolean);
  const firstPart = pathnameParts[0];

  // If URL starts with /en, redirect to root (English doesn't use prefix)
  if (firstPart === 'en') {
    const pathWithoutLang = pathnameParts.length > 1 
      ? '/' + pathnameParts.slice(1).join('/')
      : '/';
    const url = request.nextUrl.clone();
    url.pathname = pathWithoutLang;
    return NextResponse.redirect(url);
  }

  // Check if the first part is a valid non-English language code
  if (NON_ENGLISH_LANG_CODES.includes(firstPart)) {
    // Language code is already in the URL, rewrite to remove it for internal routing
    const pathWithoutLang = pathnameParts.length > 1 
      ? '/' + pathnameParts.slice(1).join('/')
      : '/';
    const url = request.nextUrl.clone();
    url.pathname = pathWithoutLang;
    // Set header to indicate the language for the app
    const response = NextResponse.rewrite(url);
    response.headers.set('x-language', firstPart);
    return response;
  }

  // No language code in URL - check for saved language preference
  const savedLang = request.cookies.get('preferredLanguage')?.value;
  
  // If saved language is English or no preference, serve the page (English is default)
  if (!savedLang || savedLang === 'en') {
    const response = NextResponse.next();
    response.headers.set('x-language', 'en');
    return response;
  }
  
  // If saved language is a non-English language, redirect to that language prefix
  if (NON_ENGLISH_LANG_CODES.includes(savedLang)) {
    const newPathname = `/${savedLang}${pathname === '/' ? '' : pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    return NextResponse.redirect(url);
  }

  // Default: serve the page as English
  const response = NextResponse.next();
  response.headers.set('x-language', 'en');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};

