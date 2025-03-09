
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body if present
    let requestBody = {};
    try {
      requestBody = await req.json();
      console.log("Received request with body:", requestBody);
    } catch (e) {
      requestBody = {}; // Set empty object if no body or invalid JSON
      console.log("No request body or invalid JSON");
    }

    const action = requestBody.action || 'default';

    // Simple status check - always respond with success for availability checks
    if (action === 'status_check') {
      console.log("Processing status check request");
      return new Response(
        JSON.stringify({ 
          status: 'available',
          timestamp: new Date().toISOString(),
          message: 'Market data collection service is operational'
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    }

    // Fetch real cryptocurrency data from CoinGecko
    console.log("Fetching cryptocurrency market data from API");
    
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en');
      
      if (!response.ok) {
        throw new Error(`CoinGecko API responded with status: ${response.status}`);
      }
      
      const coinData = await response.json();
      console.log(`Successfully retrieved data for ${coinData.length} cryptocurrencies`);
      
      // Transform the data to match our expected format
      const marketData = coinData.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        volume24h: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
        high24h: coin.high_24h || coin.current_price * 1.01, // Fallback if not available
        low24h: coin.low_24h || coin.current_price * 0.99,   // Fallback if not available
        lastUpdated: coin.last_updated || new Date().toISOString(),
        market: 'crypto',
        // Additional data
        image: coin.image,
        totalSupply: coin.total_supply,
        circulatingSupply: coin.circulating_supply,
        maxSupply: coin.max_supply,
        rank: coin.market_cap_rank
      }));
      
      return new Response(
        JSON.stringify({ 
          status: 'success',
          data: marketData,
          source: 'coingecko',
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    } catch (apiError) {
      console.error('Error fetching from CoinGecko API:', apiError);
      
      // Fallback to generated data if API call fails
      console.log('Falling back to generated market data');
      const marketData = generateMarketData();
      
      return new Response(
        JSON.stringify({ 
          status: 'success',
          data: marketData,
          source: 'fallback',
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error in market-data-collector:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message,
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

// Function to generate simulated market data (fallback only)
function generateMarketData() {
  // Generate random data for sample cryptocurrencies
  const currencies = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE'];
  
  return currencies.map(symbol => {
    // Generate realistic-looking prices
    const basePrice = symbol === 'BTC' ? 50000 : 
                     symbol === 'ETH' ? 3000 : 
                     symbol === 'BNB' ? 500 : 
                     symbol === 'SOL' ? 120 : 20;
    
    // Add some randomness
    const fluctuation = (Math.random() * 0.05) - 0.025; // +/- 2.5%
    const price = basePrice * (1 + fluctuation);
    
    return {
      symbol,
      name: getFullName(symbol),
      price: parseFloat(price.toFixed(2)),
      change24h: parseFloat((fluctuation * 100).toFixed(2)),
      volume24h: parseFloat((Math.random() * 10000000 + 5000000).toFixed(2)),
      marketCap: parseFloat((price * (Math.random() * 50000000 + 10000000)).toFixed(2)),
      high24h: price * (1 + Math.random() * 0.02),
      low24h: price * (1 - Math.random() * 0.02),
      lastUpdated: new Date().toISOString(),
      market: 'crypto'
    };
  });
}

// Helper to get full names for crypto symbols
function getFullName(symbol: string): string {
  const names: {[key: string]: string} = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'SOL': 'Solana',
    'DOGE': 'Dogecoin'
  };
  
  return names[symbol] || symbol;
}
