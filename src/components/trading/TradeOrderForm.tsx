
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StandardOrderForm } from "./order-form/StandardOrderForm";
import { AdvancedOrderForm } from "./order-form/AdvancedOrderForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

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

  const { toast } = useToast();

  // Simulate fetching current price
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small price fluctuations
      const newPrice = currentPrice + (Math.random() * 200 - 100);
      setCurrentPrice(Math.round(newPrice * 100) / 100);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the API is unavailable
    if (apiStatus !== 'available') {
      toast({
        title: "Trading Unavailable",
        description: "Trading services are currently unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      toast({
        title: "Order Placed",
        description: `Your ${orderType.toUpperCase()} ${orderExecutionType.toUpperCase()} order for ${amount} BTC has been successfully placed.`,
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

  const isApiAvailable = apiStatus === 'available';
  const isApiChecking = apiStatus === 'checking';

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      {isApiChecking && (
        <div className="mb-4 p-2 bg-blue-500/10 rounded-md flex items-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
          Checking connection to trading services...
        </div>
      )}
      
      {!isApiAvailable && !isApiChecking && (
        <div className="mb-4 p-2 bg-red-500/10 rounded-md flex items-center text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
          Trading services unavailable. You can view the interface but cannot place orders.
        </div>
      )}
      
      <Tabs defaultValue="standard" onValueChange={setOrderMode}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Form</h2>
          <TabsList>
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
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
            apiStatus={apiStatus}
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
