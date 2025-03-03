
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { TradeHistoryItem, ProfitLossRecord } from "../../types";

interface UseTradeHistoryProps {
  marketName: string | null;
  userId: string | null;
  latestPrice: number;
  previousPrice: number;
}

export const useTradeHistory = ({ marketName, userId, latestPrice, previousPrice }: UseTradeHistoryProps) => {
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [profitLoss, setProfitLoss] = useState<ProfitLossRecord[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!userId || !marketName) {
      setIsHistoryLoading(false);
      return;
    }

    const fetchTradeHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const { data: pairData } = await supabase
          .from("trading_pairs")
          .select("id")
          .eq("symbol", marketName)
          .maybeSingle();

        if (pairData?.id) {
          const { data, error } = await supabase
            .from("trades")
            .select("*")
            .eq("user_id", userId)
            .eq("pair_id", pairData.id)
            .order("created_at", { ascending: false });

          if (error) throw error;

          // Transform the data for our UI
          const historyItems: TradeHistoryItem[] = data.map(trade => ({
            id: trade.id,
            type: trade.type,
            symbol: marketName || "BTC/USD",
            amount: trade.amount,
            price: trade.price,
            timestamp: new Date(trade.created_at).getTime(),
            status: trade.status,
            totalValue: trade.amount * trade.price,
            fees: trade.amount * trade.price * 0.001,
            profitLoss: trade.type === 'sell' ? (trade.price - previousPrice) * trade.amount : undefined,
            profitLossPercentage: trade.type === 'sell' ? ((trade.price - previousPrice) / previousPrice) * 100 : undefined
          }));

          setTradeHistory(historyItems);

          // Generate profit/loss records
          const plRecords: ProfitLossRecord[] = historyItems.map((trade) => ({
            id: `pl-${trade.id}`,
            tradeId: trade.id,
            timestamp: trade.timestamp,
            realized: trade.profitLoss || 0,
            unrealized: 0,
            percentage: trade.profitLossPercentage || 0,
            assetSymbol: trade.symbol,
            entryPrice: trade.price,
            currentPrice: latestPrice,
            quantity: trade.amount,
            costBasis: trade.amount * trade.price,
            currentValue: trade.amount * latestPrice,
            status: 'closed'
          }));

          setProfitLoss(plRecords);
        }
      } catch (error) {
        console.error("Error fetching trade history:", error);
        toast({
          title: "Error",
          description: "Failed to load trade history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchTradeHistory();
  }, [userId, marketName, previousPrice, latestPrice, toast]);

  return {
    tradeHistory,
    profitLoss,
    isHistoryLoading
  };
};
