
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MarketData {
  symbol: string
  price: number
  volume: number
  change24h: number
  high24h: number
  low24h: number
  timestamp: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Generating mock market data...');
    
    // Mock market data for demo purposes
    const mockMarketData: MarketData[] = [
      {
        symbol: 'BTC/USD',
        price: 45000 + Math.random() * 1000,
        volume: 1000000 + Math.random() * 500000,
        change24h: 2.5 + Math.random(),
        high24h: 46000,
        low24h: 44000,
        timestamp: Date.now()
      },
      {
        symbol: 'ETH/USD',
        price: 2800 + Math.random() * 100,
        volume: 500000 + Math.random() * 100000,
        change24h: 1.8 + Math.random(),
        high24h: 2900,
        low24h: 2700,
        timestamp: Date.now()
      },
      {
        symbol: 'XRP/USD',
        price: 0.50 + Math.random() * 0.05,
        volume: 200000 + Math.random() * 50000,
        change24h: -0.5 + Math.random(),
        high24h: 0.55,
        low24h: 0.48,
        timestamp: Date.now()
      }
    ];

    console.log('Returning market data:', mockMarketData);

    return new Response(
      JSON.stringify(mockMarketData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in fetch-market-data:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
