
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StandardOrderForm } from "./order-form/StandardOrderForm";
import { AdvancedOrderForm } from "./order-form/AdvancedOrderForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Simuleer het ophalen van de huidige prijs
  useEffect(() => {
    const interval = setInterval(() => {
      // Simuleer kleine prijsschommelingen
      const newPrice = currentPrice + (Math.random() * 200 - 100);
      setCurrentPrice(Math.round(newPrice * 100) / 100);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuleer API vertraging
    setTimeout(() => {
      toast({
        title: "Order geplaatst",
        description: `Uw ${orderType.toUpperCase()} ${orderExecutionType.toUpperCase()} order voor ${amount} BTC is succesvol geplaatst.`,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleSignalApplied = (direction: string, stopLossValue: string, takeProfitValue: string) => {
    setOrderType(direction.toLowerCase() as "buy" | "sell");
    setStopLoss(stopLossValue);
    setTakeProfit(takeProfitValue);
  };

  // Genereer aanbevolen stop loss en take profit waarden
  const stopLossPercentage = orderType === "buy" ? 5 : 7;
  const takeProfitPercentage = orderType === "buy" ? 10 : 12;
  const stopLossRecommendation = orderType === "buy" 
    ? currentPrice * (1 - stopLossPercentage/100) 
    : currentPrice * (1 + stopLossPercentage/100);
  const takeProfitRecommendation = orderType === "buy" 
    ? currentPrice * (1 + takeProfitPercentage/100) 
    : currentPrice * (1 - takeProfitPercentage/100);

  // Dummy AI analyse data
  const aiAnalysis = {
    confidence: 78,
    riskLevel: "Gemiddeld",
    recommendation: orderType === "buy" ? "Koop met stop-loss" : "Verkoop met limiet",
    expectedProfit: `${takeProfitPercentage}% bij correcte uitvoering`,
    stopLossRecommendation: Math.round(stopLossRecommendation * 100) / 100,
    takeProfitRecommendation: Math.round(takeProfitRecommendation * 100) / 100,
    collaboratingAgents: ["TrendAnalyzer", "RiskProfiler", "VolatilityMonitor"]
  };

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
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
            apiEnabled={true}
            apiAvailable={apiStatus === 'available'}
            onSignalApplied={handleSignalApplied}
            onSubmit={handleSubmit}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
