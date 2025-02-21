
import { supabase } from "@/lib/supabase";
import { TradeOrder } from "@/components/trading/types";

export const submitTrade = async (
  userId: string,
  orderType: "buy" | "sell",
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit",
  amount: number,
  currentPrice: number,
  limitPrice?: number,
  stopPrice?: number,
  isSimulated: boolean = false
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

  if (isSimulated) {
    const { data: simulatedTrade, error } = await supabase
      .from("simulated_trades")
      .insert({
        user_id: userId,
        pair_id: pairs.id,
        type: orderType,
        entry_price: currentPrice,
        amount: amount,
        status: "active",
        simulation_type: "daytrading",
        strategy: "manual"
      })
      .select()
      .single();

    if (error) {
      console.error("Simulated trade creation error:", error);
      throw error;
    }
    console.log("Simulated trade created successfully:", simulatedTrade);
    return simulatedTrade;
  }

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
