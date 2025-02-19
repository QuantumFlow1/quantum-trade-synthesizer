
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateMockMarketData() {
  const markets = [
    // US Markets
    { market: 'NYSE', symbol: 'JPM', basePrice: 175 },
    { market: 'NYSE', symbol: 'BAC', basePrice: 35 },
    { market: 'NYSE', symbol: 'WMT', basePrice: 160 },
    { market: 'NASDAQ', symbol: 'AAPL', basePrice: 175 },
    { market: 'NASDAQ', symbol: 'MSFT', basePrice: 380 },
    { market: 'NASDAQ', symbol: 'GOOGL', basePrice: 140 },
    
    // European Markets
    { market: 'AEX', symbol: 'ASML', basePrice: 850 },
    { market: 'AEX', symbol: 'RDSA', basePrice: 30 },
    { market: 'DAX', symbol: 'BMW', basePrice: 105 },
    { market: 'DAX', symbol: 'SAP', basePrice: 175 },
    { market: 'CAC40', symbol: 'LVMH', basePrice: 800 },
    { market: 'CAC40', symbol: 'TOTF', basePrice: 63 },
    
    // Asian Markets
    { market: 'NIKKEI', symbol: 'TYO:7203', basePrice: 2800 }, // Toyota
    { market: 'NIKKEI', symbol: 'TYO:6758', basePrice: 12500 }, // Sony
    { market: 'HSI', symbol: 'HKG:0700', basePrice: 290 }, // Tencent
    { market: 'HSI', symbol: 'HKG:9988', basePrice: 85 }, // Alibaba
    { market: 'SSE', symbol: 'SHA:601398', basePrice: 5 }, // ICBC
    { market: 'SSE', symbol: 'SHA:600519', basePrice: 1700 }, // Kweichow Moutai
    
    // Crypto Markets
    { market: 'Crypto', symbol: 'BTC/USD', basePrice: 45000 },
    { market: 'Crypto', symbol: 'ETH/USD', basePrice: 2500 },
    { market: 'Crypto', symbol: 'XRP/USD', basePrice: 1.5 },
    { market: 'Crypto', symbol: 'SOL/USD', basePrice: 110 }
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
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    console.log('Generating global market data...');
    const mockData = generateMockMarketData();
    console.log('Market data generated:', mockData);

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
