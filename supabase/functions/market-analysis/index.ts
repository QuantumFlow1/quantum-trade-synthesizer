
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

const analyzeMarketData = (data: MarketData): MarketAnalysis => {
  console.log('Analyzing market data for symbol:', data.symbol);
  
  // Price volatility calculation
  const priceRange = data.high24h - data.low24h;
  const volatility = (priceRange / data.low24h) * 100;
  
  // Volume analysis
  const highVolume = data.volume > 1000000;
  
  // Trend analysis
  if (data.change24h > 3 && highVolume) {
    return {
      recommendation: "BUY",
      confidence: 0.85,
      reason: `Strong upward trend with high volume (${data.change24h.toFixed(2)}% change)`
    };
  } else if (data.change24h < -3 && highVolume) {
    return {
      recommendation: "SELL",
      confidence: 0.85,
      reason: `Strong downward trend with high volume (${data.change24h.toFixed(2)}% change)`
    };
  } else if (Math.abs(data.change24h) > 2) {
    return {
      recommendation: "OBSERVE",
      confidence: 0.7,
      reason: `Moderate volatility detected (${volatility.toFixed(2)}% range)`
    };
  }
  
  return {
    recommendation: "HOLD",
    confidence: 0.6,
    reason: "Stable market conditions"
  };
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

    // Handle both single market data and array of market data
    if (Array.isArray(data)) {
      console.log('Processing batch market data analysis');
      const analyses = data.map(marketData => ({
        symbol: marketData.symbol,
        market: marketData.market,
        analysis: analyzeMarketData(marketData)
      }));

      return new Response(
        JSON.stringify({ analyses }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    } else {
      console.log('Processing single market data analysis');
      const analysis = analyzeMarketData(data);
      
      return new Response(
        JSON.stringify({ 
          symbol: data.symbol,
          market: data.market,
          analysis 
        }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }
  } catch (error) {
    console.error('Error in market-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error',
        details: error.stack 
      }),
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

