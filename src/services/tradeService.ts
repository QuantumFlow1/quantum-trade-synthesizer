import { supabase } from "@/lib/supabase";
import { TradeOrder, MarketData } from "@/components/trading/types";
import { MarketAnalyzer } from "@/utils/marketAnalyzer";

export const submitTrade = async (
  userId: string,
  orderType: "buy" | "sell",
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit",
  amount: number,
  currentPrice: number,
  limitPrice?: number,
  stopPrice?: number
) => {
  console.log("Starting trade submission process");

  const { data: pairs, error: pairError } = await supabase
    .from("trading_pairs")
    .select("id")
    .eq("symbol", "BTC/USD")
    .single();

  if (pairError || !pairs) {
    console.error("Trading pair error:", pairError);
    throw new Error("Trading pair not found");
  }
  console.log("Found trading pair:", pairs);

  const { data: trade, error } = await supabase
    .from("trades")
    .insert({
      user_id: userId,
      pair_id: pairs.id,
      type: orderType,
      order_type: orderExecutionType,
      amount: amount,
      price: currentPrice,
      limit_price: limitPrice,
      stop_price: stopPrice,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Trade creation error:", error);
    throw error;
  }
  console.log("Trade created successfully:", trade);

  const { error: updateError } = await supabase.functions.invoke('update-positions', {
    body: { trade }
  });

  if (updateError) {
    console.error("Position update error:", updateError);
    throw updateError;
  }
  console.log("Position update completed");

  return trade;
};

export const analyzeMarketTrend = async (marketData: MarketData[]) => {
  console.log("Starting market trend analysis");
  try {
    const analysis = MarketAnalyzer.analyzeMarketTrend(marketData);
    
    // Log analysis to Supabase for tracking
    const { error } = await supabase
      .from('market_analysis')
      .insert({
        trend: analysis.trend,
        current_ma: analysis.currentMA,
        previous_ma: analysis.previousMA,
        difference: analysis.difference,
        window_size: analysis.windowSize,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error("Error logging market analysis:", error);
    }

    return analysis;
  } catch (error) {
    console.error("Error in market trend analysis:", error);
    throw error;
  }
};
