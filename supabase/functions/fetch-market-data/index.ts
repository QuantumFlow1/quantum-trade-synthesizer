
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateMockMarketData() {
  const markets = [
    // Crypto pairs
    { market: 'Crypto', symbol: 'BTC/USD', basePrice: 45000 },
    { market: 'Crypto', symbol: 'ETH/USD', basePrice: 2500 },
    { market: 'Crypto', symbol: 'XRP/USD', basePrice: 1.5 },
    // NASDAQ stocks
    { market: 'NASDAQ', symbol: 'AAPL', basePrice: 175 },
    { market: 'NASDAQ', symbol: 'MSFT', basePrice: 380 },
    { market: 'NASDAQ', symbol: 'GOOGL', basePrice: 140 },
    // European stocks
    { market: 'EU', symbol: 'AEX', basePrice: 850 },
    { market: 'EU', symbol: 'DAX', basePrice: 17000 },
    { market: 'EU', symbol: 'CAC40', basePrice: 7900 }
  ];

  const data = markets.map(({ market, symbol, basePrice }) => {
    const randomFactor = 0.95 + Math.random() * 0.1; // +/- 5%
    const price = basePrice * randomFactor;
    const volume = Math.floor(1000000 + Math.random() * 9000000);
    
    return {
      market,
      symbol,
      price: parseFloat(price.toFixed(2)),
      volume,
      change24h: parseFloat((randomFactor - 1) * 100).toFixed(2),
      high24h: parseFloat((price * 1.02).toFixed(2)),
      low24h: parseFloat((price * 0.98).toFixed(2)),
      timestamp: Date.now()
    };
  });

  return data;
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
    console.log('Generating mock market data...');
    const mockData = generateMockMarketData();
    console.log('Mock data generated:', mockData);

    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in fetch-market-data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
