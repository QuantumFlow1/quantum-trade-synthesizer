
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place trades",
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

    if (orderExecutionType !== "market" && !limitPrice && !stopPrice) {
      toast({
        title: "Price Required",
        description: `Please enter a ${orderExecutionType} price`,
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
        stopPrice ? Number(stopPrice) : undefined
      );

      const order: TradeOrder = {
        type: orderType,
        orderType: orderExecutionType,
        amount: Number(amount),
        price: currentPrice,
        limitPrice: limitPrice ? Number(limitPrice) : undefined,
        stopPrice: stopPrice ? Number(stopPrice) : undefined,
      };

      if (stopLoss && !isNaN(Number(stopLoss))) {
        order.stopLoss = Number(stopLoss);
      }

      if (takeProfit && !isNaN(Number(takeProfit))) {
        order.takeProfit = Number(takeProfit);
      }

      onSubmitOrder(order);
      toast({
        title: "Order Submitted",
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
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
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
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : `Place ${orderType.toUpperCase()} ${orderExecutionType.toUpperCase()} Order`}
      </Button>
    </form>
  );
};
