
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Trade {
  id: number;
  market: string;
  type: "BUY" | "SELL";
  amount: string;
  price: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
}

const pendingTrades: Trade[] = [
  {
    id: 1,
    market: "BTC/USD",
    type: "BUY",
    amount: "0.5 BTC",
    price: "$45,234.12",
    status: "pending",
    timestamp: "2 min ago",
  },
  {
    id: 2,
    market: "EUR/USD",
    type: "SELL",
    amount: "10,000 EUR",
    price: "$1.0923",
    status: "pending",
    timestamp: "5 min ago",
  },
];

const TradeControls = () => {
  const { toast } = useToast();

  const handleApprove = (tradeId: number) => {
    toast({
      title: "Trade Approved",
      description: `Trade #${tradeId} has been approved and will be executed.`,
      variant: "default",
    });
  };

  const handleReject = (tradeId: number) => {
    toast({
      title: "Trade Rejected",
      description: `Trade #${tradeId} has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pending Trades</h2>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
          <AlertTriangle className="w-4 h-4 mr-1" />
          {pendingTrades.length} Pending
        </Badge>
      </div>
      <div className="space-y-4">
        {pendingTrades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{trade.market}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    trade.type === "BUY"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {trade.type}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Amount: {trade.amount} • Price: {trade.price}
              </div>
              <div className="text-xs text-muted-foreground">{trade.timestamp}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-green-500/20 hover:text-green-400"
                onClick={() => handleApprove(trade.id)}
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-red-500/20 hover:text-red-400"
                onClick={() => handleReject(trade.id)}
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeControls;
