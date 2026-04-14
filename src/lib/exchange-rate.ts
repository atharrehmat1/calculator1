const API_KEY = "f906a4078de022c7e963950b";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export interface ExchangeRates {
  [key: string]: number;
}

let cachedRates: ExchangeRates | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 3600 * 1000; // 1 hour

export async function getExchangeRates(baseCurrency: string = "USD"): Promise<ExchangeRates | null> {
  const now = Date.now();
  
  if (cachedRates && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedRates;
  }

  try {
    const response = await fetch(`${BASE_URL}/latest/${baseCurrency}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.result === "success") {
      cachedRates = data.conversion_rates;
      lastFetchTime = now;
      return cachedRates;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return null;
  }
}
