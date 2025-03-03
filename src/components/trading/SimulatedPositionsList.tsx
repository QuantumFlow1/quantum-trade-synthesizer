
import { SimulatedPosition } from "@/hooks/use-simulated-positions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BellRing, TrendingUp, PlusCircle } from "lucide-react";

interface SimulatedPositionsListProps {
  positions: SimulatedPosition[];
  isLoading: boolean;
  onPositionSelect?: (id: string) => void;
  selectedPositionId?: string | null;
  onClosePosition: (id: string) => void;
}

const SimulatedPositionsList = ({ 
  positions, 
  isLoading, 
  onPositionSelect, 
  selectedPositionId,
  onClosePosition
}: SimulatedPositionsListProps) => {
  
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <BellRing className="w-4 h-4 animate-pulse" />
          <span>Loading simulated positions...</span>
        </div>
      </Card>
    );
  }

  if (positions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No simulated positions</p>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <TrendingUp className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Simulated positions will appear here once you start trading in simulation mode
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {positions.map((position) => (
        <Card 
          key={position.id} 
          className={`p-4 cursor-pointer transition-all ${
            selectedPositionId === position.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onPositionSelect && onPositionSelect(position.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">
                Simulated {position.type === 'long' ? 'LONG' : 'SHORT'} #{position.id.slice(0, 8)}
              </h4>
              <div className="space-y-1 mt-2">
                <p className="text-sm text-muted-foreground">
                  Amount: {position.amount}
                </p>
                <p className="text-sm text-muted-foreground">
                  Entry Price: ${position.entry_price.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Current Price: ${position.current_price?.toFixed(2)}
                </p>
                <p
                  className={`text-sm font-medium ${
                    position.unrealized_pnl && position.unrealized_pnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  Unrealized P&L: ${position.unrealized_pnl?.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClosePosition(position.id);
              }}
              className="ml-4"
            >
              Close Simulated Position
            </Button>
          </div>
          
          {position.unrealized_pnl && Math.abs(position.unrealized_pnl) > 1000 && (
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

export default SimulatedPositionsList;
