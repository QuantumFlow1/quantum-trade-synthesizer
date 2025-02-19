
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "./use-toast";

export interface Position {
  id: string;
  pair_id: string;
  amount: number;
  average_entry_price: number;
  unrealized_pnl: number;
  created_at: string;
}

export const usePositions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase
          .from("positions")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        setPositions(data || []);
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast({
          title: "Error",
          description: "Failed to load positions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();

    // Subscribe to position updates
    const subscription = supabase
      .channel("positions_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "positions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPositions((current) => [...current, payload.new as Position]);
          } else if (payload.eventType === "UPDATE") {
            setPositions((current) =>
              current.map((pos) =>
                pos.id === payload.new.id ? (payload.new as Position) : pos
              )
            );
          } else if (payload.eventType === "DELETE") {
            setPositions((current) =>
              current.filter((pos) => pos.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { positions, isLoading };
};
