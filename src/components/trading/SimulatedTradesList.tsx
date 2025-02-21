
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SimulatedTrade, getSimulatedTrades, closeSimulatedTrade } from "@/services/simulatedTradeService";
import { Clock, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

const SimulatedTradesList = () => {
  const [trades, setTrades] = useState<SimulatedTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      const data = await getSimulatedTrades();
      setTrades(data);
    } catch (error) {
      console.error("Error loading trades:", error);
      toast({
        title: "Error",
        description: "Could not load simulated trades",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTrade = async (trade: SimulatedTrade) => {
    try {
      const currentPrice = 45000; // This should come from your market data
      const pnl = calculatePnL(trade, currentPrice);
      
      await closeSimulatedTrade(trade.id, currentPrice, pnl);
      
      toast({
        title: "Trade Closed",
        description: `Simulated trade closed with P&L: $${pnl.toFixed(2)}`,
      });
      
      loadTrades();
    } catch (error) {
      console.error("Error closing trade:", error);
      toast({
        title: "Error",
        description: "Could not close simulated trade",
        variant: "destructive",
      });
    }
  };

  const calculatePnL = (trade: SimulatedTrade, currentPrice: number) => {
    const multiplier = trade.type === "buy" ? 1 : -1;
    return (currentPrice - trade.entry_price) * trade.amount * multiplier;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-4 h-4 animate-spin" />
          <span>Loading simulated trades...</span>
        </div>
      </Card>
    );
  }

  if (trades.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No simulated trades yet</p>
          <p className="text-sm text-muted-foreground">
            Start a new simulated trade to practice your strategy
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {trades.map((trade) => (
        <Card key={trade.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                {trade.type === "buy" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <h4 className="font-medium">
                  Simulated {trade.type.toUpperCase()} #{trade.id.slice(0, 8)}
                </h4>
              </div>
              
              <div className="space-y-1 mt-2">
                <p className="text-sm text-muted-foreground">
                  Amount: {trade.amount} BTC
                </p>
                <p className="text-sm text-muted-foreground">
                  Entry Price: ${trade.entry_price.toFixed(2)}
                </p>
                {trade.exit_price && (
                  <p className="text-sm text-muted-foreground">
                    Exit Price: ${trade.exit_price.toFixed(2)}
                  </p>
                )}
                {trade.pnl !== null && (
                  <p className={`text-sm font-medium ${
                    trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    P&L: ${trade.pnl?.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            
            {trade.status === "active" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCloseTrade(trade)}
                className="ml-4"
              >
                Close Trade
              </Button>
            )}
          </div>
          
          {trade.ai_analysis && (
            <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">AI Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Confidence: {trade.ai_confidence}%
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default SimulatedTradesList;
