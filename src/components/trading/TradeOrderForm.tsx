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
import { Button } from "@/components/ui/button";
import { useTradeAnalysis } from "@/hooks/use-trade-analysis";
import { useTradeFormState } from "./TradeFormState";

interface TradeOrderFormProps {
  currentPrice: number;
  onSubmitOrder: (order: TradeOrder) => void;
}

export const TradeOrderForm = ({ currentPrice, onSubmitOrder }: TradeOrderFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { aiAnalysis, isAnalyzing, performTradeAnalysis } = useTradeAnalysis({
    isActive: true,
    riskLevel: "medium",
    isRapidMode: false,
    simulationMode: false
  });

  const {
    orderType,
    setOrderType,
    orderExecutionType,
    setOrderExecutionType,
    amount,
    setAmount,
    limitPrice,
    setLimitPrice,
    stopPrice,
    setStopPrice,
    stopLoss,
    setStopLoss,
    takeProfit,
    setTakeProfit,
    isSimulated,
    setIsSimulated,
    isSubmitting,
    setIsSubmitting
  } = useTradeFormState();

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
      const analysisSuccessful = await performTradeAnalysis(isSimulated);
      
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
