
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

    // Default action - fetch simulated market data
    console.log("Fetching market data");
    
    // Generate simulated market data
    const marketData = generateMarketData();
    
    return new Response(
      JSON.stringify({ 
        status: 'success',
        data: marketData,
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

// Function to generate simulated market data
function generateMarketData() {
  // Generate random data for sample cryptocurrencies - expanded list
  const currencies = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE', 'XRP', 'ADA', 'DOT', 'AVAX', 'MATIC'];
  
  return currencies.map(symbol => {
    // Generate realistic-looking prices
    const basePrice = symbol === 'BTC' ? 50000 : 
                     symbol === 'ETH' ? 3000 : 
                     symbol === 'BNB' ? 500 : 
                     symbol === 'SOL' ? 120 : 
                     symbol === 'DOGE' ? 0.15 :
                     symbol === 'XRP' ? 0.60 :
                     symbol === 'ADA' ? 0.45 :
                     symbol === 'DOT' ? 8.5 :
                     symbol === 'AVAX' ? 30 :
                     symbol === 'MATIC' ? 0.90 : 1;
    
    // Add some randomness
    const fluctuation = (Math.random() * 0.05) - 0.025; // +/- 2.5%
    const price = basePrice * (1 + fluctuation);
    const change24h = parseFloat((fluctuation * 100).toFixed(2));
    
    // Add 7d and 30d changes
    const change7d = parseFloat(((Math.random() * 0.1) - 0.05).toFixed(2)) * 100; // +/- 5%
    const change30d = parseFloat(((Math.random() * 0.15) - 0.075).toFixed(2)) * 100; // +/- 7.5%
    
    // Generate more detailed market data
    const volume = parseFloat((Math.random() * 10000000 + 5000000).toFixed(2));
    const marketCap = parseFloat((price * (Math.random() * 50000000 + 10000000)).toFixed(2));
    const circulatingSupply = parseFloat((Math.random() * 100000000 + 10000000).toFixed(0));
    const totalSupply = parseFloat((circulatingSupply * (1 + Math.random() * 0.5)).toFixed(0));
    
    // Add all-time high and low info
    const ath = price * (1.5 + Math.random());
    const atl = price * (0.2 + Math.random() * 0.3);
    
    return {
      market: "Crypto", // Explicitly mark as Crypto market
      symbol,
      name: getFullName(symbol),
      price,
      change24h,
      volume,
      marketCap,
      circulatingSupply,
      totalSupply,
      priceChange7d: change7d,
      priceChange30d: change30d,
      ath,
      atl,
      athDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      atlDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      rank: cryptocurrencyRank(symbol),
      lastUpdated: new Date().toISOString()
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
    'DOGE': 'Dogecoin',
    'XRP': 'Ripple',
    'ADA': 'Cardano',
    'DOT': 'Polkadot',
    'AVAX': 'Avalanche',
    'MATIC': 'Polygon'
  };
  
  return names[symbol] || symbol;
}

// Helper to assign realistic market ranks
function cryptocurrencyRank(symbol: string): number {
  const ranks: {[key: string]: number} = {
    'BTC': 1,
    'ETH': 2,
    'BNB': 3,
    'SOL': 4,
    'XRP': 5,
    'ADA': 6,
    'DOGE': 7,
    'DOT': 8,
    'AVAX': 9,
    'MATIC': 10
  };
  
  return ranks[symbol] || Math.floor(Math.random() * 50) + 10;
}
