
import React from 'react';
import { Button } from "@/components/ui/button";
import { DollarSign, BarChart2, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { MarketData } from '../types';

interface MarketActionsProps {
  marketData: MarketData;
  onClose?: () => void;
}

export const MarketActions: React.FC<MarketActionsProps> = ({ marketData, onClose }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBuy = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade this asset",
        variant: "destructive",
      });
      return;
    }

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
        type: "buy",
        amount: 0.01, // Default small amount
        price: marketData.price,
        status: "pending",
      });

      if (tradeError) throw tradeError;

      // Call the update-positions edge function to process the trade
      const { error: updateError } = await supabase.functions.invoke("update-positions", {
        body: {
          trade: {
            user_id: user.id,
            pair_id: pairId,
            type: "buy",
            amount: 0.01,
            price: marketData.price,
          }
        }
      });

      if (updateError) throw updateError;

      toast({
        title: "Position Opened",
        description: `Successfully opened a position for ${marketData.symbol}`,
      });
      
      if (onClose) {
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      console.error("Error opening position:", error);
      toast({
        title: "Error",
        description: "Failed to open position. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSell = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade this asset",
        variant: "destructive",
      });
      return;
    }

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
        type: "sell",
        amount: 0.01, // Default small amount
        price: marketData.price,
        status: "pending",
      });

      if (tradeError) throw tradeError;

      toast({
        title: "Short Position Opened",
        description: `Successfully opened a short position for ${marketData.symbol}`,
      });
      
      if (onClose) {
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      console.error("Error opening short position:", error);
      toast({
        title: "Error",
        description: "Failed to open short position. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenTrade = () => {
    window.open(`https://www.coingecko.com/en/coins/${marketData.name?.toLowerCase().replace(/\s+/g, '-')}`, "_blank");
  };

  return (
    <div className="mt-8 flex justify-center gap-4">
      <Button className="bg-green-500 hover:bg-green-600" onClick={handleBuy}>
        <DollarSign className="h-4 w-4 mr-2" />
        Buy
      </Button>
      <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={handleSell}>
        <DollarSign className="h-4 w-4 mr-2" />
        Sell
      </Button>
      <Button variant="outline" onClick={handleOpenTrade}>
        <ExternalLink className="h-4 w-4 mr-2" />
        CoinGecko
      </Button>
    </div>
  );
};
