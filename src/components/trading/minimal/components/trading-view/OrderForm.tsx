
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUpCircle, ArrowDownCircle, InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface OrderFormProps {
  currentPrice: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({ currentPrice }) => {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("0.01");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order placement
    setTimeout(() => {
      toast({
        title: `${orderType === "buy" ? "Buy" : "Sell"} Order Placed`,
        description: `Successfully placed a ${orderType} order for ${amount} BTC at $${currentPrice.toLocaleString()}.`,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary/20 p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Current BTC Price</p>
          <p className="text-2xl font-bold">${currentPrice.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">24h Change</p>
          <p className="text-lg font-medium text-green-500">+2.4%</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Order Type</Label>
          <RadioGroup
            value={orderType}
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
          <Label htmlFor="amount">Amount (BTC)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.001"
            min="0.001"
            className="bg-background/50"
          />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Estimated value:</span>
          <span>${(parseFloat(amount) * currentPrice).toLocaleString()}</span>
        </div>

        <Separator />

        <div className="pt-2">
          <Button 
            type="submit" 
            className={`w-full ${orderType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : `${orderType === "buy" ? "Buy" : "Sell"} Bitcoin`}
          </Button>
        </div>
      </form>

      <div className="rounded-lg border p-3 text-sm">
        <div className="flex gap-2 items-center text-muted-foreground">
          <InfoIcon className="h-4 w-4" />
          <p>Trading Tips</p>
        </div>
        <ul className="mt-2 space-y-1 list-disc pl-5 text-xs text-muted-foreground">
          <li>Set stop losses to manage risk</li>
          <li>Start with small positions</li>
          <li>Don't invest more than you can afford to lose</li>
        </ul>
      </div>
    </div>
  );
};
