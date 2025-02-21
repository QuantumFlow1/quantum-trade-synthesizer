
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Trading analysis function invoked')
    const { riskLevel, simulationMode } = await req.json()
    console.log('Analyzing market with parameters:', { riskLevel, simulationMode })

    // Simulate market data fetching
    const currentPrice = 45000 + (Math.random() * 1000)
    console.log('Current market price:', currentPrice)

    // Risk-based analysis
    let confidence = 0
    let recommendedAction = 'hold'
    let recommendedAmount = 0

    switch(riskLevel) {
      case 'low':
        confidence = Math.floor(Math.random() * 20) + 60 // 60-80%
        recommendedAmount = 0.001 // Small position size
        break
      case 'medium':
        confidence = Math.floor(Math.random() * 20) + 70 // 70-90%
        recommendedAmount = 0.005 // Medium position size
        break
      case 'high':
        confidence = Math.floor(Math.random() * 20) + 80 // 80-100%
        recommendedAmount = 0.01 // Larger position size
        break
      default:
        confidence = 60
        recommendedAmount = 0.001
    }

    // Determine action based on simple price momentum
    const priceChange = Math.random() - 0.5 // Random price movement
    recommendedAction = priceChange > 0 ? 'buy' : 'sell'

    const analysis = {
      timestamp: new Date().toISOString(),
      currentPrice,
      confidence,
      recommendedAction,
      recommendedAmount,
      shouldTrade: confidence > 75, // Only trade if confidence is high enough
      riskScore: Math.floor(Math.random() * 100),
      marketCondition: confidence > 80 ? 'favorable' : 'volatile',
      trends: {
        shortTerm: recommendedAction === 'buy' ? 'bullish' : 'bearish',
        mediumTerm: confidence > 70 ? 'neutral' : 'bearish',
        longTerm: confidence > 80 ? 'bullish' : 'neutral'
      }
    }

    console.log('Analysis complete:', analysis)

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in trading analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
