
import { useAuth } from "@/components/auth/AuthProvider";
import { OrderTypeSelector } from "../OrderTypeSelector";
import { OrderParameters } from "../OrderParameters";
import { TradeOrder } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SimulationToggle } from "../SimulationToggle";
import { useTradeAnalysis } from "@/hooks/use-trade-analysis";
import { useTradeFormState } from "../TradeFormState";
import { OrderSubmitButton } from "./OrderSubmitButton";
import { useOrderSubmit } from "./OrderFormSubmit";

interface OrderFormProps {
  currentPrice: number;
  onSubmitOrder: (order: TradeOrder) => void;
  isSimulated: boolean;
  setIsSimulated: (value: boolean) => void;
}

export const OrderForm = ({ 
  currentPrice, 
  onSubmitOrder,
  isSimulated,
  setIsSimulated
}: OrderFormProps) => {
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
    isSubmitting,
    setIsSubmitting
  } = useTradeFormState();

  const { handleSubmit } = useOrderSubmit({
    user,
    orderType,
    orderExecutionType,
    amount,
    currentPrice,
    limitPrice,
    stopPrice,
    isSimulated,
    aiAnalysis,
    onSubmitOrder,
    onSubmitSuccess: () => {
      setAmount("");
      setLimitPrice("");
      setStopPrice("");
      setStopLoss("");
      setTakeProfit("");
    },
    onSubmitStart: () => setIsSubmitting(true),
    onSubmitEnd: () => setIsSubmitting(false)
  });

  return (
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

      <OrderSubmitButton
        orderType={orderType}
        isSimulated={isSimulated}
        orderExecutionType={orderExecutionType}
        isSubmitting={isSubmitting}
        isAnalyzing={isAnalyzing}
      />
    </form>
  );
};
