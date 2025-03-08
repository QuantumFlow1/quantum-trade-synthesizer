
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface MarketMetricItemProps {
  label: string;
  value: ReactNode;
  tooltip: string;
  className?: string;
}

export const MarketMetricItem = ({ label, value, tooltip, className = "bg-secondary/20" }: MarketMetricItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${className} p-3 rounded-lg`}>
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className="font-semibold">{value}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
