
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
  console.log(`[${new Date().toISOString()}] Starting analysis for ${data.symbol}`);
  console.log('Input data:', JSON.stringify(data, null, 2));
  
  try {
    // Price volatility calculation
    const priceRange = data.high24h - data.low24h;
    const volatility = (priceRange / data.low24h) * 100;
    
    // Volume analysis
    const avgVolume = 1000000; // Baseline for high volume
    const volumeRatio = data.volume / avgVolume;
    const isHighVolume = volumeRatio > 1;
    
    console.log('Calculated metrics:', {
      priceRange,
      volatility,
      volumeRatio,
      isHighVolume
    });
    
    let result: MarketAnalysis;
    
    // Enhanced trend analysis with multiple factors
    if (data.change24h > 3 && isHighVolume) {
      result = {
        recommendation: "BUY",
        confidence: Math.min(0.9, 0.7 + (data.change24h / 10) + (volumeRatio / 10)),
        reason: `Strong upward trend (${data.change24h.toFixed(2)}%) with ${volumeRatio.toFixed(1)}x average volume`
      };
    } else if (data.change24h < -3 && isHighVolume) {
      result = {
        recommendation: "SELL",
        confidence: Math.min(0.9, 0.7 + (Math.abs(data.change24h) / 10) + (volumeRatio / 10)),
        reason: `Strong downward trend (${data.change24h.toFixed(2)}%) with ${volumeRatio.toFixed(1)}x average volume`
      };
    } else if (volatility > 5 || isHighVolume) {
      result = {
        recommendation: "OBSERVE",
        confidence: 0.6 + (volatility / 100),
        reason: `Significant volatility (${volatility.toFixed(2)}%) ${isHighVolume ? 'with high volume' : ''}`
      };
    } else {
      result = {
        recommendation: "HOLD",
        confidence: 0.5,
        reason: "Stable market conditions with normal trading activity"
      };
    }
    
    console.log('Analysis result:', result);
    return result;
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Received request`);
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('Received request data:', JSON.stringify(requestData, null, 2));

    if (!requestData || !requestData.data) {
      console.error('Invalid request: Missing data');
      throw new Error('No market data provided in request');
    }

    const { data } = requestData;
    let response;

    // Handle both single market data and array of market data
    if (Array.isArray(data)) {
      console.log(`Processing batch analysis for ${data.length} markets`);
      const analyses = data.map(marketData => ({
        symbol: marketData.symbol,
        market: marketData.market,
        analysis: analyzeMarketData(marketData)
      }));

      response = { analyses, timestamp: new Date().toISOString() };
    } else {
      console.log(`Processing single market analysis for ${data.symbol}`);
      const analysis = analyzeMarketData(data);
      
      response = { 
        symbol: data.symbol,
        market: data.market,
        analysis,
        timestamp: new Date().toISOString()
      };
    }

    console.log('Sending response:', JSON.stringify(response, null, 2));

    return new Response(
      JSON.stringify(response),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Function error:', error);
    
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
