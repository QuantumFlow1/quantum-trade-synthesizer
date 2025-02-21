
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface TradingAnalysis {
  shouldTrade: boolean;
  recommendedAction: 'buy' | 'sell';
  recommendedAmount: number;
  confidence: number;
  currentPrice: number;
}

console.log("Trading analysis function started");

serve(async (req) => {
  try {
    const { riskLevel, simulationMode, rapidMode } = await req.json();
    console.log(`Analyzing market with settings:`, { riskLevel, simulationMode, rapidMode });

    // Simulated market analysis
    const currentPrice = 45000 + (Math.random() * 1000 - 500);
    const volatility = rapidMode ? 0.015 : 0.008; // Higher volatility in rapid mode
    const priceChange = currentPrice * (Math.random() * volatility - volatility/2);
    
    console.log(`Current price: ${currentPrice}, Price change: ${priceChange}`);

    // Rapid mode has more aggressive trading conditions
    const shouldTrade = rapidMode 
      ? Math.random() > 0.4  // 60% chance to trade in rapid mode
      : Math.random() > 0.7; // 30% chance to trade in normal mode

    const recommendedAction = priceChange > 0 ? 'buy' : 'sell';
    
    // Calculate confidence based on various factors
    const trendStrength = Math.abs(priceChange) / (currentPrice * volatility);
    const baseConfidence = trendStrength * 100;
    const confidence = Math.min(Math.max(baseConfidence, 50), 95);

    // Adjust trading amount based on risk level and mode
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
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error('Error in trading analysis:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
