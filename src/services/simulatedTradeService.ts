
import { supabase } from "@/lib/supabase";

export type SimulatedTrade = {
  id: string;
  user_id: string;
  pair_id: string;
  type: "buy" | "sell";
  entry_price: number;
  exit_price?: number;
  amount: number;
  pnl?: number;
  status: "pending" | "active" | "closed";
  ai_analysis?: any;
  ai_confidence?: number;
  created_at?: string;
  closed_at?: string;
  simulation_type: string;
  strategy?: string;
  trade_duration?: string;
};

export const createSimulatedTrade = async (trade: Omit<SimulatedTrade, "id" | "user_id" | "created_at">) => {
  console.log("Creating simulated trade:", trade);
  
  const { data, error } = await supabase
    .from("simulated_trades")
    .insert(trade)
    .select()
    .single();

  if (error) {
    console.error("Error creating simulated trade:", error);
    throw error;
  }

  return data;
};

export const getSimulatedTrades = async () => {
  const { data, error } = await supabase
    .from("simulated_trades")
    .select("*, trading_pairs(symbol)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching simulated trades:", error);
    throw error;
  }

  return data;
};

export const updateSimulatedTrade = async (id: string, updates: Partial<SimulatedTrade>) => {
  console.log("Updating simulated trade:", id, updates);
  
  const { data, error } = await supabase
    .from("simulated_trades")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating simulated trade:", error);
    throw error;
  }

  return data;
};

export const closeSimulatedTrade = async (
  id: string, 
  exitPrice: number,
  pnl: number
) => {
  console.log("Closing simulated trade:", id, exitPrice, pnl);
  
  const { data, error } = await supabase
    .from("simulated_trades")
    .update({
      exit_price: exitPrice,
      pnl: pnl,
      status: "closed",
      closed_at: new Date().toISOString(),
      trade_duration: `${new Date().getTime() - new Date().getTime()} milliseconds`
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error closing simulated trade:", error);
    throw error;
  }

  return data;
};
