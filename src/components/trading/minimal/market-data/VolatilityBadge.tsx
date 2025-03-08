
import { Badge } from "@/components/ui/badge";
import { Sigma } from "lucide-react";

interface VolatilityBadgeProps {
  volatility: number;
  changePercent: number;
}

export const VolatilityBadge = ({ volatility, changePercent }: VolatilityBadgeProps) => {
  return (
    <Badge 
      variant="outline" 
      className={`ml-2 ${Math.abs(changePercent) > 2 ? 
        (changePercent > 0 ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30') : 
        'bg-blue-500/10 text-blue-500 border-blue-500/30'}`}
    >
      <Sigma className="h-3 w-3 mr-1" />
      Volatility: {volatility.toFixed(2)}%
    </Badge>
  );
};
