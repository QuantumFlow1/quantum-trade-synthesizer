
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UsePositionsProps {
  marketName: string | null;
  userId: string | null;
}

export const usePositions = ({ marketName, userId }: UsePositionsProps) => {
  const [hasPositions, setHasPositions] = useState<boolean>(false);

  useEffect(() => {
    if (!userId || !marketName) return;

    const checkPositions = async () => {
      try {
        const { data: pairData } = await supabase
          .from("trading_pairs")
          .select("id")
          .eq("symbol", marketName)
          .maybeSingle();
        
        if (pairData?.id) {
          const { data: positions, error } = await supabase
            .from("positions")
            .select("*")
            .eq("user_id", userId)
            .eq("pair_id", pairData.id);
          
          if (!error && positions && positions.length > 0) {
            setHasPositions(true);
          }
        }
      } catch (error) {
        console.error("Error checking positions:", error);
      }
    };

    checkPositions();
  }, [userId, marketName]);

  return {
    hasPositions,
    setHasPositions
  };
};
