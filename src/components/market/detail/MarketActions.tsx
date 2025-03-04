
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { MarketData } from '../types';
import { TradeForm } from './TradeForm';
import { TradeConfirmationDialog } from './TradeConfirmationDialog';

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
    <div className="max-w-md mx-auto">
      <TradeForm 
        amount={amount}
        onAmountChange={handleAmountChange}
        onBuyClick={() => openConfirmDialog("buy")}
        onSellClick={() => openConfirmDialog("sell")}
        onExternalClick={handleOpenTrade}
      />

      <TradeConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeTransaction}
        tradeType={tradeType}
        amount={amount}
        marketData={marketData}
      />
    </div>
  );
};
