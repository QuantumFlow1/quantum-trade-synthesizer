
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DollarSign, ExternalLink, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { MarketData } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MarketActionsProps {
  marketData: MarketData;
  onClose?: () => void;
}

export const MarketActions: React.FC<MarketActionsProps> = ({ marketData, onClose }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>("0.01");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow valid numbers with up to 8 decimal places
    const value = e.target.value;
    if (/^\d*\.?\d{0,8}$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const openConfirmDialog = (type: "buy" | "sell") => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade this asset",
        variant: "destructive",
      });
      return;
    }

    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive",
      });
      return;
    }

    setTradeType(type);
    setIsConfirmOpen(true);
  };

  const executeTransaction = async () => {
    try {
      // Get the pair ID (using the symbol as identifier in this case)
      const { data: pairData, error: pairError } = await supabase
        .from("trading_pairs")
        .select("id")
        .eq("symbol", marketData.symbol)
        .maybeSingle();

      if (pairError) throw pairError;

      const pairId = pairData?.id || `${marketData.symbol.replace('/', '_')}_default`;
      
      // Create a new trade order
      const { error: tradeError } = await supabase.from("trades").insert({
        user_id: user.id,
        pair_id: pairId,
        type: tradeType,
        amount: parseFloat(amount),
        price: marketData.price,
        status: "pending",
      });

      if (tradeError) throw tradeError;

      // For buy orders, call the update-positions edge function to process the trade
      if (tradeType === "buy") {
        const { error: updateError } = await supabase.functions.invoke("update-positions", {
          body: {
            trade: {
              user_id: user.id,
              pair_id: pairId,
              type: tradeType,
              amount: parseFloat(amount),
              price: marketData.price,
            }
          }
        });

        if (updateError) throw updateError;
      }

      toast({
        title: tradeType === "buy" ? "Position Opened" : "Short Position Opened",
        description: `Successfully opened a ${tradeType === "buy" ? "" : "short "}position for ${marketData.symbol}`,
      });
      
      if (onClose) {
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      console.error(`Error opening ${tradeType === "buy" ? "" : "short "}position:`, error);
      toast({
        title: "Error",
        description: `Failed to open ${tradeType === "buy" ? "" : "short "}position. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const handleOpenTrade = () => {
    window.open(`https://www.coingecko.com/en/coins/${marketData.name?.toLowerCase().replace(/\s+/g, '-')}`, "_blank");
  };

  return (
    <>
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="amount" className="w-24">Amount:</Label>
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-full"
            placeholder="0.01"
          />
        </div>
        
        <div className="flex justify-center gap-4">
          <Button className="bg-green-500 hover:bg-green-600" onClick={() => openConfirmDialog("buy")}>
            <DollarSign className="h-4 w-4 mr-2" />
            Buy
          </Button>
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={() => openConfirmDialog("sell")}>
            <DollarSign className="h-4 w-4 mr-2" />
            Sell
          </Button>
          <Button variant="outline" onClick={handleOpenTrade}>
            <ExternalLink className="h-4 w-4 mr-2" />
            CoinGecko
          </Button>
        </div>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm {tradeType === "buy" ? "Buy" : "Sell"} Order</DialogTitle>
            <DialogDescription>
              You are about to {tradeType === "buy" ? "buy" : "sell"} {amount} {marketData.symbol.split('/')[0]} at approximately ${marketData.price.toFixed(2)}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                Trading cryptocurrencies involves risk. Only trade with funds you can afford to lose.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Amount:</p>
                <p>{amount} {marketData.symbol.split('/')[0]}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Estimated Value:</p>
                <p>${(parseFloat(amount) * marketData.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Price:</p>
                <p>${marketData.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Order Type:</p>
                <p>Market {tradeType === "buy" ? "Buy" : "Sell"}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={executeTransaction}
              className={tradeType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
            >
              Confirm {tradeType === "buy" ? "Buy" : "Sell"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
