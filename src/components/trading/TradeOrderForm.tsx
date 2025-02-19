
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

interface TradeOrderFormProps {
  currentPrice: number;
  onSubmitOrder: (order: TradeOrder) => void;
}

interface TradeOrder {
  type: "buy" | "sell";
  amount: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
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
    console.log("Starting trade submission process");

    try {
      console.log("Fetching trading pair");
      const { data: pairs, error: pairError } = await supabase
        .from("trading_pairs")
        .select("id")
        .eq("symbol", "BTC/USD")
        .single();

      if (pairError || !pairs) {
        console.error("Trading pair error:", pairError);
        throw new Error("Trading pair not found");
      }
      console.log("Found trading pair:", pairs);

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

      console.log("Creating trade record");
      const { data: trade, error } = await supabase
        .from("trades")
        .insert({
          user_id: user.id,
          pair_id: pairs.id,
          type: orderType,
          amount: Number(amount),
          price: currentPrice,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Trade creation error:", error);
        throw error;
      }
      console.log("Trade created successfully:", trade);

      console.log("Calling update-positions function");
      const { error: updateError } = await supabase.functions.invoke('update-positions', {
        body: { trade }
      });

      if (updateError) {
        console.error("Position update error:", updateError);
        throw updateError;
      }
      console.log("Position update completed");

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
      <div className="space-y-2">
        <Label>Order Type</Label>
        <RadioGroup
          defaultValue="buy"
          onValueChange={(value) => setOrderType(value as "buy" | "sell")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="buy" id="buy" />
            <Label htmlFor="buy" className="flex items-center space-x-2 cursor-pointer">
              <ArrowUpCircle className="w-4 h-4 text-green-500" />
              <span>Buy</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sell" id="sell" />
            <Label htmlFor="sell" className="flex items-center space-x-2 cursor-pointer">
              <ArrowDownCircle className="w-4 h-4 text-red-500" />
              <span>Sell</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-background/50"
          placeholder="Enter amount..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stopLoss">Stop Loss</Label>
          <Input
            id="stopLoss"
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="bg-background/50"
            placeholder="Optional..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="takeProfit">Take Profit</Label>
          <Input
            id="takeProfit"
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="bg-background/50"
            placeholder="Optional..."
          />
        </div>
      </div>

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
