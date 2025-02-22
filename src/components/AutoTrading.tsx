
import { PlayCircle, PauseCircle, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const strategies = [
  {
    id: 1,
    name: "Gemiddelde Herstel BTC",
    status: "active",
    profit: "+12.3%",
    trades: 45,
  },
  {
    id: 2,
    name: "Trend Volgen ETH",
    status: "paused",
    profit: "+8.7%",
    trades: 23,
  },
  {
    id: 3,
    name: "Grid Trading GOUD",
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
    const statusText = newStatus === "active" ? "geactiveerd" : "gepauzeerd";
    toast({
      title: `Strategie ${statusText}`,
      description: `Strategie #${id} is nu ${statusText}`,
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Automatische Handelsstrategieën</h2>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configureren
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">AI Handelsanalyse</h3>
            <Button variant="ghost" size="sm" onClick={toggleExpand}>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className={`transition-all duration-300 ${
            isExpanded ? "max-h-[800px]" : "max-h-[200px]"
          } overflow-hidden`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-muted-foreground">Betrouwbaarheid:</span>
                <span className="text-primary font-medium">85%</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-muted-foreground">Aanbeveling:</span>
                <span className="text-green-400 font-medium">LONG</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-muted-foreground">Verwachte Winst:</span>
                <span className="text-green-400 font-medium">2.3%</span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground block mb-2">Samenwerkende AI Agents:</span>
                <div className="text-sm bg-secondary/30 p-3 rounded-md">
                  Handels AI, Risicomanager, Marktanalyst
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-4">Actieve Strategieën</h3>
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
                  {strategy.status === "active" ? "Pauzeren" : "Starten"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTrading;
