
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { MarketData } from "../../types";

interface UseTradeActionsProps {
  marketName: string | null;
  userId: string | null;
  latestPrice: number;
}

export const useTradeActions = ({ marketName, userId, latestPrice }: UseTradeActionsProps) => {
  const { toast } = useToast();

  const handleBuyClick = async (
    amount: string, 
    stopLoss: string, 
    takeProfit: string,
    advancedOptions: boolean,
    setHasPositions: (value: boolean) => void,
    setCurrentTab: (tab: string) => void
  ) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade this asset",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: pairData, error: pairError } = await supabase
        .from("trading_pairs")
        .select("id")
        .eq("symbol", marketName)
        .maybeSingle();

      if (pairError) throw pairError;

      const pairId = pairData?.id || `${marketName?.replace('/', '_')}_default`;
      
      const tradeData = {
        user_id: userId,
        pair_id: pairId,
        type: "buy",
        amount: parseFloat(amount),
        price: latestPrice,
        status: "pending",
      };
      
      // Add stop loss and take profit if enabled
      if (advancedOptions) {
        if (stopLoss && parseFloat(stopLoss) > 0) {
          Object.assign(tradeData, { stop_price: parseFloat(stopLoss) });
        }
        
        if (takeProfit && parseFloat(takeProfit) > 0) {
          Object.assign(tradeData, { limit_price: parseFloat(takeProfit) });
        }
      }
      
      const { error: tradeError } = await supabase.from("trades").insert(tradeData);

      if (tradeError) throw tradeError;

      const { error: updateError } = await supabase.functions.invoke("update-positions", {
        body: {
          trade: {
            user_id: userId,
            pair_id: pairId,
            type: "buy",
            amount: parseFloat(amount),
            price: latestPrice,
          }
        }
      });

      if (updateError) throw updateError;

      toast({
        title: "Position Opened",
        description: `Successfully opened a position for ${marketName}`,
      });
      
      setHasPositions(true);
      setTimeout(() => {
        setCurrentTab("positions");
      }, 1000);
    } catch (error) {
      console.error("Error opening position:", error);
      toast({
        title: "Error",
        description: "Failed to open position. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSellClick = async (
    amount: string, 
    stopLoss: string, 
    takeProfit: string,
    advancedOptions: boolean
  ) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade this asset",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: pairData, error: pairError } = await supabase
        .from("trading_pairs")
        .select("id")
        .eq("symbol", marketName)
        .maybeSingle();

      if (pairError) throw pairError;

      const pairId = pairData?.id || `${marketName?.replace('/', '_')}_default`;
      
      const tradeData = {
        user_id: userId,
        pair_id: pairId,
        type: "sell",
        amount: parseFloat(amount),
        price: latestPrice,
        status: "pending",
      };
      
      // Add stop loss and take profit if enabled
      if (advancedOptions) {
        if (stopLoss && parseFloat(stopLoss) > 0) {
          Object.assign(tradeData, { stop_price: parseFloat(stopLoss) });
        }
        
        if (takeProfit && parseFloat(takeProfit) > 0) {
          Object.assign(tradeData, { limit_price: parseFloat(takeProfit) });
        }
      }
      
      const { error: tradeError } = await supabase.from("trades").insert(tradeData);

      if (tradeError) throw tradeError;

      toast({
        title: "Short Position Opened",
        description: `Successfully opened a short position for ${marketName}`,
      });
    } catch (error) {
      console.error("Error opening short position:", error);
      toast({
        title: "Error",
        description: "Failed to open position. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleBuyClick,
    handleSellClick
  };
};
