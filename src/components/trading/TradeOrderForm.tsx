
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrderParameters } from "./OrderParameters";
import { submitTrade } from "@/services/tradeService";
import { TradeOrder } from "./types";

interface TradeOrderFormProps {
  currentPrice: number;
  onSubmitOrder: (order: TradeOrder) => void;
}

export const TradeOrderForm = ({ currentPrice, onSubmitOrder }: TradeOrderFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
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

    setIsSubmitting(true);

    try {
      await submitTrade(user.id, orderType, Number(amount), currentPrice);

      const order: TradeOrder = {
        type: orderType,
        amount: Number(amount),
        price: currentPrice,
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
        description: `${orderType.toUpperCase()} order placed for ${amount} units at ${currentPrice}`,
      });

      // Reset form
      setAmount("");
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

      <OrderParameters
        amount={amount}
        stopLoss={stopLoss}
        takeProfit={takeProfit}
        onAmountChange={setAmount}
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
        {isSubmitting ? "Processing..." : `Place ${orderType.toUpperCase()} Order`}
      </Button>
    </form>
  );
};
