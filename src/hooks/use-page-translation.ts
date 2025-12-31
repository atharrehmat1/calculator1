"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/translation-context';

// Text that should not be translated (like URLs, numbers, etc.)
const shouldTranslate = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed) return false;
  
  // Don't translate if it's mostly numbers or special characters
  if (/^[\d\s\.,\-+%$€£¥]+$/.test(trimmed)) return false;
  
  // Don't translate if it's a URL or email
  if (/^https?:\/\//.test(trimmed) || /^[\w.-]+@[\w.-]+\.\w+/.test(trimmed)) return false;
  
  // Don't translate single characters or very short strings that are likely code
  if (trimmed.length <= 2 && /^[A-Za-z0-9]+$/.test(trimmed)) return false;
  
  // Don't translate if parent has specific classes that indicate it shouldn't be translated
  // (like calculator names, category names, etc.)
  
  return true;
};

// Store original English text for each translated element
const originalTexts = new WeakMap<Element, string>();

// Global map: translated text -> original text (for reverse lookup)
const translationReverseMap = new Map<string, string>();

export function usePageTranslation() {
  const { translate, translateBatch, currentLanguage, isLoading, setTranslatingPage } = useTranslation();
  const [pathname, setPathname] = useState('');

  // Track pathname changes using window.location (actual browser URL)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updatePathname = () => {
        const newPath = window.location.pathname;
        if (newPath !== pathname) {
          setPathname(newPath);
        }
      };
      
      updatePathname();
      
      // Listen for navigation events
      window.addEventListener('popstate', updatePathname);
      
      // Intercept pushState and replaceState
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(updatePathname, 0);
      };
      
      history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        setTimeout(updatePathname, 0);
      };
      
      return () => {
        window.removeEventListener('popstate', updatePathname);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
      };
    }
  }, [pathname]);

  useEffect(() => {
    // Clear translated markers when pathname changes to allow re-translation
    document.querySelectorAll('[data-translated]').forEach(el => {
      el.removeAttribute('data-translated');
      el.removeAttribute('data-original-text');
    });
    translationReverseMap.clear();
    
    // Handle English: restore original text
    if (currentLanguage === 'english') {
      setTranslatingPage(true);
      
      const restoreToEnglish = () => {
        // Strategy 1: Find elements with data-original-text attribute
        const translatedElements = document.querySelectorAll('[data-translated]');
        let restoredCount = 0;
        
        // First, try to restore using data attributes
        translatedElements.forEach((element) => {
          const originalText = element.getAttribute('data-original-text');
          
          if (originalText) {
            const walker = document.createTreeWalker(
              element,
              NodeFilter.SHOW_TEXT,
              null
            );
            
            let node;
            while ((node = walker.nextNode())) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                const currentText = node.textContent.trim();
                if (currentText !== originalText) {
                  (node as Text).textContent = originalText;
                  restoredCount++;
                  break;
                }
              }
            }
            
            element.removeAttribute('data-translated');
            element.removeAttribute('data-original-text');
          } else {
            element.removeAttribute('data-translated');
          }
        });
        
        // Strategy 2: Walk through ALL text nodes and restore using reverse map
        // This is more reliable as it doesn't depend on data attributes
        if (translationReverseMap.size > 0) {
          const allTextNodes: Text[] = [];
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node) => {
                const parent = node.parentElement;
                if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                  return NodeFilter.FILTER_REJECT;
                }
                if (parent?.closest('[data-no-translate]')) {
                  return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
              }
            }
          );
          
          let node;
          while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
              allTextNodes.push(node as Text);
            }
          }
          
          allTextNodes.forEach((textNode) => {
            const currentText = textNode.textContent?.trim();
            if (currentText && translationReverseMap.has(currentText)) {
              const originalText = translationReverseMap.get(currentText)!;
              if (currentText !== originalText) {
                textNode.textContent = originalText;
                restoredCount++;
                // Remove any translation markers from parent
                const parent = textNode.parentElement;
                if (parent) {
                  parent.removeAttribute('data-translated');
                  parent.removeAttribute('data-original-text');
                }
              }
            }
          });
        }
        
        // Clear reverse map after restoration
        translationReverseMap.clear();
        
        setTranslatingPage(false);
      };
      
      // Small delay to ensure DOM is ready
      setTimeout(restoreToEnglish, 50);
      return;
    }
    
    if (isLoading) {
      return;
    }

    let isCancelled = false;

    const translatePageContent = async () => {
      setTranslatingPage(true);
      
      // Small delay to batch DOM reads
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (isCancelled) {
        setTranslatingPage(false);
        return;
      }
      
      try {
        // Get all text nodes that should be translated
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              // Skip script and style tags
              const parent = node.parentElement;
              if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                return NodeFilter.FILTER_REJECT;
              }
              
              // Skip if already translated (has data-translated attribute)
              if (parent?.hasAttribute('data-translated')) {
                return NodeFilter.FILTER_REJECT;
              }
              
              // Skip if parent has data-no-translate attribute
              if (parent?.closest('[data-no-translate]')) {
                return NodeFilter.FILTER_REJECT;
              }
              
              // Skip if parent has specific classes that indicate non-translatable content
              const skipClasses = ['font-mono', 'code', 'calculator-name', 'category-name', 'subcategory-name'];
              if (parent && skipClasses.some(cls => parent.classList.contains(cls))) {
                return NodeFilter.FILTER_REJECT;
              }
              
              // Skip if it's inside an input, textarea, or button (these are handled separately)
              if (parent?.tagName === 'INPUT' || parent?.tagName === 'TEXTAREA' || parent?.tagName === 'BUTTON') {
                return NodeFilter.FILTER_REJECT;
              }
              
              const text = node.textContent || '';
              if (shouldTranslate(text)) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_REJECT;
            }
          }
        );

        const textNodes: { node: Text; text: string; isVisible: boolean }[] = [];
        let node;
        
        // Get viewport bounds for visibility check
        const viewport = {
          top: window.scrollY,
          left: window.scrollX,
          bottom: window.scrollY + window.innerHeight,
          right: window.scrollX + window.innerWidth,
        };

        while ((node = walker.nextNode())) {
          const text = node.textContent || '';
          if (text.trim()) {
            // Check if element is visible in viewport (prioritize visible content)
            const parent = node.parentElement;
            const isVisible = parent ? (() => {
              const rect = parent.getBoundingClientRect();
              return (
                rect.top < viewport.bottom &&
                rect.bottom > viewport.top &&
                rect.left < viewport.right &&
                rect.right > viewport.left
              );
            })() : true;
            
            textNodes.push({ node: node as Text, text: text.trim(), isVisible });
          }
        }

        // Separate visible and non-visible nodes for prioritized translation
        const visibleNodes = textNodes.filter(t => t.isVisible);
        const hiddenNodes = textNodes.filter(t => !t.isVisible);

        // Get unique texts
        const allUniqueTexts = Array.from(new Set(textNodes.map(t => t.text)));
        const visibleUniqueTexts = Array.from(new Set(visibleNodes.map(t => t.text)));
        const hiddenUniqueTexts = Array.from(new Set(hiddenNodes.map(t => t.text)));

        // Translate visible content first (priority)
        const translations: Record<string, string> = {};
        
        // Translate visible content in larger batches for speed
        if (visibleUniqueTexts.length > 0 && !isCancelled) {
          const batchSize = 50; // Larger batch size for better performance
          for (let i = 0; i < visibleUniqueTexts.length; i += batchSize) {
            if (isCancelled) break;
            
            const batch = visibleUniqueTexts.slice(i, i + batchSize);
            const translated = await translateBatch(batch);
            
            if (isCancelled) break;
            
            batch.forEach((text, index) => {
              translations[text] = translated[index];
              // Store reverse mapping: translated -> original
              if (translated[index] && translated[index] !== text) {
                translationReverseMap.set(translated[index], text);
              }
            });

            // Apply visible translations immediately (progressive rendering)
            visibleNodes.forEach(({ node, text }) => {
              if (translations[text] && translations[text] !== text) {
                const translated = translations[text];
                if (translated && translated !== text) {
                  const parent = node.parentElement;
                  if (parent) {
                    // Store original text before translating - use the exact original text
                    // Make sure we're storing on the right element (immediate parent of text node)
                    if (!parent.hasAttribute('data-original-text')) {
                      parent.setAttribute('data-original-text', text);
                    }
                    parent.setAttribute('data-translated', 'true');
                    originalTexts.set(parent, text);
                  }
                  node.textContent = translated;
                }
              }
            });
          }
        }

        // Then translate hidden content in background (only if not cancelled)
        if (hiddenUniqueTexts.length > 0 && !isCancelled) {
          const batchSize = 50;
          for (let i = 0; i < hiddenUniqueTexts.length; i += batchSize) {
            if (isCancelled) break;
            
            const batch = hiddenUniqueTexts.slice(i, i + batchSize);
            const translated = await translateBatch(batch);
            
            if (isCancelled) break;
            
            batch.forEach((text, index) => {
              translations[text] = translated[index];
            });

            // Apply hidden translations
            hiddenNodes.forEach(({ node, text }) => {
              if (translations[text] && translations[text] !== text) {
                const translated = translations[text];
                if (translated && translated !== text) {
                  const parent = node.parentElement;
                  if (parent) {
                    // Store original text before translating - use the exact original text
                    // Make sure we're storing on the right element (immediate parent of text node)
                    if (!parent.hasAttribute('data-original-text')) {
                      parent.setAttribute('data-original-text', text);
                    }
                    parent.setAttribute('data-translated', 'true');
                    originalTexts.set(parent, text);
                  }
                  node.textContent = translated;
                }
              }
            });
          }
        }
      } catch (error) {
        // Translation error handled silently
      } finally {
        if (!isCancelled) {
          setTranslatingPage(false);
        }
      }
    };

    // Small delay to ensure page is fully rendered
    const timeoutId = setTimeout(() => {
      translatePageContent();
    }, 300);

    // Also listen for language change events
    const handleLanguageChange = () => {
      isCancelled = true; // Cancel any ongoing translation
      
      // If switching to English, restore original text
      if (currentLanguage === 'english') {
        const translatedElements = document.querySelectorAll('[data-translated]');
        translatedElements.forEach((element) => {
          const originalText = element.getAttribute('data-original-text');
          if (originalText) {
            // Find text nodes in this element
            const textNodes: Text[] = [];
            const walker = document.createTreeWalker(
              element,
              NodeFilter.SHOW_TEXT,
              null
            );
            let node;
            while ((node = walker.nextNode())) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                textNodes.push(node as Text);
              }
            }
            
            // Restore original text
            if (textNodes.length > 0) {
              textNodes[0].textContent = originalText;
            } else if (element.textContent) {
              element.textContent = originalText;
            }
            
            element.removeAttribute('data-translated');
            element.removeAttribute('data-original-text');
          } else {
            element.removeAttribute('data-translated');
          }
        });
        setTranslatingPage(false);
        return;
      }
      
      // Clear translated markers for other languages
      document.querySelectorAll('[data-translated]').forEach(el => {
        el.removeAttribute('data-translated');
        el.removeAttribute('data-original-text');
      });
      // Re-translate immediately
      isCancelled = false;
      translatePageContent();
    };

    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, [currentLanguage, translate, translateBatch, setTranslatingPage, isLoading, pathname]);
}

