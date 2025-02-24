
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: string;
}

interface TradingAnalysis {
  symbol: string;
  analysis: {
    trend: "bullish" | "bearish" | "neutral";
    strength: number;
    support: number;
    resistance: number;
    volume_analysis: string;
    recommendation: string;
  };
  timestamp: string;
}

function analyzeTradingData(data: MarketData): TradingAnalysis {
  const trend = data.change24h > 0 ? "bullish" : data.change24h < 0 ? "bearish" : "neutral";
  const strength = Math.abs(data.change24h);
  
  // Calculate basic support and resistance levels
  const range = data.high24h - data.low24h;
  const support = data.low24h + (range * 0.382); // Using Fibonacci ratio
  const resistance = data.low24h + (range * 0.618); // Using Fibonacci ratio
  
  // Volume analysis
  const volumeAnalysis = data.volume > 1000000 
    ? "High volume indicating strong market interest" 
    : "Normal trading volume";
  
  // Generate recommendation
  let recommendation = "Hold position";
  if (trend === "bullish" && data.price < resistance) {
    recommendation = "Consider buying with stop loss at support level";
  } else if (trend === "bearish" && data.price > support) {
    recommendation = "Consider selling with limit order at resistance level";
  }
  
  return {
    symbol: data.symbol,
    analysis: {
      trend,
      strength,
      support,
      resistance,
      volume_analysis: volumeAnalysis,
      recommendation
    },
    timestamp: new Date().toISOString()
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { marketData } = await req.json();
    console.log('Analyzing market data:', marketData);
    
    if (!Array.isArray(marketData)) {
      throw new Error('Market data must be an array');
    }
    
    const analyses = marketData.map(analyzeTradingData);
    console.log('Trading analyses:', analyses);
    
    return new Response(
      JSON.stringify({
        analyses,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    );
  } catch (error) {
    console.error('Error in trading-analysis:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      },
    );
  }
})
