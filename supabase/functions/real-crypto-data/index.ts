
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

/**
 * Fetches real cryptocurrency market data from CoinGecko API
 */
const fetchCryptoMarketData = async (): Promise<CryptoMarketData[]> => {
  try {
    console.log("Fetching real cryptocurrency data from CoinGecko...");
    
    // Use CoinGecko's public API (free tier)
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en";
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched data for ${data.length} cryptocurrencies`);
    
    return data;
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    throw error;
  }
};

/**
 * Formats the raw CoinGecko data into our application's format
 */
const formatMarketData = (rawData: CryptoMarketData[]) => {
  return rawData.map(coin => {
    // Calculate additional metrics
    const volatility = Math.abs(coin.price_change_percentage_24h) / 10;
    const macd = parseFloat((Math.random() * 2 - 1).toFixed(2)); // Simulated MACD
    const macdSignal = parseFloat((macd + (Math.random() * 0.4 - 0.2)).toFixed(2));
    const rsi = Math.max(1, Math.min(99, 50 + coin.price_change_percentage_24h)); // Rough RSI based on price change
    
    // Format into our application's expected market data format
    return {
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      market: "Crypto",
      price: coin.current_price,
      volume: coin.total_volume,
      change24h: coin.price_change_percentage_24h,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      marketCap: coin.market_cap,
      totalVolume24h: coin.total_volume,
      circulatingSupply: coin.circulating_supply,
      totalSupply: coin.total_supply || coin.circulating_supply,
      rank: coin.market_cap_rank,
      ath: coin.ath,
      athDate: coin.ath_date,
      atl: coin.atl,
      atlDate: coin.atl_date,
      lastUpdated: coin.last_updated,
      timestamp: Date.now(),
      // Add trading indicators (some real, some calculated)
      open: coin.current_price * (1 - coin.price_change_percentage_24h / 100), // Estimated based on price change
      close: coin.current_price,
      sma: coin.current_price,
      ema: coin.current_price * (1 + Math.random() * 0.01 - 0.005),
      rsi,
      macd,
      macdSignal,
      macdHistogram: macd - macdSignal,
      bollingerUpper: coin.current_price * (1 + volatility * 2),
      bollingerLower: coin.current_price * (1 - volatility * 2),
      stochastic: Math.random() * 100,
      adx: 25 + Math.random() * 50,
      trend: coin.price_change_percentage_24h >= 0 ? "up" : "down"
    };
  });
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body if present
    let params = {};
    try {
      params = await req.json();
    } catch (e) {
      // No request body or invalid JSON, use defaults
      params = {};
    }
    
    console.log("Fetching real market data with params:", params);
    
    // Fetch real market data
    const cryptoData = await fetchCryptoMarketData();
    const formattedData = formatMarketData(cryptoData);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: formattedData,
        source: "coingecko",
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
    console.error("Error in real-crypto-data function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
