
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
}

interface MarketAnalysis {
  recommendation: "KOOP" | "VERKOOP" | "OBSERVEER" | "HOUDEN";
  confidence: number;
  reason: string;
}

const analyzeMarketData = (data: MarketData): MarketAnalysis | null => {
  if (!data) return null;

  try {
    if (data.change24h > 3) {
      return {
        recommendation: "KOOP",
        confidence: 0.8,
        reason: "Sterke positieve trend"
      };
    } else if (data.change24h < -3) {
      return {
        recommendation: "VERKOOP",
        confidence: 0.8,
        reason: "Sterke negatieve trend"
      };
    } else if (data.volume > 1000000) {
      return {
        recommendation: "OBSERVEER",
        confidence: 0.6,
        reason: "Hoog handelsvolume"
      };
    }
    
    return {
      recommendation: "HOUDEN",
      confidence: 0.7,
      reason: "Stabiele markt"
    };
  } catch (error) {
    console.error("Analyse fout:", error);
    return null;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
