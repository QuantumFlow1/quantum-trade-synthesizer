
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Mock market data for demo purposes
    // In production, this would fetch from a real API
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
      }
    ]

    return new Response(
      JSON.stringify(mockMarketData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
