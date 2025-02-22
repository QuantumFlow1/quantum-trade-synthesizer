
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrderParameters } from "./OrderParameters";
import { submitTrade } from "@/services/tradeService";
import { TradeOrder } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AIAnalysisCard } from "./AIAnalysisCard";
import { SimulationToggle } from "./SimulationToggle";
import { supabase } from "@/lib/supabase";

interface TradeOrderFormProps {
  currentPrice: number;
  onSubmitOrder: (order: TradeOrder) => void;
}

export const TradeOrderForm = ({ currentPrice, onSubmitOrder }: TradeOrderFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderExecutionType, setOrderExecutionType] = useState<"market" | "limit" | "stop" | "stop_limit">("market");
  const [amount, setAmount] = useState<string>("");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [stopPrice, setStopPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [isSimulated, setIsSimulated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState({
    confidence: 85,
    riskLevel: "medium",
    recommendation: "long",
    expectedProfit: "2.3%",
    stopLossRecommendation: currentPrice * 0.98,
    takeProfitRecommendation: currentPrice * 1.035,
    collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
  });

  const performTradeAnalysis = async () => {
    console.log("Requesting trade analysis...");
    try {
      const { data, error } = await supabase.functions.invoke('trading-analysis', {
        body: {
          riskLevel: "medium",
          simulationMode: isSimulated,
          rapidMode: false
        }
      });

      if (error) {
        console.error("Trade analysis error:", error);
        throw error;
      }

      console.log("Trade analysis response:", data);
      
      if (data) {
        setAiAnalysis({
          ...aiAnalysis,
          confidence: data.confidence,
          recommendation: data.recommendedAction === 'buy' ? 'long' : 'short',
          expectedProfit: `${(data.confidence * 0.1).toFixed(1)}%`,
          collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
        });
      }
    } catch (error) {
      console.error("Error performing trade analysis:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to perform trade analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authenticatie Vereist",
        description: "Log in om te kunnen handelen",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Ongeldig Bedrag",
        description: "Voer een geldig handelsvolume in",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First perform AI analysis
      await performTradeAnalysis();

      await submitTrade(
        user.id, 
        orderType, 
        orderExecutionType,
        Number(amount), 
        currentPrice,
        limitPrice ? Number(limitPrice) : undefined,
        stopPrice ? Number(stopPrice) : undefined,
        isSimulated
      );

      const order: TradeOrder = {
        type: orderType,
        orderType: orderExecutionType,
        amount: Number(amount),
        price: currentPrice,
        limitPrice: limitPrice ? Number(limitPrice) : undefined,
        stopPrice: stopPrice ? Number(stopPrice) : undefined,
        stopLoss: Number(aiAnalysis.stopLossRecommendation),
        takeProfit: Number(aiAnalysis.takeProfitRecommendation)
      };

      onSubmitOrder(order);
      toast({
        title: `${isSimulated ? "Simulated" : ""} Order Geplaatst`,
        description: `${orderType.toUpperCase()} ${orderExecutionType} order geplaatst voor ${amount} eenheden`,
      });

      // Reset formulier
      setAmount("");
      setLimitPrice("");
      setStopPrice("");
      setStopLoss("");
      setTakeProfit("");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Fout",
        description: "Kon order niet plaatsen. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AIAnalysisCard analysis={aiAnalysis} />
      
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
        <SimulationToggle 
          isSimulated={isSimulated}
          onToggle={setIsSimulated}
        />

        <OrderTypeSelector 
          value={orderType}
          onValueChange={setOrderType}
        />

        <div className="space-y-2">
          <Label>Order Uitvoering Type</Label>
          <Select 
            value={orderExecutionType}
            onValueChange={(value: "market" | "limit" | "stop" | "stop_limit") => setOrderExecutionType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market Order</SelectItem>
              <SelectItem value="limit">Limit Order</SelectItem>
              <SelectItem value="stop">Stop Order</SelectItem>
              <SelectItem value="stop_limit">Stop Limit Order</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <OrderParameters
          amount={amount}
          orderExecutionType={orderExecutionType}
          limitPrice={limitPrice}
          stopPrice={stopPrice}
          stopLoss={stopLoss}
          takeProfit={takeProfit}
          onAmountChange={setAmount}
          onLimitPriceChange={setLimitPrice}
          onStopPriceChange={setStopPrice}
          onStopLossChange={setStopLoss}
          onTakeProfitChange={setTakeProfit}
        />

        <Button 
          type="submit" 
          className={`w-full ${
            orderType === "buy" 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-red-500 hover:bg-red-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verwerken..." : `Plaats ${isSimulated ? "Simulated" : ""} ${orderType.toUpperCase()} ${orderExecutionType.toUpperCase()} Order`}
        </Button>
      </form>
    </div>
  );
};

