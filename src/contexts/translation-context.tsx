"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { getLanguageFromPath, getCodeFromLanguage, getLocalizedPath } from '@/lib/language-routing';
import { useRouter } from 'next/navigation';

export type Language = 'english' | 'spanish' | 'french' | 'chinese' | 'japanese' | 'arabic' | 'korean' | 'german' | 'italian' | 'polish' | 'portuguese' | 'romanian' | 'swedish';

interface LanguageInfo {
  code: string;
  name: string;
  key: Language;
}

interface TranslationContextType {
  currentLanguage: Language;
  languages: LanguageInfo[];
  translate: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
  setLanguage: (language: Language) => Promise<void>;
  translations: Record<string, string>;
  isLoading: boolean;
  isTranslatingPage: boolean;
  setTranslatingPage: (isTranslating: boolean) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [languages, setLanguages] = useState<LanguageInfo[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslatingPage, setIsTranslatingPage] = useState(false);

  // Load available languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/translation/languages`);
        const data = await response.json();
        if (data.languages && Array.isArray(data.languages)) {
          setLanguages(data.languages);
        }
      } catch (error) {
        // Set fallback languages if API fails
        setLanguages([
          { code: 'en', name: 'English', key: 'english' },
          { code: 'es', name: 'Spanish', key: 'spanish' },
          { code: 'fr', name: 'French', key: 'french' },
          { code: 'zh', name: 'Chinese', key: 'chinese' },
          { code: 'ja', name: 'Japanese', key: 'japanese' },
          { code: 'ar', name: 'Arabic', key: 'arabic' },
          { code: 'ko', name: 'Korean', key: 'korean' },
          { code: 'de', name: 'German', key: 'german' },
          { code: 'it', name: 'Italian', key: 'italian' },
          { code: 'pl', name: 'Polish', key: 'polish' },
          { code: 'pt', name: 'Portuguese', key: 'portuguese' },
          { code: 'ro', name: 'Romanian', key: 'romanian' },
          { code: 'sv', name: 'Swedish', key: 'swedish' },
        ]);
      }
    };
    loadLanguages();
  }, []);

  // Helper to set cookie
  const setLanguageCookie = (langCode: string) => {
    document.cookie = `preferredLanguage=${langCode};path=/;max-age=${60 * 60 * 24 * 365}`; // 1 year
  };

  // Sync language with URL pathname (use window.location for actual browser URL)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAndSyncLanguage = () => {
        // Use window.location.pathname to get the actual browser URL (with language prefix)
        const actualPathname = window.location.pathname;
        const languageFromPath = getLanguageFromPath(actualPathname);
        if (languageFromPath !== currentLanguage) {
          setCurrentLanguage(languageFromPath);
          localStorage.setItem('preferredLanguage', languageFromPath);
          // Also set cookie for middleware
          setLanguageCookie(getCodeFromLanguage(languageFromPath));
        }
      };

      // Check on mount and on popstate (browser back/forward)
      checkAndSyncLanguage();
      
      // Listen for URL changes
      const handlePopState = () => checkAndSyncLanguage();
      window.addEventListener('popstate', handlePopState);
      
      // Also listen for pushState/replaceState
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(checkAndSyncLanguage, 0);
      };
      
      history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        setTimeout(checkAndSyncLanguage, 0);
      };
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      };
    }
  }, [currentLanguage]);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (currentLanguage === 'english' || !text || text.trim().length === 0) {
      return text;
    }

    // Check cache first
    const cacheKey = `${currentLanguage}:${text}`;
    if (translations[cacheKey]) {
      return translations[cacheKey];
    }

    try {
      const translated = await api.translation.translate(text, currentLanguage);
      
      // Cache the translation
      setTranslations(prev => ({
        ...prev,
        [cacheKey]: translated,
      }));
      
      return translated;
    } catch (error) {
      return text; // Return original text on error
    }
  }, [currentLanguage, translations]);

  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (currentLanguage === 'english' || texts.length === 0) {
      return texts;
    }

    // Filter out texts that are already cached
    const cacheKey = `${currentLanguage}:`;
    const uncachedTexts: string[] = [];
    const cachedResults: (string | null)[] = [];
    
    texts.forEach((text, index) => {
      const key = `${cacheKey}${text}`;
      if (translations[key]) {
        cachedResults[index] = translations[key];
      } else {
        cachedResults[index] = null;
        uncachedTexts.push(text);
      }
    });

    // If all texts are cached, return immediately
    if (uncachedTexts.length === 0) {
      return cachedResults as string[];
    }

    try {
      const translated = await api.translation.translateBatch(uncachedTexts, currentLanguage);
      
      // Cache the new translations
      const newTranslations: Record<string, string> = {};
      uncachedTexts.forEach((text, index) => {
        const key = `${cacheKey}${text}`;
        newTranslations[key] = translated[index];
      });
      
      setTranslations(prev => ({
        ...prev,
        ...newTranslations,
      }));

      // Combine cached and new translations
      let uncachedIndex = 0;
      return cachedResults.map(result => {
        if (result !== null) {
          return result;
        }
        return translated[uncachedIndex++];
      });
    } catch (error) {
      return texts; // Return original texts on error
    }
  }, [currentLanguage, translations]);

  const setLanguage = useCallback(async (language: Language) => {
    if (language === currentLanguage) return;
    
    setCurrentLanguage(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', language);
      // Also set cookie for middleware
      setLanguageCookie(getCodeFromLanguage(language));
      
      // Navigate to the new language URL - use window.location for actual browser URL
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/') || '/';
      const newPath = getLocalizedPath(pathWithoutLang === '/' ? '' : pathWithoutLang.slice(1), language);
      router.push(newPath);
    }
    // Clear translations cache when language changes
    setTranslations({});
  }, [currentLanguage, router]);

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        languages,
        translate,
        translateBatch,
        setLanguage,
        translations,
        isLoading,
        isTranslatingPage,
        setTranslatingPage: setIsTranslatingPage,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

