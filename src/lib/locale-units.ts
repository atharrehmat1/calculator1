/**
 * Locale-based unit detection utility
 * 
 * This module provides functions to detect the user's locale
 * and determine appropriate default units based on that locale.
 * 
 * Examples:
 * - US, Myanmar, Liberia → Imperial (miles, pounds, Fahrenheit)
 * - Most other countries → Metric (kilometers, kilograms, Celsius)
 */

/**
 * Locale to unit system mapping
 */
const LOCALE_UNIT_MAP: Record<string, 'metric' | 'imperial'> = {
  // Imperial system countries
  'en-US': 'imperial',
  'en-LR': 'imperial',  // Liberia
  'my-MM': 'imperial',  // Myanmar
  
  // Add more specific locales as needed
};

/**
 * Default unit system for unknown locales
 */
const DEFAULT_UNIT_SYSTEM: 'metric' | 'imperial' = 'metric';

/**
 * Get the user's locale from the browser
 */
export function getBrowserLocale(): string {
  if (typeof window === 'undefined') {
    return 'en-US'; // Default for SSR
  }
  
  return navigator.language || 'en-US';
}

/**
 * Get the unit system (metric or imperial) based on locale
 * 
 * @param locale - Optional locale string. If not provided, uses browser locale.
 * @returns 'metric' or 'imperial'
 */
export function getUnitSystem(locale?: string): 'metric' | 'imperial' {
  const targetLocale = locale || getBrowserLocale();
  
  // Check exact match first
  if (LOCALE_UNIT_MAP[targetLocale]) {
    return LOCALE_UNIT_MAP[targetLocale];
  }
  
  // Check partial match (e.g., 'en' from 'en-US')
  const baseLocale = targetLocale.split('-')[0];
  for (const [locale, system] of Object.entries(LOCALE_UNIT_MAP)) {
    if (locale.startsWith(baseLocale)) {
      return system;
    }
  }
  
  return DEFAULT_UNIT_SYSTEM;
}

/**
 * Get default length unit based on locale
 */
export function getDefaultLengthUnit(locale?: string): 'km' | 'mi' | 'm' | 'ft' {
  const system = getUnitSystem(locale);
  
  if (system === 'imperial') {
    return 'mi'; // miles for long distances, feet for short
  }
  
  return 'km'; // kilometers for long distances, meters for short
}

/**
 * Get default weight unit based on locale
 */
export function getDefaultWeightUnit(locale?: string): 'kg' | 'lb' {
  const system = getUnitSystem(locale);
  
  if (system === 'imperial') {
    return 'lb';
  }
  
  return 'kg';
}

/**
 * Get default temperature unit based on locale
 */
export function getDefaultTemperatureUnit(locale?: string): 'C' | 'F' {
  const system = getUnitSystem(locale);
  
  if (system === 'imperial') {
    return 'F';
  }
  
  return 'C';
}

/**
 * Convert between units
 */
export function convertUnit(
  value: number,
  from: string,
  to: string
): number {
  const conversions: Record<string, (val: number) => number> = {
    // Length
    'km_to_mi': (val) => val * 0.621371,
    'mi_to_km': (val) => val * 1.60934,
    'm_to_ft': (val) => val * 3.28084,
    'ft_to_m': (val) => val * 0.3048,
    
    // Weight
    'kg_to_lb': (val) => val * 2.20462,
    'lb_to_kg': (val) => val * 0.453592,
    
    // Temperature
    'C_to_F': (val) => (val * 9/5) + 32,
    'F_to_C': (val) => (val - 32) * 5/9,
  };
  
  const key = `${from}_to_${to}`;
  
  if (from === to) return value;
  if (!conversions[key]) {
    console.warn(`Conversion ${key} not supported`);
    return value;
  }
  
  return conversions[key](value);
}

/**
 * Format a value with the appropriate unit based on locale
 */
export function formatWithLocaleUnit(
  value: number,
  type: 'length' | 'weight' | 'temperature',
  locale?: string
): string {
  switch (type) {
    case 'length': {
      const unit = getDefaultLengthUnit(locale);
      return `${value} ${unit}`;
    }
    case 'weight': {
      const unit = getDefaultWeightUnit(locale);
      return `${value} ${unit}`;
    }
    case 'temperature': {
      const unit = getDefaultTemperatureUnit(locale);
      return `${value}°${unit}`;
    }
    default:
      return `${value}`;
  }
}
