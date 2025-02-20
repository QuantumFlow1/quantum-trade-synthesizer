
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl!, supabaseKey!)

async function collectMarketData() {
  const markets = [
    { source: 'NYSE', pairs: ['BTC/USD', 'ETH/USD', 'EUR/USD'] },
    { source: 'Binance', pairs: ['BTC/USDT', 'ETH/USDT'] },
    { source: 'Kraken', pairs: ['BTC/EUR', 'ETH/EUR'] },
  ]

  const timestamp = new Date().toISOString()
  
  for (const market of markets) {
    try {
      // Simuleer marktdata verzameling (in productie zou dit echte API calls zijn)
      const marketData = market.pairs.map(pair => ({
        price: Math.random() * 1000,
        volume: Math.random() * 1000000,
        timestamp,
        pair,
      }))

      // Sla data op in de database
      const { error } = await supabase
        .from('agent_collected_data')
        .insert({
          agent_id: market.source,
          data_type: 'market_data',
          content: marketData,
          source: market.source,
          collected_at: timestamp,
          confidence: 0.95
        })

      if (error) {
        console.error(`Error storing ${market.source} data:`, error)
      }
    } catch (error) {
      console.error(`Error collecting ${market.source} data:`, error)
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting market data collection...')
    await collectMarketData()
    
    return new Response(
      JSON.stringify({ message: 'Market data collection completed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in market-data-collector:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
