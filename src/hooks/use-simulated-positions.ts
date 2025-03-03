
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export interface SimulatedPosition {
  id: string;
  user_id: string;
  pair_id: string;
  amount: number;
  entry_price: number;
  exit_price?: number;
  pnl?: number;
  type: 'long' | 'short';
  status: 'pending' | 'active' | 'closed';
  strategy?: string;
  created_at: string;
  closed_at?: string;
  ai_confidence?: number;
  ai_analysis?: any;
  simulation_type: string;
  current_price?: number; // For UI calculations
  unrealized_pnl?: number; // For UI calculations
}

export const useSimulatedPositions = () => {
  const [positions, setPositions] = useState<SimulatedPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setPositions([]);
      setIsLoading(false);
      return;
    }

    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("simulated_trades")
          .select("*, trading_pairs(*)")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Enhance positions with calculated fields
        const enhancedPositions = data.map(pos => {
          // We'd normally fetch the current price from the API
          // Using a mock price for simulation
          const currentPrice = pos.entry_price * (1 + (Math.random() * 0.1 - 0.05));
          
          // Calculate unrealized P&L based on position type
          let unrealizedPnl = 0;
          if (pos.type === 'long') {
            unrealizedPnl = (currentPrice - pos.entry_price) * pos.amount;
          } else if (pos.type === 'short') {
            unrealizedPnl = (pos.entry_price - currentPrice) * pos.amount;
          }
          
          return {
            ...pos,
            current_price: currentPrice,
            unrealized_pnl: unrealizedPnl
          };
        });

        setPositions(enhancedPositions);
      } catch (error: any) {
        console.error("Error fetching simulated positions:", error);
        toast({
          title: "Error",
          description: "Failed to load simulated positions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();

    // Set up a subscription to listen for changes
    const subscription = supabase
      .channel('simulated_trades_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'simulated_trades',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          fetchPositions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, toast]);

  const closePosition = async (positionId: string, exitPrice?: number) => {
    if (!user) return;

    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    // If no exit price provided, use the current simulated price
    const finalExitPrice = exitPrice || position.current_price;
    
    // Calculate P&L
    let pnl = 0;
    if (position.type === 'long') {
      pnl = (finalExitPrice! - position.entry_price) * position.amount;
    } else if (position.type === 'short') {
      pnl = (position.entry_price - finalExitPrice!) * position.amount;
    }

    try {
      const { error } = await supabase
        .from("simulated_trades")
        .update({
          status: "closed",
          exit_price: finalExitPrice,
          pnl: pnl,
          closed_at: new Date().toISOString()
        })
        .eq("id", positionId);

      if (error) throw error;

      toast({
        title: "Simulation Closed",
        description: `Simulated position closed with ${pnl >= 0 ? 'profit' : 'loss'} of $${Math.abs(pnl).toFixed(2)}`,
      });
    } catch (error: any) {
      console.error("Error closing simulated position:", error);
      toast({
        title: "Error",
        description: "Failed to close simulated position",
        variant: "destructive",
      });
    }
  };

  return { positions, isLoading, closePosition };
};
