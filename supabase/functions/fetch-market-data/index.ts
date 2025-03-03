
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateMockMarketData() {
  const markets = [
    // US Markets - NYSE
    { market: 'NYSE', symbol: 'JPM', name: 'JPMorgan Chase & Co.', basePrice: 175 },
    { market: 'NYSE', symbol: 'BAC', name: 'Bank of America Corp.', basePrice: 35 },
    { market: 'NYSE', symbol: 'WMT', name: 'Walmart Inc.', basePrice: 160 },
    { market: 'NYSE', symbol: 'PG', name: 'Procter & Gamble Co.', basePrice: 160 },
    { market: 'NYSE', symbol: 'JNJ', name: 'Johnson & Johnson', basePrice: 155 },
    { market: 'NYSE', symbol: 'V', name: 'Visa Inc.', basePrice: 275 },
    
    // US Markets - NASDAQ
    { market: 'NASDAQ', symbol: 'AAPL', name: 'Apple Inc.', basePrice: 175 },
    { market: 'NASDAQ', symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 380 },
    { market: 'NASDAQ', symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 140 },
    { market: 'NASDAQ', symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 170 },
    { market: 'NASDAQ', symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 480 },
    { market: 'NASDAQ', symbol: 'NVDA', name: 'NVIDIA Corp.', basePrice: 880 },
    
    // Dutch Market - AEX
    { market: 'AEX', symbol: 'ASML', name: 'ASML Holding NV', basePrice: 850 },
    { market: 'AEX', symbol: 'ADYEN', name: 'Adyen NV', basePrice: 1050 },
    { market: 'AEX', symbol: 'RDS', name: 'Royal Dutch Shell', basePrice: 30 },
    { market: 'AEX', symbol: 'UNILEVER', name: 'Unilever NV', basePrice: 45 },
    { market: 'AEX', symbol: 'ING', name: 'ING Groep NV', basePrice: 13 },
    { market: 'AEX', symbol: 'AKZO', name: 'Akzo Nobel NV', basePrice: 70 },
    
    // German Market - DAX
    { market: 'DAX', symbol: 'SAP', name: 'SAP SE', basePrice: 175 },
    { market: 'DAX', symbol: 'SIEMENS', name: 'Siemens AG', basePrice: 180 },
    { market: 'DAX', symbol: 'LINDE', name: 'Linde PLC', basePrice: 420 },
    { market: 'DAX', symbol: 'ALLIANZ', name: 'Allianz SE', basePrice: 250 },
    { market: 'DAX', symbol: 'DEUTSCHE', name: 'Deutsche Bank AG', basePrice: 12 },
    { market: 'DAX', symbol: 'BMW', name: 'Bayerische Motoren Werke AG', basePrice: 105 },
    
    // French Market - CAC40
    { market: 'CAC40', symbol: 'LVMH', name: 'LVMH Moët Hennessy', basePrice: 800 },
    { market: 'CAC40', symbol: 'LOREAL', name: 'L\'Oréal SA', basePrice: 420 },
    { market: 'CAC40', symbol: 'AIRBUS', name: 'Airbus SE', basePrice: 150 },
    { market: 'CAC40', symbol: 'TOTAL', name: 'TotalEnergies SE', basePrice: 63 },
    { market: 'CAC40', symbol: 'SANOFI', name: 'Sanofi SA', basePrice: 88 },
    { market: 'CAC40', symbol: 'BNP', name: 'BNP Paribas', basePrice: 65 },
    
    // Japanese Market - NIKKEI
    { market: 'NIKKEI', symbol: 'TYO:7203', name: 'Toyota Motor Corp.', basePrice: 2800 },
    { market: 'NIKKEI', symbol: 'TYO:6758', name: 'Sony Group Corp.', basePrice: 12500 },
    { market: 'NIKKEI', symbol: 'TYO:7974', name: 'Nintendo Co. Ltd.', basePrice: 6500 },
    { market: 'NIKKEI', symbol: 'TYO:9432', name: 'Nippon Telegraph & Telephone', basePrice: 4200 },
    { market: 'NIKKEI', symbol: 'TYO:6861', name: 'Keyence Corp.', basePrice: 5600 },
    { market: 'NIKKEI', symbol: 'TYO:9984', name: 'SoftBank Group Corp.', basePrice: 6300 },
    
    // Hong Kong Market - HSI
    { market: 'HSI', symbol: 'HKG:0700', name: 'Tencent Holdings Ltd.', basePrice: 290 },
    { market: 'HSI', symbol: 'HKG:9988', name: 'Alibaba Group Holding Ltd.', basePrice: 85 },
    { market: 'HSI', symbol: 'HKG:0941', name: 'China Mobile Ltd.', basePrice: 45 },
    { market: 'HSI', symbol: 'HKG:0005', name: 'HSBC Holdings plc', basePrice: 65 },
    { market: 'HSI', symbol: 'HKG:1299', name: 'AIA Group Ltd.', basePrice: 70 },
    { market: 'HSI', symbol: 'HKG:3690', name: 'Meituan', basePrice: 110 },
    
    // Chinese Market - SSE
    { market: 'SSE', symbol: 'SHA:601398', name: 'Industrial and Commercial Bank of China', basePrice: 5 },
    { market: 'SSE', symbol: 'SHA:601988', name: 'Bank of China Ltd.', basePrice: 3.5 },
    { market: 'SSE', symbol: 'SHA:600519', name: 'Kweichow Moutai Co., Ltd.', basePrice: 1700 },
    { market: 'SSE', symbol: 'SHA:601318', name: 'Ping An Insurance Group', basePrice: 65 },
    { market: 'SSE', symbol: 'SHA:600036', name: 'China Merchants Bank Co., Ltd.', basePrice: 35 },
    { market: 'SSE', symbol: 'SHA:601628', name: 'China Life Insurance Co. Ltd.', basePrice: 42 },
    
    // Crypto Markets
    { market: 'Crypto', symbol: 'BTC/USD', name: 'Bitcoin', basePrice: 45000 },
    { market: 'Crypto', symbol: 'ETH/USD', name: 'Ethereum', basePrice: 2500 },
    { market: 'Crypto', symbol: 'BNB/USD', name: 'Binance Coin', basePrice: 380 },
    { market: 'Crypto', symbol: 'SOL/USD', name: 'Solana', basePrice: 110 },
    { market: 'Crypto', symbol: 'XRP/USD', name: 'XRP', basePrice: 0.62 },
    { market: 'Crypto', symbol: 'ADA/USD', name: 'Cardano', basePrice: 0.45 }
  ];

  const data = markets.map(({ market, symbol, name, basePrice }, index) => {
    // Dynamic price movement with more volatility
    const volatility = market === 'Crypto' ? 0.1 : 0.05;
    const randomFactor = 0.95 + Math.random() * volatility * 2;
    const price = basePrice * randomFactor;
    
    // Volume with realistic patterns
    const baseVolume = market === 'Crypto' ? 1000000 : 100000;
    const volumeMultiplier = 1 + Math.sin(Date.now() / 10000) * 0.5; // Cyclical volume
    const volume = Math.floor(baseVolume * volumeMultiplier * (0.5 + Math.random()));
    
    // Calculation of 24-hour change
    const change24h = parseFloat(((randomFactor - 1) * 100).toFixed(2));
    
    // High/Low calculation with realistic spreads
    const spread = market === 'Crypto' ? 0.05 : 0.02;
    const high24h = price * (1 + spread * Math.random());
    const low24h = price * (1 - spread * Math.random());

    // Calculate market cap
    const supplyMultiplier = Math.pow(10, market === 'Crypto' ? 6 : 9);
    const circulatingSupply = Math.floor((basePrice * 0.5 + Math.random() * basePrice * 2) * supplyMultiplier);
    const marketCap = price * circulatingSupply;
    
    // Calculate additional price changes
    const priceChange7d = change24h * (0.7 + Math.random() * 0.6);
    const priceChange30d = change24h * (0.5 + Math.random() * 1.0);
    
    // Historical highs and lows
    const ath = price * (1.5 + Math.random() * 1.5);
    const athDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
    
    const atl = price * (0.2 + Math.random() * 0.3);
    const atlDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();

    return {
      market,
      symbol,
      name,
      price: parseFloat(price.toFixed(2)),
      volume,
      change24h,
      high24h: parseFloat(high24h.toFixed(2)),
      low24h: parseFloat(low24h.toFixed(2)),
      marketCap,
      totalVolume24h: volume * price,
      circulatingSupply,
      totalSupply: circulatingSupply * (1 + Math.random() * 0.5),
      rank: index + 1,
      ath: parseFloat(ath.toFixed(2)),
      athDate,
      atl: parseFloat(atl.toFixed(2)),
      atlDate,
      lastUpdated: new Date().toISOString(),
      priceChange7d,
      priceChange30d,
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
    console.log('Generating real-time market data...');
    const mockData = generateMockMarketData();
    console.log('Market data generated:', mockData.length, 'items');

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
