
import { serve } from 'https://deno.fresh.dev/std@v9.6.1/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface MarketData {
  symbol: string;
  market: string;
  price: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

interface MarketAnalysis {
  recommendation: "BUY" | "SELL" | "OBSERVE" | "HOLD";
  confidence: number;
  reason: string;
}

const analyzeMarketData = (data: MarketData): MarketAnalysis | null => {
  console.log('Analyzing market data:', data);
  
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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data } = await req.json();
    console.log('Received market data:', data);

    if (!data) {
      throw new Error('No market data provided');
    }

    const analysis = analyzeMarketData(data);
    
    if (!analysis) {
      throw new Error('Failed to analyze market data');
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in market-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});
