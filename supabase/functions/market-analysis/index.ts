
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
}

interface MarketAnalysis {
  recommendation: "BUY" | "SELL" | "OBSERVE" | "HOLD";
  confidence: number;
  reason: string;
}

const analyzeMarketData = (data: MarketData): MarketAnalysis | null => {
  if (!data) return null;

  try {
    if (data.change24h > 3) {
      return {
        recommendation: "BUY",
        confidence: 0.8,
        reason: "Strong positive trend"
      };
    } else if (data.change24h < -3) {
      return {
        recommendation: "SELL",
        confidence: 0.8,
        reason: "Strong negative trend"
      };
    } else if (data.volume > 1000000) {
      return {
        recommendation: "OBSERVE",
        confidence: 0.6,
        reason: "High trading volume"
      };
    }
    
    return {
      recommendation: "HOLD",
      confidence: 0.7,
      reason: "Stable market"
    };
  } catch (error) {
    console.error("Analysis error:", error);
    return null;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { marketData } = await req.json()
    
    if (!Array.isArray(marketData)) {
      throw new Error('Invalid market data format')
    }

    const analyses = marketData.map(data => ({
      symbol: data.symbol,
      analysis: analyzeMarketData(data)
    })).filter(result => result.analysis !== null)

    return new Response(
      JSON.stringify({ analyses }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in market-analysis function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
