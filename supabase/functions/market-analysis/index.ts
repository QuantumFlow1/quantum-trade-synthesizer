
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

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
  console.log(`[${new Date().toISOString()}] Analyzing market data for ${data.symbol}:`, data);
  
  try {
    // Price volatility calculation
    const priceRange = data.high24h - data.low24h;
    const volatility = (priceRange / data.low24h) * 100;
    
    // Volume analysis
    const avgVolume = 1000000; // Baseline for high volume
    const volumeRatio = data.volume / avgVolume;
    const isHighVolume = volumeRatio > 1;
    
    console.log(`[${new Date().toISOString()}] Calculated metrics for ${data.symbol}:`, {
      priceRange,
      volatility,
      volumeRatio,
      isHighVolume
    });
    
    // Enhanced trend analysis with multiple factors
    if (data.change24h > 3 && isHighVolume) {
      return {
        recommendation: "BUY",
        confidence: Math.min(0.9, 0.7 + (data.change24h / 10) + (volumeRatio / 10)),
        reason: `Strong upward trend (${data.change24h.toFixed(2)}%) with ${volumeRatio.toFixed(1)}x average volume`
      };
    } else if (data.change24h < -3 && isHighVolume) {
      return {
        recommendation: "SELL",
        confidence: Math.min(0.9, 0.7 + (Math.abs(data.change24h) / 10) + (volumeRatio / 10)),
        reason: `Strong downward trend (${data.change24h.toFixed(2)}%) with ${volumeRatio.toFixed(1)}x average volume`
      };
    } else if (volatility > 5 || isHighVolume) {
      return {
        recommendation: "OBSERVE",
        confidence: 0.6 + (volatility / 100),
        reason: `Significant volatility (${volatility.toFixed(2)}%) ${isHighVolume ? 'with high volume' : ''}`
      };
    }
    
    return {
      recommendation: "HOLD",
      confidence: 0.5,
      reason: "Stable market conditions with normal trading activity"
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Analysis error for ${data.symbol}:`, error);
    throw error;
  }
};

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Received request:`, {
    method: req.method,
    url: req.url
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log(`[${new Date().toISOString()}] Request data:`, requestData);

    if (!requestData) {
      throw new Error('Request body is empty');
    }

    const { data } = requestData;

    if (!data) {
      throw new Error('No market data provided in request');
    }

    // Handle both single market data and array of market data
    if (Array.isArray(data)) {
      console.log(`[${new Date().toISOString()}] Processing batch analysis for ${data.length} markets`);
      const analyses = data.map(marketData => {
        try {
          return {
            symbol: marketData.symbol,
            market: marketData.market,
            analysis: analyzeMarketData(marketData)
          };
        } catch (error) {
          console.error(`[${new Date().toISOString()}] Error analyzing ${marketData.symbol}:`, error);
          return {
            symbol: marketData.symbol,
            market: marketData.market,
            error: error.message
          };
        }
      });

      const response = { analyses, timestamp: new Date().toISOString() };
      console.log(`[${new Date().toISOString()}] Batch analysis complete:`, response);

      return new Response(
        JSON.stringify(response),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    } else {
      console.log(`[${new Date().toISOString()}] Processing single market analysis for ${data.symbol}`);
      const analysis = analyzeMarketData(data);
      
      const response = { 
        symbol: data.symbol,
        market: data.market,
        analysis,
        timestamp: new Date().toISOString()
      };

      console.log(`[${new Date().toISOString()}] Single analysis complete:`, response);

      return new Response(
        JSON.stringify(response),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Function error:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error',
        timestamp: new Date().toISOString(),
        details: error.stack,
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
