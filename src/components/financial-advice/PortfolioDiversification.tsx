
import { BarChart2 } from "lucide-react";

export const PortfolioDiversification = () => {
  return (
    <div className="p-4 rounded-lg bg-secondary/50">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <BarChart2 className="w-4 h-4" />
        Portfolio Diversificatie
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Aandelen</div>
          <div className="text-lg font-medium">40%</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Obligaties</div>
          <div className="text-lg font-medium">30%</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Crypto</div>
          <div className="text-lg font-medium">20%</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Grondstoffen</div>
          <div className="text-lg font-medium">10%</div>
        </div>
      </div>
    </div>
  );
};
