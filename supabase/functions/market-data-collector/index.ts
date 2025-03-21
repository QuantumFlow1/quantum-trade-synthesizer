
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`market-data-collector function started at ${new Date().toISOString()}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body if present
    let requestBody = {};
    try {
      requestBody = await req.json();
      console.log("Received request with body:", JSON.stringify(requestBody));
    } catch (e) {
      requestBody = {}; // Set empty object if no body or invalid JSON
      console.log("No request body or invalid JSON:", e.message);
    }

    const action = requestBody.action || 'default';
    console.log(`Processing action: ${action}`);

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
    console.log("Fetching market data with memory usage:", Deno.memoryUsage());
    
    // Generate simulated market data with performance tracking
    console.time('generateMarketData');
    const marketData = generateMarketData();
    console.timeEnd('generateMarketData');
    
    console.log(`Generated ${marketData.length} market data entries`);
    
    const response = {
      status: 'success',
      data: marketData,
      timestamp: new Date().toISOString(),
      performance: {
        memoryUsage: Deno.memoryUsage(),
      }
    };
    
    console.log(`Responding with success, data entries: ${marketData.length}`);
    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    // Enhanced error logging
    console.error('Error in market-data-collector:', error);
    console.error('Error stack:', error.stack);
    console.error('Memory usage at error:', Deno.memoryUsage());
    
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString(),
        details: error.stack,
        memoryUsage: Deno.memoryUsage()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } finally {
    console.log(`market-data-collector function completed at ${new Date().toISOString()}`);
  }
});

// Function to generate simulated market data
function generateMarketData() {
  try {
    console.log("Generating real-time market data...");
    
    // Generate random data for sample cryptocurrencies
    const currencies = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE'];
    
    return currencies.map(symbol => {
      try {
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
      } catch (error) {
        console.error(`Error generating data for ${symbol}:`, error);
        // Return failsafe data
        return {
          symbol,
          name: getFullName(symbol),
          price: symbol === 'BTC' ? 50000 : symbol === 'ETH' ? 3000 : 100,
          change24h: 0,
          volume24h: 1000000,
          marketCap: 1000000000,
          lastUpdated: new Date().toISOString(),
          error: error.message
        };
      }
    });
  } catch (error) {
    console.error("Critical error in generateMarketData:", error);
    // Return minimal failsafe data
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 50000,
        change24h: 0,
        volume24h: 1000000,
        marketCap: 1000000000,
        lastUpdated: new Date().toISOString(),
        errorOccurred: true
      }
    ];
  }
}

// Helper to get full names for crypto symbols
function getFullName(symbol: string): string {
  try {
    const names: {[key: string]: string} = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'BNB': 'Binance Coin',
      'SOL': 'Solana',
      'DOGE': 'Dogecoin'
    };
    
    return names[symbol] || symbol;
  } catch (error) {
    console.error(`Error in getFullName for ${symbol}:`, error);
    return symbol;
  }
}
