
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    setIsAnalyzing(true);
    console.log("Starting trade analysis...");

    try {
      const { data, error } = await supabase.functions.invoke('trading-analysis', {
        body: {
          riskLevel: "medium",
          simulationMode: isSimulated,
          rapidMode: false
        }
      });

      console.log("Trade analysis response received:", { data, error });

      if (error) {
        console.error("Trade analysis error:", error);
        toast({
          title: "Analysis Error",
          description: error.message || "Failed to perform trade analysis",
          variant: "destructive",
        });
        return false;
      }

      if (!data) {
        console.error("No data received from analysis");
        toast({
          title: "Analysis Error",
          description: "No analysis data received",
          variant: "destructive",
        });
        return false;
      }

      console.log("Updating AI analysis with:", data);
      setAiAnalysis({
        ...aiAnalysis,
        confidence: data.confidence || 85,
        recommendation: data.recommendedAction === 'buy' ? 'long' : 'short',
        expectedProfit: `${((data.confidence || 85) * 0.1).toFixed(1)}%`,
        collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
      });

      return true;
    } catch (error) {
      console.error("Error in performTradeAnalysis:", error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to trade",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid trading amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting trade analysis before submission");
      const analysisSuccessful = await performTradeAnalysis();
      
      if (!analysisSuccessful) {
        console.log("Trade analysis failed, aborting submission");
        return;
      }

      console.log("Submitting trade with analysis results");
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
        title: `${isSimulated ? "Simulated" : ""} Order Placed`,
        description: `${orderType.toUpperCase()} ${orderExecutionType} order placed for ${amount} units`,
      });

      // Reset form
      setAmount("");
      setLimitPrice("");
      setStopPrice("");
      setStopLoss("");
      setTakeProfit("");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Could not place order. Please try again.",
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
          <Label>Order Execution Type</Label>
          <Select 
            value={orderExecutionType}
            onValueChange={(value: "market" | "limit" | "stop" | "stop_limit") => setOrderExecutionType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select order type" />
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
          disabled={isSubmitting || isAnalyzing}
        >
          {isSubmitting ? "Processing..." : isAnalyzing ? "Analyzing..." : `Place ${isSimulated ? "Simulated" : ""} ${orderType.toUpperCase()} ${orderExecutionType.toUpperCase()} Order`}
        </Button>
      </form>
    </div>
  );
};
