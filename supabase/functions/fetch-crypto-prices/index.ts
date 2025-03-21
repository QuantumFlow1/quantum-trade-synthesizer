
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
    const priority = params.priority || 'accuracy'; // 'price' or 'accuracy'
    
    console.log(`Fetching data for symbols: ${requestedSymbols.join(', ')} with priority: ${priority}`);
    
    // Try multiple data sources in sequence with timeout protection
    // If priority is 'price', we'll try Binance first, otherwise CoinGecko
    let sourcesToTry = ['coingecko', 'binance', 'simulated'];
    if (priority === 'price') {
      sourcesToTry = ['binance', 'coingecko', 'simulated'];
    }
    
    let cryptoData = null;
    let successSource = null;
    
    for (const source of sourcesToTry) {
      try {
        console.log(`Attempting to fetch from ${source}...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        let data;
        if (source === 'coingecko') {
          data = await fetchFromCoinGecko(requestedSymbols, controller.signal);
        } else if (source === 'binance') {
          data = await fetchFromBinance(requestedSymbols, controller.signal);
        } else if (source === 'simulated') {
          data = generateSimulatedData(requestedSymbols);
        }
        
        clearTimeout(timeoutId);
        
        if (data && data.length > 0) {
          console.log(`Successfully fetched from ${source}`);
          // Log the first crypto price for debugging
          if (data[0]) {
            console.log(`First crypto (${data[0].symbol}) price: $${data[0].price}`);
          }
          cryptoData = data;
          successSource = source;
          break;
        }
      } catch (error) {
        console.warn(`${source} fetch failed:`, error.message);
        // Continue to next source
      }
    }
    
    if (!cryptoData) {
      console.error("All data sources failed");
      throw new Error("Failed to fetch data from any source");
    }
    
    // Add source information to each data item
    cryptoData = cryptoData.map(item => ({
      ...item,
      source: successSource
    }));
    
    console.log(`Successfully fetched data for ${cryptoData.length} cryptocurrencies from ${successSource}`);
    console.log(`Memory usage after fetch: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: cryptoData,
        source: successSource,
        timestamp: new Date().toISOString()
      }),
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
    
    // Log the raw price data for the first coin for debugging
    if (rawData[0]) {
      console.log(`CoinGecko raw price for ${rawData[0].symbol}: $${rawData[0].current_price}`);
    }
    
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
        
        // Log the raw price for debugging
        console.log(`Binance raw price for ${symbol}: $${ticker.lastPrice}`);
        
        results.push({
          symbol: symbol.toUpperCase(),
          name: getCryptoName(symbol), // Helper function to get full name
          price: parseFloat(ticker.lastPrice),
          change24h: parseFloat(ticker.priceChangePercent),
          volume24h: parseFloat(ticker.volume),
          high24h: parseFloat(ticker.highPrice),
          low24h: parseFloat(ticker.lowPrice),
          lastUpdated: new Date().toISOString()
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
    // Get today's date for more accurate simulated prices
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Use the date as a seed for pseudo-random number generation
    // This ensures that the same date produces the same "random" numbers
    const dateSeed = dateString.split('-').reduce((sum, part) => sum + parseInt(part, 10), 0);
    
    // Use Math.sin to generate an oscillation around base price
    // Apply a cycle that changes throughout the day
    const hourCycle = (today.getHours() + today.getMinutes() / 60) / 24 * Math.PI * 2;
    const dayCycle = (dateSeed % 7) / 7 * Math.PI * 2;
    
    // Base prices for common cryptos - use realistic values based on spring 2024
    const basePrices: Record<string, number> = {
      'BTC': 65000 + Math.sin(dayCycle) * 3000, // ~$65k range for BTC
      'ETH': 3450 + Math.sin(dayCycle + 1) * 150, // ~$3450 range for ETH
      'BNB': 580 + Math.sin(dayCycle + 2) * 25,  // ~$580 range for BNB
      'SOL': 140 + Math.sin(dayCycle + 3) * 10,  // ~$140 range for SOL
      'XRP': 0.55 + Math.sin(dayCycle + 4) * 0.05, // ~$0.55 range for XRP
      'DOGE': 0.15 + Math.sin(dayCycle + 5) * 0.02, // ~$0.15 range for DOGE
      'ADA': 0.45 + Math.sin(dayCycle + 6) * 0.04, // ~$0.45 range for ADA
      'AVAX': 35 + Math.sin(dayCycle + 7) * 3,    // ~$35 range for AVAX
      'LINK': 15 + Math.sin(dayCycle + 8) * 1.5,  // ~$15 range for LINK
      'DOT': 7 + Math.sin(dayCycle + 9) * 0.7     // ~$7 range for DOT
    };
    
    const basePrice = basePrices[symbol.toUpperCase()] || 100;
    
    // Add hourly fluctuation
    const hourlyFluctuation = Math.sin(hourCycle) * 0.02; // ±2% hourly fluctuation
    
    // Combine for final price
    const price = basePrice * (1 + hourlyFluctuation);
    const change24h = hourlyFluctuation * 100; // as percentage
    
    // Log the simulated price for debugging
    console.log(`Simulated price for ${symbol}: $${price.toFixed(2)}`);
    
    return {
      symbol: symbol.toUpperCase(),
      name: getCryptoName(symbol),
      price: parseFloat(price.toFixed(2)),
      change24h: parseFloat(change24h.toFixed(2)),
      volume24h: parseFloat((Math.random() * 1000000 + 500000).toFixed(2)),
      marketCap: parseFloat((price * (Math.random() * 10000000 + 1000000)).toFixed(2)),
      high24h: parseFloat((price * 1.02).toFixed(2)),
      low24h: parseFloat((price * 0.98).toFixed(2)),
      lastUpdated: new Date().toISOString()
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
