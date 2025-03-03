
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { ChartData, MarketData, ProfitLossRecord, TradeHistoryItem } from "./types";
import { ModalHeader } from "./detail/modal/ModalHeader";
import { ChartTabContent } from "./detail/modal/ChartTabContent";
import { TradeTabContent } from "./detail/modal/TradeTabContent";
import { PositionsTabContent } from "./detail/modal/PositionsTabContent";
import { PerformanceTabContent } from "./detail/modal/PerformanceTabContent";

interface MarketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketName: string | null;
  marketData: ChartData[];
}

export const MarketDetailModal = ({
  isOpen,
  onClose,
  marketName,
  marketData
}: MarketDetailModalProps) => {
  const [amount, setAmount] = useState<string>("0.01");
  const [leverage, setLeverage] = useState<string>("1");
  const [orderType, setOrderType] = useState<string>("market");
  const [currentTab, setCurrentTab] = useState<string>("chart");
  const [hasPositions, setHasPositions] = useState<boolean>(false);
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [profitLoss, setProfitLoss] = useState<ProfitLossRecord[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const latestData = marketData[marketData.length - 1];
  const previousPrice = marketData.length > 1 ? marketData[marketData.length - 2].price : latestData.price;
  const isPriceUp = latestData.price > previousPrice;
  const change24h = ((latestData.price - previousPrice) / previousPrice) * 100;

  const fullMarketData: MarketData = {
    symbol: marketName || "BTC/USD",
    name: marketName?.split('/')[0] || "Bitcoin",
    price: latestData.price,
    volume: latestData.volume,
    high: latestData.high,
    low: latestData.low,
    timestamp: Date.now(),
    change24h: change24h,
    high24h: Math.max(...marketData.map(d => d.price)),
    low24h: Math.min(...marketData.map(d => d.price)),
    marketCap: latestData.price * 19000000,
    totalVolume24h: latestData.volume,
    circulatingSupply: 19000000,
    totalSupply: 21000000,
    rank: 1,
    ath: latestData.price * 1.5,
    athDate: new Date().toISOString(),
    atl: latestData.price * 0.2,
    atlDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString(),
    priceChange7d: change24h * 1.2,
    priceChange30d: change24h * 0.8,
  };

  useEffect(() => {
    if (!user || !marketName) return;

    const checkPositions = async () => {
      try {
        const { data: pairData } = await supabase
          .from("trading_pairs")
          .select("id")
          .eq("symbol", marketName)
          .maybeSingle();
        
        if (pairData?.id) {
          const { data: positions, error } = await supabase
            .from("positions")
            .select("*")
            .eq("user_id", user.id)
            .eq("pair_id", pairData.id);
          
          if (!error && positions && positions.length > 0) {
            setHasPositions(true);
          }
        }
      } catch (error) {
        console.error("Error checking positions:", error);
      }
    };

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
            .eq("user_id", user.id)
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

          // Generate dummy profit/loss records for demonstration
          const plRecords: ProfitLossRecord[] = historyItems.map((trade, index) => ({
            id: `pl-${trade.id}`,
            tradeId: trade.id,
            timestamp: trade.timestamp,
            realized: trade.profitLoss || 0,
            unrealized: 0,
            percentage: trade.profitLossPercentage || 0,
            assetSymbol: trade.symbol,
            entryPrice: trade.price,
            currentPrice: latestData.price,
            quantity: trade.amount,
            costBasis: trade.amount * trade.price,
            currentValue: trade.amount * latestData.price,
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

    checkPositions();
    fetchTradeHistory();
  }, [user, marketName, isOpen, previousPrice, latestData.price, toast]);

  const handleBuyClick = async () => {
    if (!user) {
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
        user_id: user.id,
        pair_id: pairId,
        type: "buy",
        amount: parseFloat(amount),
        price: latestData.price,
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
            user_id: user.id,
            pair_id: pairId,
            type: "buy",
            amount: parseFloat(amount),
            price: latestData.price,
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

  const handleSellClick = async () => {
    if (!user) {
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
        user_id: user.id,
        pair_id: pairId,
        type: "sell",
        amount: parseFloat(amount),
        price: latestData.price,
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

  if (!marketName || !marketData.length) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <ModalHeader 
          marketName={marketName} 
          latestData={latestData} 
          isPriceUp={isPriceUp} 
        />

        <Tabs defaultValue="chart" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="chart">Price & Chart</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="positions" disabled={!hasPositions}>Your Positions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-6">
            <ChartTabContent 
              marketData={fullMarketData}
              marketName={marketName}
              data={marketData}
              isPriceUp={isPriceUp}
            />
          </TabsContent>
          
          <TabsContent value="trade">
            <TradeTabContent 
              marketData={fullMarketData}
              marketName={marketName}
              amount={amount}
              setAmount={setAmount}
              leverage={leverage}
              setLeverage={setLeverage}
              orderType={orderType}
              setOrderType={setOrderType}
              latestData={latestData}
              isPriceUp={isPriceUp}
              change24h={change24h}
              handleBuyClick={handleBuyClick}
              handleSellClick={handleSellClick}
              stopLoss={stopLoss}
              setStopLoss={setStopLoss}
              takeProfit={takeProfit}
              setTakeProfit={setTakeProfit}
              advancedOptions={advancedOptions}
              setAdvancedOptions={setAdvancedOptions}
            />
          </TabsContent>
          
          <TabsContent value="positions">
            <PositionsTabContent 
              marketName={marketName}
              hasPositions={hasPositions}
              amount={amount}
              leverage={leverage}
              latestData={latestData}
              isPriceUp={isPriceUp}
              setCurrentTab={setCurrentTab}
            />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceTabContent
              marketName={marketName}
              tradeHistory={tradeHistory}
              profitLoss={profitLoss}
              isLoading={isHistoryLoading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
