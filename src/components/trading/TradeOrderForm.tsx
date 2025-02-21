
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
import { Brain, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

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

  // Gesimuleerde AI agent analyse
  const aiAnalysis = {
    confidence: 85,
    riskLevel: "medium",
    recommendation: "long",
    expectedProfit: "2.3%",
    stopLossRecommendation: currentPrice * 0.98,
    takeProfitRecommendation: currentPrice * 1.035,
    collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
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
      <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">AI Trading Analyse</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Vertrouwen: {aiAnalysis.confidence}%</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>Risico: {aiAnalysis.riskLevel}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>Verwachte winst: {aiAnalysis.expectedProfit}</div>
            <div>Aanbeveling: {aiAnalysis.recommendation}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Samenwerkende AI Agents: {aiAnalysis.collaboratingAgents.join(", ")}</span>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="simulation-mode">Simulation Mode</Label>
          <Switch
            id="simulation-mode"
            checked={isSimulated}
            onCheckedChange={setIsSimulated}
          />
        </div>

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
