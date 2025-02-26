
import { Position } from "@/hooks/use-positions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { AlertTriangle, BellRing, TrendingUp, PlusCircle } from "lucide-react";

interface PositionsListProps {
  positions: Position[];
  isLoading: boolean;
}

const PositionsList = ({ positions, isLoading }: PositionsListProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  console.log("PositionsList render - positions:", positions);
  console.log("PositionsList render - isLoading:", isLoading);

  const handleClosePosition = async (positionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("trades").insert({
        user_id: user.id,
        pair_id: positions.find((p) => p.id === positionId)?.pair_id,
        type: "sell",
        amount: positions.find((p) => p.id === positionId)?.amount,
        price: positions.find((p) => p.id === positionId)?.average_entry_price,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Position Closing",
        description: "Order placed to close position",
      });
    } catch (error) {
      console.error("Error closing position:", error);
      toast({
        title: "Error",
        description: "Failed to close position",
        variant: "destructive",
      });
    }
  };

  const handleCreateMockPosition = async () => {
    if (!user) return;

    try {
      // Create a mock position for demo purposes
      const { data: pairs } = await supabase
        .from("trading_pairs")
        .select("id")
        .eq("symbol", "BTC/USD")
        .maybeSingle();
        
      const pairId = pairs?.id || "00000000-0000-0000-0000-000000000000";
      
      const { error } = await supabase.from("positions").insert({
        user_id: user.id,
        pair_id: pairId,
        amount: (Math.random() * 0.5 + 0.1).toFixed(4),
        average_entry_price: Math.floor(Math.random() * 10000) + 30000,
        unrealized_pnl: (Math.random() * 2000 - 1000).toFixed(2),
      });

      if (error) throw error;

      toast({
        title: "Demo Position Created",
        description: "A mock position has been created for demonstration",
      });
    } catch (error) {
      console.error("Error creating mock position:", error);
      toast({
        title: "Error",
        description: "Failed to create mock position",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <BellRing className="w-4 h-4 animate-pulse" />
          <span>Loading positions...</span>
        </div>
      </Card>
    );
  }

  if (positions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No open positions</p>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <TrendingUp className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Your positions will appear here once you start trading
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handleCreateMockPosition}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Demo Position
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {positions.map((position) => (
        <Card key={position.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">Position #{position.id.slice(0, 8)}</h4>
              <div className="space-y-1 mt-2">
                <p className="text-sm text-muted-foreground">
                  Amount: {position.amount}
                </p>
                <p className="text-sm text-muted-foreground">
                  Entry Price: ${position.average_entry_price.toFixed(2)}
                </p>
                <p
                  className={`text-sm font-medium ${
                    position.unrealized_pnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  Unrealized P&L: ${position.unrealized_pnl.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClosePosition(position.id)}
              className="ml-4"
            >
              Close Position
            </Button>
          </div>
          
          {Math.abs(position.unrealized_pnl) > 1000 && (
            <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Large P&L Movement</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Consider taking profit or adjusting stop loss
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PositionsList;
