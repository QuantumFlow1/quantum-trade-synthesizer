
import { PlayCircle, PauseCircle, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStrategyToggle = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    toast({
      title: `Strategie ${newStatus}`,
      description: `Strategie #${id} is nu ${newStatus}`,
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Automatische Trading Strategieën</h2>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configureer
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4 min-h-[400px]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">AI Trading Analysis</h3>
            <Button variant="ghost" size="sm" onClick={toggleExpand}>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className={`p-6 rounded-lg bg-secondary/50 transition-all duration-300 ${
            isExpanded ? "h-auto" : "h-[200px] overflow-hidden"
          }`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="text-primary font-medium">85%</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-muted-foreground">Recommendation:</span>
                <span className="text-green-400 font-medium">LONG</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-muted-foreground">Expected Profit:</span>
                <span className="text-green-400 font-medium">2.3%</span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block mb-2">Collaborating AI Agents:</span>
                <div className="text-sm bg-secondary/30 p-3 rounded-md">
                  Trading AI, Risk Manager, Market Analyzer
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 min-h-[400px]">
          <h3 className="text-lg font-medium">Active Strategies</h3>
          <div className="space-y-3">
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
      </div>
    </div>
  );
};

export default AutoTrading;
