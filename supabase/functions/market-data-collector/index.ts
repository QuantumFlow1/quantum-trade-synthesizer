
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate mock market data
function generateMarketData() {
  const markets = ['NYSE', 'NASDAQ', 'AEX', 'DAX', 'CAC40', 'NIKKEI', 'HSI', 'SSE', 'Crypto'];
  const data = [];
  
  // Generate data for each market
  for (const market of markets) {
    const symbols = [];
    
    // Different number of symbols per market
    const symbolCount = market === 'Crypto' ? 5 : 
                        (market === 'NYSE' || market === 'NASDAQ') ? 8 : 4;
    
    // Generate symbols for this market
    for (let i = 1; i <= symbolCount; i++) {
      const basePrice = market === 'Crypto' ? (Math.random() * 50000 + 100) : 
                        (Math.random() * 200 + 10);
      
      const change = (Math.random() * 10 - 5) / 100; // -5% to +5%
      const volume = Math.floor(Math.random() * 1000000) + 100000;
      
      symbols.push({
        name: market === 'Crypto' ? 
              ['BTC', 'ETH', 'SOL', 'XRP', 'BNB'][i - 1] || `CRYPTO${i}` : 
              `${market}-S${i}`,
        price: basePrice,
        change: change,
        volume: volume,
        market: market,
        timestamp: new Date().toISOString()
      });
    }
    
    // Add symbols to data array
    data.push(...symbols);
  }
  
  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Parse the request body if present
    let params = {}
    if (req.body) {
      const body = await req.json()
      params = body
    }
    
    // If this is a status check, just return ok
    if (params.action === 'status_check') {
      return new Response(
        JSON.stringify({ status: 'ok', message: 'Market data collector is running' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Generate market data
    console.log('Generating market data...')
    const marketData = generateMarketData()
    console.log(`Market data generated: ${marketData.length} items`)
    
    // Return the market data
    return new Response(
      JSON.stringify(marketData),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error in market-data-collector:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    )
  }
})
