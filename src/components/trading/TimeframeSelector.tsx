
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TimeframeSelectorProps {
  currentTimeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";
  onTimeframeChange: (timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => void;
}

export const TimeframeSelector = ({ 
  currentTimeframe, 
  onTimeframeChange 
}: TimeframeSelectorProps) => {
  const timeframes: { value: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w"; label: string }[] = [
    { value: "1m", label: "1m" },
    { value: "5m", label: "5m" },
    { value: "15m", label: "15m" },
    { value: "1h", label: "1h" },
    { value: "4h", label: "4h" },
    { value: "1d", label: "1D" },
    { value: "1w", label: "1W" },
  ];

  return (
    <div className="flex items-center bg-secondary/10 backdrop-blur-md rounded-md border border-white/10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-2 border-r border-white/10">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Select Timeframe</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="flex">
        {timeframes.map((tf) => (
          <Button
            key={tf.value}
            variant="ghost"
            size="sm"
            className={`px-2 py-1 h-8 rounded-none ${
              currentTimeframe === tf.value
                ? "bg-primary/20 text-primary-foreground"
                : "hover:bg-primary/10"
            }`}
            onClick={() => onTimeframeChange(tf.value)}
          >
            {tf.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
