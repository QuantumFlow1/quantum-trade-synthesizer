
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
    'DOGE': 'Dogecoin'
  };
  
  return names[symbol] || symbol;
}
