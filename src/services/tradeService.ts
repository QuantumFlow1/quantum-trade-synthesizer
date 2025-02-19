
import { supabase } from "@/lib/supabase";
import { TradeOrder } from "@/components/trading/types";

export const submitTrade = async (
  userId: string,
  orderType: "buy" | "sell",
  amount: number,
  currentPrice: number
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
      amount: amount,
      price: currentPrice,
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
