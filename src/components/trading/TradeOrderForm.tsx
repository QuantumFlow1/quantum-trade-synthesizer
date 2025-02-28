
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StandardOrderForm } from "./order-form/StandardOrderForm";
import { AdvancedOrderForm } from "./order-form/AdvancedOrderForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TradeOrderFormProps {
  apiStatus?: 'checking' | 'available' | 'unavailable';
}

export const TradeOrderForm = ({ apiStatus = 'unavailable' }: TradeOrderFormProps) => {
  const [orderMode, setOrderMode] = useState<string>("standard");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderExecutionType, setOrderExecutionType] = useState<"market" | "limit" | "stop" | "stop_limit">("market");
  const [amount, setAmount] = useState<string>("0.01");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [stopPrice, setStopPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number>(42000);
  const [advancedSignal, setAdvancedSignal] = useState<any>(null);
  const [localApiStatus, setLocalApiStatus] = useState<'checking' | 'available' | 'unavailable'>(apiStatus);

  const { toast } = useToast();

  // Update local API status when prop changes
  useEffect(() => {
    if (apiStatus !== localApiStatus) {
      setLocalApiStatus(apiStatus);
    }
  }, [apiStatus]);

  // Verify API status if it's checking
  useEffect(() => {
    if (localApiStatus === 'checking') {
      verifyApiStatus();
    }
  }, [localApiStatus]);

  // Simulate fetching current price
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small price fluctuations
      const newPrice = currentPrice + (Math.random() * 200 - 100);
      setCurrentPrice(Math.round(newPrice * 100) / 100);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const verifyApiStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      setLocalApiStatus('available');
      console.log("TradeOrderForm: API is available");
    } catch (error) {
      console.error("TradeOrderForm: Failed to verify API status:", error);
      setLocalApiStatus('unavailable');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the API is unavailable
    if (localApiStatus !== 'available') {
      toast({
        title: "Trading Niet Beschikbaar",
        description: "Trading services zijn momenteel niet beschikbaar. Probeer het later opnieuw.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      toast({
        title: "Order Geplaatst",
        description: `Uw ${orderType === "buy" ? "KOOP" : "VERKOOP"} ${orderExecutionType.toUpperCase()} order voor ${amount} BTC is succesvol geplaatst.`,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleSignalApplied = (direction: string, stopLossValue: string, takeProfitValue: string) => {
    setOrderType(direction.toLowerCase() as "buy" | "sell");
    setStopLoss(stopLossValue);
    setTakeProfit(takeProfitValue);
  };

  // Generate recommended stop loss and take profit values
  const stopLossPercentage = orderType === "buy" ? 5 : 7;
  const takeProfitPercentage = orderType === "buy" ? 10 : 12;
  const stopLossRecommendation = orderType === "buy" 
    ? currentPrice * (1 - stopLossPercentage/100) 
    : currentPrice * (1 + stopLossPercentage/100);
  const takeProfitRecommendation = orderType === "buy" 
    ? currentPrice * (1 + takeProfitPercentage/100) 
    : currentPrice * (1 - takeProfitPercentage/100);

  // Dummy AI analysis data
  const aiAnalysis = {
    confidence: 78,
    riskLevel: "Medium",
    recommendation: orderType === "buy" ? "Buy with stop-loss" : "Sell with limit",
    expectedProfit: `${takeProfitPercentage}% if executed correctly`,
    stopLossRecommendation: Math.round(stopLossRecommendation * 100) / 100,
    takeProfitRecommendation: Math.round(takeProfitRecommendation * 100) / 100,
    collaboratingAgents: ["TrendAnalyzer", "RiskProfiler", "VolatilityMonitor"]
  };

  const isApiAvailable = localApiStatus === 'available';
  const isApiChecking = localApiStatus === 'checking';

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      {isApiChecking && (
        <div className="mb-4 p-2 bg-blue-500/10 rounded-md flex items-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
          Controleren van verbinding met trading services...
        </div>
      )}
      
      {!isApiAvailable && !isApiChecking && (
        <div className="mb-4 p-2 bg-red-500/10 rounded-md flex items-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
          Trading services niet beschikbaar. U kunt de interface bekijken maar geen orders plaatsen.
        </div>
      )}
      
      <Tabs defaultValue="standard" onValueChange={setOrderMode}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Formulier</h2>
          <TabsList>
            <TabsTrigger value="standard">Standaard</TabsTrigger>
            <TabsTrigger value="advanced">Geavanceerd</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="standard">
          <StandardOrderForm
            orderType={orderType}
            orderExecutionType={orderExecutionType}
            amount={amount}
            limitPrice={limitPrice}
            stopPrice={stopPrice}
            stopLoss={stopLoss}
            takeProfit={takeProfit}
            isSubmitting={isSubmitting}
            stopLossRecommendation={stopLossRecommendation}
            takeProfitRecommendation={takeProfitRecommendation}
            apiStatus={localApiStatus}
            aiAnalysis={aiAnalysis}
            onOrderTypeChange={setOrderType}
            onOrderExecutionTypeChange={setOrderExecutionType}
            onAmountChange={setAmount}
            onLimitPriceChange={setLimitPrice}
            onStopPriceChange={setStopPrice}
            onStopLossChange={setStopLoss}
            onTakeProfitChange={setTakeProfit}
            onSubmit={handleSubmit}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedOrderForm
            currentPrice={currentPrice}
            advancedSignal={advancedSignal}
            setAdvancedSignal={setAdvancedSignal}
            apiEnabled={isApiAvailable}
            apiAvailable={isApiAvailable}
            onSignalApplied={handleSignalApplied}
            onSubmit={handleSubmit}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
