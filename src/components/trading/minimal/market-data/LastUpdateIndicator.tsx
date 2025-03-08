
import { Clock } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface LastUpdateIndicatorProps {
  lastUpdated: Date;
}

export const LastUpdateIndicator = ({ lastUpdated }: LastUpdateIndicatorProps) => {
  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    return seconds < 60 ? `${seconds}s ago` : `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{getTimeSinceUpdate()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last data update</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
