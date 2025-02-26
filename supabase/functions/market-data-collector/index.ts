
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Functie om willekeurige maar realistische marktdata te genereren
function generateMarketData() {
  // Definieer de markten en symbolen
  const markets = [
    { name: 'NYSE', symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'] },
    { name: 'NASDAQ', symbols: ['TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA'] },
    { name: 'AEX', symbols: ['ASML', 'RDSA', 'UNILEVER', 'ING', 'ABN'] },
    { name: 'DAX', symbols: ['BMW', 'SAP', 'SIEMENS', 'BAYER', 'BASF'] },
    { name: 'CAC40', symbols: ['LVMH', 'LOREAL', 'AIRBUS', 'RENAULT', 'BNP'] },
    { name: 'NIKKEI', symbols: ['TOYOTA', 'SONY', 'SOFTBANK', 'NISSAN', 'HONDA'] },
    { name: 'HSI', symbols: ['TENCENT', 'ALIBABA', 'HSBC', 'XIAOMI', 'MEITUAN'] },
    { name: 'SSE', symbols: ['ICBC', 'SINOPEC', 'PETROCHINA', 'BOC', 'CCB'] },
    { name: 'Crypto', symbols: ['BTC', 'ETH', 'BNB', 'XRP', 'ADA'] }
  ]
  
  const marketData = []
  
  for (const market of markets) {
    for (const symbol of market.symbols) {
      // Genereer de prijs (met wat random variatie)
      const basePrice = Math.random() * 1000 + 10
      const price = parseFloat(basePrice.toFixed(2))
      
      // Genereer de verandering (zowel positief als negatief mogelijk)
      const change24h = parseFloat((Math.random() * 10 - 5).toFixed(2))
      
      // Genereer volume
      const volume = parseFloat((Math.random() * 1000000 + 10000).toFixed(0))
      
      // Bereken high en low waarden op basis van prijs en change
      const high24h = parseFloat((price * (1 + Math.random() * 0.05)).toFixed(2))
      const low24h = parseFloat((price * (1 - Math.random() * 0.05)).toFixed(2))
      
      marketData.push({
        market: market.name,
        symbol: symbol,
        price: price,
        volume: volume,
        change24h: change24h,
        high24h: high24h,
        low24h: low24h,
        timestamp: new Date().toISOString()
      })
    }
  }
  
  return marketData
}

serve(async (req) => {
  console.log('Market data collector function triggered')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Genereer marktdata
    const marketData = generateMarketData()
    console.log(`Generated ${marketData.length} market data points`)
    
    // Valideer de data voor we het terugsturen
    if (!Array.isArray(marketData)) {
      throw new Error('Generated market data is not an array')
    }
    
    // Controleer dat alle items het juiste formaat hebben
    for (const item of marketData) {
      if (!item.market || !item.symbol || typeof item.price !== 'number') {
        console.error('Invalid market data item:', item)
        throw new Error('Some market data items have invalid format')
      }
    }
    
    // Stuur de data terug
    return new Response(
      JSON.stringify(marketData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in market-data-collector:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        status: 'error'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})
