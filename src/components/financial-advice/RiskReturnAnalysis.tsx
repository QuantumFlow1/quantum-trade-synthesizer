
import { TrendingUp } from "lucide-react";

export const RiskReturnAnalysis = () => {
  return (
    <div className="p-4 rounded-lg bg-secondary/50">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Risico-Rendement Analyse
      </h3>
      <div className="space-y-3">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Verwacht Rendement (Jaar)</div>
          <div className="text-lg font-medium text-green-400">+12.5%</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Risico Score</div>
          <div className="text-lg font-medium text-yellow-400">7/10</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Sharpe Ratio</div>
          <div className="text-lg font-medium">1.8</div>
        </div>
      </div>
    </div>
  );
};
