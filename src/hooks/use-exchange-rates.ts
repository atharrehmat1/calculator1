import { useState, useEffect, useCallback } from 'react';

interface ExchangeRate {
  rate: number;
  last_updated: string;
}

interface ExchangeRatesData {
  base_currency: string;
  rates: Record<string, ExchangeRate>;
  timestamp: string;
}

interface UseExchangeRatesOptions {
  baseCurrency?: string;
  refreshInterval?: number; // in milliseconds, 0 = no auto-refresh
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useExchangeRates(options: UseExchangeRatesOptions = {}) {
  const {
    baseCurrency = 'USD',
    refreshInterval = 5 * 60 * 1000, // 5 minutes default
  } = options;

  const [data, setData] = useState<ExchangeRatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/calculators/exchange-rates?base_currency=${baseCurrency}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange rates';
      setError(errorMessage);
      console.error('Error fetching exchange rates:', err);
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  useEffect(() => {
    fetchRates();

    // Set up auto-refresh if interval > 0
    if (refreshInterval > 0) {
      const interval = setInterval(fetchRates, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchRates, refreshInterval]);

  const convertCurrency = useCallback(
    (amount: number, fromCurrency: string, toCurrency: string): number | null => {
      if (!data?.rates) return null;

      // If same currency, return the amount
      if (fromCurrency === toCurrency) return amount;

      // Get rates relative to base currency
      const fromRate = data.rates[fromCurrency]?.rate || 1;
      const toRate = data.rates[toCurrency]?.rate || 1;

      // Convert: amount * (toRate / fromRate)
      return amount * (toRate / fromRate);
    },
    [data]
  );

  const refresh = useCallback(() => {
    fetchRates();
  }, [fetchRates]);

  return {
    data,
    loading,
    error,
    convertCurrency,
    refresh,
  };
}

export default useExchangeRates;
