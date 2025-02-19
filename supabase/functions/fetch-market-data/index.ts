
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateMockMarketData() {
  const markets = [
    // US Markets - NYSE
    { market: 'NYSE', symbol: 'JPM', basePrice: 175 },
    { market: 'NYSE', symbol: 'BAC', basePrice: 35 },
    { market: 'NYSE', symbol: 'WMT', basePrice: 160 },
    { market: 'NYSE', symbol: 'PG', basePrice: 160 },
    { market: 'NYSE', symbol: 'JNJ', basePrice: 155 },
    { market: 'NYSE', symbol: 'V', basePrice: 275 },
    
    // US Markets - NASDAQ
    { market: 'NASDAQ', symbol: 'AAPL', basePrice: 175 },
    { market: 'NASDAQ', symbol: 'MSFT', basePrice: 380 },
    { market: 'NASDAQ', symbol: 'GOOGL', basePrice: 140 },
    { market: 'NASDAQ', symbol: 'AMZN', basePrice: 170 },
    { market: 'NASDAQ', symbol: 'META', basePrice: 480 },
    { market: 'NASDAQ', symbol: 'NVDA', basePrice: 880 },
    
    // Dutch Market - AEX
    { market: 'AEX', symbol: 'ASML', basePrice: 850 },
    { market: 'AEX', symbol: 'ADYEN', basePrice: 1050 },
    { market: 'AEX', symbol: 'RDS', basePrice: 30 },
    { market: 'AEX', symbol: 'UNILEVER', basePrice: 45 },
    { market: 'AEX', symbol: 'ING', basePrice: 13 },
    { market: 'AEX', symbol: 'AKZO', basePrice: 70 },
    
    // German Market - DAX
    { market: 'DAX', symbol: 'SAP', basePrice: 175 },
    { market: 'DAX', symbol: 'SIEMENS', basePrice: 180 },
    { market: 'DAX', symbol: 'LINDE', basePrice: 420 },
    { market: 'DAX', symbol: 'ALLIANZ', basePrice: 250 },
    { market: 'DAX', symbol: 'DEUTSCHE', basePrice: 12 },
    { market: 'DAX', symbol: 'BMW', basePrice: 105 },
    
    // French Market - CAC40
    { market: 'CAC40', symbol: 'LVMH', basePrice: 800 },
    { market: 'CAC40', symbol: 'LOREAL', basePrice: 420 },
    { market: 'CAC40', symbol: 'AIRBUS', basePrice: 150 },
    { market: 'CAC40', symbol: 'TOTAL', basePrice: 63 },
    { market: 'CAC40', symbol: 'SANOFI', basePrice: 88 },
    { market: 'CAC40', symbol: 'BNP', basePrice: 65 },
    
    // Japanese Market - NIKKEI
    { market: 'NIKKEI', symbol: 'TYO:7203', basePrice: 2800 }, // Toyota
    { market: 'NIKKEI', symbol: 'TYO:6758', basePrice: 12500 }, // Sony
    { market: 'NIKKEI', symbol: 'TYO:7974', basePrice: 6500 }, // Nintendo
    { market: 'NIKKEI', symbol: 'TYO:9432', basePrice: 4200 }, // NTT
    { market: 'NIKKEI', symbol: 'TYO:6861', basePrice: 5600 }, // Keyence
    { market: 'NIKKEI', symbol: 'TYO:9984', basePrice: 6300 }, // SoftBank
    
    // Hong Kong Market - HSI
    { market: 'HSI', symbol: 'HKG:0700', basePrice: 290 }, // Tencent
    { market: 'HSI', symbol: 'HKG:9988', basePrice: 85 }, // Alibaba
    { market: 'HSI', symbol: 'HKG:0941', basePrice: 45 }, // China Mobile
    { market: 'HSI', symbol: 'HKG:0005', basePrice: 65 }, // HSBC
    { market: 'HSI', symbol: 'HKG:1299', basePrice: 70 }, // AIA
    { market: 'HSI', symbol: 'HKG:3690', basePrice: 110 }, // Meituan
    
    // Chinese Market - SSE
    { market: 'SSE', symbol: 'SHA:601398', basePrice: 5 }, // ICBC
    { market: 'SSE', symbol: 'SHA:601988', basePrice: 3.5 }, // Bank of China
    { market: 'SSE', symbol: 'SHA:600519', basePrice: 1700 }, // Kweichow Moutai
    { market: 'SSE', symbol: 'SHA:601318', basePrice: 65 }, // Ping An
    { market: 'SSE', symbol: 'SHA:600036', basePrice: 35 }, // CMB
    { market: 'SSE', symbol: 'SHA:601628', basePrice: 42 }, // China Life
    
    // Crypto Markets
    { market: 'Crypto', symbol: 'BTC/USD', basePrice: 45000 },
    { market: 'Crypto', symbol: 'ETH/USD', basePrice: 2500 },
    { market: 'Crypto', symbol: 'BNB/USD', basePrice: 380 },
    { market: 'Crypto', symbol: 'SOL/USD', basePrice: 110 },
    { market: 'Crypto', symbol: 'XRP/USD', basePrice: 0.62 },
    { market: 'Crypto', symbol: 'ADA/USD', basePrice: 0.45 }
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
