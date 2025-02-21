
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface TradingAnalysis {
  shouldTrade: boolean;
  recommendedAction: 'buy' | 'sell';
  recommendedAmount: number;
  confidence: number;
  currentPrice: number;
}

interface RequestBody {
  riskLevel: 'low' | 'medium' | 'high';
  simulationMode: boolean;
  rapidMode: boolean;
}

console.log("Trading analysis function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { riskLevel, simulationMode, rapidMode } = body;

    console.log(`Analyzing market with settings:`, { riskLevel, simulationMode, rapidMode });

    if (!riskLevel || !['low', 'medium', 'high'].includes(riskLevel)) {
      throw new Error('Invalid risk level specified');
    }

    // Simulated market analysis with improved randomization
    const basePrice = 45000;
    const volatilityFactor = rapidMode ? 0.015 : 0.008;
    const currentPrice = basePrice + (Math.random() * 1000 - 500);
    
    // Calculate price change with consideration for volatility
    const priceChange = currentPrice * (Math.random() * volatilityFactor - volatilityFactor/2);
    
    console.log(`Current price: ${currentPrice}, Price change: ${priceChange}`);

    // Trading decision logic with risk level consideration
    const riskFactors = {
      low: 0.7,    // 30% chance to trade
      medium: 0.5,  // 50% chance to trade
      high: 0.3     // 70% chance to trade
    };

    // Rapid mode increases trade frequency
    const baseThreshold = riskFactors[riskLevel];
    const tradeThreshold = rapidMode ? baseThreshold * 0.8 : baseThreshold;
    const shouldTrade = Math.random() > tradeThreshold;

    // Determine trade direction based on price movement and technical indicators
    const recommendedAction = priceChange > 0 ? 'buy' : 'sell';
    
    // Calculate confidence based on multiple factors
    const trendStrength = Math.abs(priceChange) / (currentPrice * volatilityFactor);
    const marketVolatility = volatilityFactor * 100;
    const tradingVolume = Math.random() * 100; // Simulated trading volume
    
    // Weighted confidence calculation
    const confidenceScore = (
      (trendStrength * 0.4) + 
      (marketVolatility * 0.3) + 
      (tradingVolume * 0.3)
    ) * 100;
    
    const confidence = Math.min(Math.max(confidenceScore, 50), 95);

    // Calculate recommended amount based on risk level and mode
    const baseAmount = 0.1;
    const riskMultiplier = {
      low: 1,
      medium: 2,
      high: 3
    }[riskLevel];
    
    const recommendedAmount = baseAmount * riskMultiplier * (rapidMode ? 0.5 : 1);

    const analysis: TradingAnalysis = {
      shouldTrade,
      recommendedAction,
      recommendedAmount,
      confidence,
      currentPrice
    };

    console.log('Analysis complete:', analysis);

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    )
  } catch (error) {
    console.error('Error in trading analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred in trading analysis'
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
