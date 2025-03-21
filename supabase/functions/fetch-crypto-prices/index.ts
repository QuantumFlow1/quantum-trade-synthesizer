
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface for response structure
interface CryptoResponse {
  success: boolean;
  data?: any;
  error?: string;
  source?: string;
  timestamp: string;
}

serve(async (req) => {
  console.log(`fetch-crypto-prices function started at ${new Date().toISOString()}`);
  console.log(`Memory usage at start: ${JSON.stringify(Deno.memoryUsage())}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request parameters
    let params = {};
    try {
      params = await req.json().catch(() => ({}));
      console.log("Request parameters:", JSON.stringify(params));
    } catch (e) {
      console.log("No parameters provided or invalid JSON");
    }
    
    // Extract requested symbols or use defaults
    const requestedSymbols = params.symbols || ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'];
    const limit = params.limit || 5;
    
    console.log(`Fetching data for symbols: ${requestedSymbols.join(', ')}`);
    
    // Try multiple data sources in sequence with timeout protection
    const cryptoData = await fetchWithFallback(requestedSymbols, limit);
    
    console.log(`Successfully fetched data for ${cryptoData.data.length} cryptocurrencies from ${cryptoData.source}`);
    console.log(`Memory usage after fetch: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return new Response(
      JSON.stringify(cryptoData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error("Critical error in fetch-crypto-prices:", error);
    console.error("Error stack:", error.stack);
    console.error(`Memory usage at error: ${JSON.stringify(Deno.memoryUsage())}`);
    
    // Return error response with detailed information
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred",
        errorType: error.name,
        timestamp: new Date().toISOString(),
        memoryUsage: Deno.memoryUsage()
      } as CryptoResponse),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } finally {
    console.log(`fetch-crypto-prices function completed at ${new Date().toISOString()}`);
  }
});

/**
 * Try multiple data sources with fallback capability
 */
async function fetchWithFallback(symbols: string[], limit: number = 5): Promise<CryptoResponse> {
  // Try CoinGecko first
  try {
    console.log("Attempting to fetch from CoinGecko API");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const data = await fetchFromCoinGecko(symbols, controller.signal);
    clearTimeout(timeoutId);
    
    if (data && data.length > 0) {
      console.log("Successfully fetched from CoinGecko");
      return {
        success: true,
        data: data,
        source: "coingecko",
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.warn("CoinGecko fetch failed:", error.message);
    // Continue to next source on failure
  }
  
  // Try Binance API as fallback
  try {
    console.log("Attempting to fetch from Binance API");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const data = await fetchFromBinance(symbols, controller.signal);
    clearTimeout(timeoutId);
    
    if (data && data.length > 0) {
      console.log("Successfully fetched from Binance");
      return {
        success: true,
        data: data,
        source: "binance",
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.warn("Binance fetch failed:", error.message);
    // Continue to next source on failure
  }
  
  // Last resort: generate simulated data
  console.log("All external APIs failed, generating simulated data");
  return {
    success: true,
    data: generateSimulatedData(symbols),
    source: "simulated",
    timestamp: new Date().toISOString()
  };
}

/**
 * Fetch data from CoinGecko API
 */
async function fetchFromCoinGecko(symbols: string[], signal?: AbortSignal): Promise<any[]> {
  try {
    // Map common symbol names to CoinGecko IDs
    const symbolToId = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'XRP': 'ripple',
      'DOGE': 'dogecoin',
      'ADA': 'cardano',
      'AVAX': 'avalanche-2',
      'LINK': 'chainlink',
      'DOT': 'polkadot'
    };
    
    // Get IDs for requested symbols
    const ids = symbols.map(symbol => symbolToId[symbol.toUpperCase()] || symbol.toLowerCase()).join(',');
    
    // Use CoinGecko's public API
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
    
    console.log(`CoinGecko request URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    const rawData = await response.json();
    
    // Map response to our standard format
    return rawData.map((coin: any) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      lastUpdated: coin.last_updated,
      thumbnail: coin.image
    }));
  } catch (error) {
    console.error("Error in fetchFromCoinGecko:", error);
    throw error;
  }
}

/**
 * Fetch data from Binance API
 */
async function fetchFromBinance(symbols: string[], signal?: AbortSignal): Promise<any[]> {
  try {
    const results = [];
    
    // Fetch ticker data for each symbol
    for (const symbol of symbols) {
      try {
        const tickerUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}USDT`;
        
        console.log(`Binance request URL: ${tickerUrl}`);
        
        const response = await fetch(tickerUrl, { signal });
        
        if (!response.ok) {
          console.warn(`Skipping ${symbol}, Binance API error: ${response.status}`);
          continue;
        }
        
        const ticker = await response.json();
        
        results.push({
          symbol: symbol.toUpperCase(),
          name: getCryptoName(symbol), // Helper function to get full name
          price: parseFloat(ticker.lastPrice),
          change24h: parseFloat(ticker.priceChangePercent),
          volume24h: parseFloat(ticker.volume),
          high24h: parseFloat(ticker.highPrice),
          low24h: parseFloat(ticker.lowPrice),
          lastUpdated: new Date().toISOString(),
          source: 'binance'
        });
      } catch (error) {
        console.warn(`Error fetching ${symbol} from Binance:`, error);
        // Continue with other symbols
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error in fetchFromBinance:", error);
    throw error;
  }
}

/**
 * Generate simulated data as last resort
 */
function generateSimulatedData(symbols: string[]): any[] {
  return symbols.map(symbol => {
    // Base prices for common cryptos
    const basePrices: Record<string, number> = {
      'BTC': 62500,
      'ETH': 3450,
      'BNB': 580,
      'SOL': 140,
      'XRP': 0.55,
      'DOGE': 0.15,
      'ADA': 0.45,
      'AVAX': 35,
      'LINK': 15,
      'DOT': 7
    };
    
    const basePrice = basePrices[symbol.toUpperCase()] || 100;
    const fluctuation = (Math.random() * 0.05) - 0.025; // +/- 2.5%
    const price = basePrice * (1 + fluctuation);
    const change24h = fluctuation * 100;
    
    return {
      symbol: symbol.toUpperCase(),
      name: getCryptoName(symbol),
      price: parseFloat(price.toFixed(2)),
      change24h: parseFloat(change24h.toFixed(2)),
      volume24h: parseFloat((Math.random() * 1000000 + 500000).toFixed(2)),
      marketCap: parseFloat((price * (Math.random() * 10000000 + 1000000)).toFixed(2)),
      high24h: parseFloat((price * 1.02).toFixed(2)),
      low24h: parseFloat((price * 0.98).toFixed(2)),
      lastUpdated: new Date().toISOString(),
      source: 'simulated'
    };
  });
}

/**
 * Helper to get crypto names from symbols
 */
function getCryptoName(symbol: string): string {
  const names: Record<string, string> = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'SOL': 'Solana',
    'XRP': 'Ripple',
    'DOGE': 'Dogecoin',
    'ADA': 'Cardano',
    'AVAX': 'Avalanche',
    'LINK': 'Chainlink',
    'DOT': 'Polkadot'
  };
  
  return names[symbol.toUpperCase()] || `Unknown (${symbol})`;
}
