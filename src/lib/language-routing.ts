import type { Language } from '@/contexts/translation-context';

// Language code mapping (language key -> URL code)
export const LANGUAGE_URL_CODES: Record<Language, string> = {
  english: 'en',
  spanish: 'es',
  french: 'fr',
  chinese: 'zh',
  japanese: 'ja',
  arabic: 'ar',
  korean: 'ko',
  german: 'de',
  italian: 'it',
  polish: 'pl',
  portuguese: 'pt',
  romanian: 'ro',
  swedish: 'sv',
};

// Reverse mapping (URL code -> language key)
export const URL_CODE_TO_LANGUAGE: Record<string, Language> = {
  en: 'english',
  es: 'spanish',
  fr: 'french',
  zh: 'chinese',
  ja: 'japanese',
  ar: 'arabic',
  ko: 'korean',
  de: 'german',
  it: 'italian',
  pl: 'polish',
  pt: 'portuguese',
  ro: 'romanian',
  sv: 'swedish',
};

// Get language from URL code
export function getLanguageFromCode(code: string): Language {
  return URL_CODE_TO_LANGUAGE[code.toLowerCase()] || 'english';
}

// Get URL code from language
export function getCodeFromLanguage(language: Language): string {
  return LANGUAGE_URL_CODES[language] || 'en';
}

// Generate language-prefixed URL
export function getLocalizedPath(path: string, language: Language): string {
  const code = getCodeFromLanguage(language);
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Don't add language prefix for API routes or special paths
  if (cleanPath.startsWith('api/') || cleanPath.startsWith('_next/') || cleanPath.startsWith('auth/')) {
    return `/${cleanPath}`;
  }
  
  // English uses root URL without prefix
  if (language === 'english' || code === 'en') {
    return cleanPath ? `/${cleanPath}` : '/';
  }
  
  // Don't add language prefix if it's already there
  if (cleanPath.startsWith(`${code}/`)) {
    return `/${cleanPath}`;
  }
  
  return `/${code}/${cleanPath}`;
}

// Remove language prefix from path
export function removeLanguagePrefix(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 0 && URL_CODE_TO_LANGUAGE[parts[0]]) {
    return '/' + parts.slice(1).join('/');
  }
  return path.startsWith('/') ? path : `/${path}`;
}

// Get language from pathname
export function getLanguageFromPath(pathname: string): Language {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && URL_CODE_TO_LANGUAGE[parts[0]]) {
    return URL_CODE_TO_LANGUAGE[parts[0]];
  }
  return 'english';
}

