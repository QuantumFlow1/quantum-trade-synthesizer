
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateMockData() {
  const markets = [
    { market: 'NYSE', symbols: ['JPM', 'BAC', 'WMT', 'PG', 'JNJ'] },
    { market: 'NASDAQ', symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'] },
    { market: 'Crypto', symbols: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'ADA/USD', 'XRP/USD'] },
    { market: 'AEX', symbols: ['ASML', 'ADYEN', 'UNILEVER', 'ING', 'AKZO'] },
  ];

  const result = [];
  
  // Current timestamp
  const now = Date.now();

  markets.forEach(marketGroup => {
    marketGroup.symbols.forEach(symbol => {
      // Generate realistic-looking price based on symbol
      let basePrice = 0;
      
      if (symbol === 'BTC/USD') basePrice = 35000 + Math.random() * 2000;
      else if (symbol === 'ETH/USD') basePrice = 1800 + Math.random() * 200;
      else if (symbol.includes('USD')) basePrice = 1 + Math.random() * 10;
      else if (symbol === 'AAPL') basePrice = 170 + Math.random() * 10;
      else if (symbol === 'MSFT') basePrice = 330 + Math.random() * 20;
      else if (symbol === 'GOOGL') basePrice = 130 + Math.random() * 10;
      else if (symbol === 'AMZN') basePrice = 150 + Math.random() * 10;
      else if (symbol === 'ASML') basePrice = 650 + Math.random() * 40;
      else basePrice = 50 + Math.random() * 150;

      // Random change percentage
      const change24h = (Math.random() * 10) - 5; // -5% to +5%
      
      // High/low derived from price and change
      const high24h = basePrice * (1 + Math.abs(change24h) / 100 * 1.5);
      const low24h = basePrice * (1 - Math.abs(change24h) / 100 * 1.5);
      
      // Volume based on price
      const volume = Math.floor(basePrice * 1000 * (0.5 + Math.random() * 2));

      result.push({
        market: marketGroup.market,
        symbol,
        name: symbol.replace('/', ' to '),
        price: basePrice,
        change24h,
        high24h,
        low24h,
        volume,
        timestamp: now,
        high: high24h,
        low: low24h
      });
    });
  });

  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    console.log('Generating market data...');
    const mockData = generateMockData();
    
    // Return data in expected format
    const response = {
      status: "success",
      data: mockData,
      timestamp: Date.now()
    };
    
    console.log(`Generated ${mockData.length} market data points`);

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in market-data-collector:', error);
    
    // Return error in expected format
    return new Response(
      JSON.stringify({ 
        status: "error", 
        error: error.message,
        timestamp: Date.now()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500 
      },
    )
  }
})
