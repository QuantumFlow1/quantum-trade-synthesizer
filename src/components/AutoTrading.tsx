
import { PlayCircle, PauseCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const strategies = [
  {
    id: 1,
    name: "Mean Reversion BTC",
    status: "active",
    profit: "+12.3%",
    trades: 45,
  },
  {
    id: 2,
    name: "Trend Following ETH",
    status: "paused",
    profit: "+8.7%",
    trades: 23,
  },
  {
    id: 3,
    name: "Grid Trading GOLD",
    status: "active",
    profit: "+5.2%",
    trades: 67,
  },
];

const AutoTrading = () => {
  const { toast } = useToast();

  const handleStrategyToggle = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    toast({
      title: `Strategie ${newStatus}`,
      description: `Strategie #${id} is nu ${newStatus}`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Automatische Trading Strategieën</h2>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configureer
        </Button>
      </div>
      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
          >
            <div className="space-y-1">
              <div className="font-medium">{strategy.name}</div>
              <div className="text-sm text-muted-foreground">
                {strategy.trades} trades • Winst: {strategy.profit}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStrategyToggle(strategy.id, strategy.status)}
              >
                {strategy.status === "active" ? (
                  <PauseCircle className="w-4 h-4 mr-1" />
                ) : (
                  <PlayCircle className="w-4 h-4 mr-1" />
                )}
                {strategy.status === "active" ? "Pause" : "Start"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoTrading;
