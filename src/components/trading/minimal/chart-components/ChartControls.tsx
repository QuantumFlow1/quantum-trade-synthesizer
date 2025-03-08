
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Refresh, LineChart, BarChart3, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChartControlsProps {
  showVolume: boolean;
  setShowVolume: React.Dispatch<React.SetStateAction<boolean>>;
  showIndicators: boolean;
  setShowIndicators: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChartControls = ({
  showVolume,
  setShowVolume,
  showIndicators,
  setShowIndicators,
}: ChartControlsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <Switch
            id="volume-toggle"
            checked={showVolume}
            onCheckedChange={setShowVolume}
          />
          <label htmlFor="volume-toggle" className="text-sm">
            Volume
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <LineChart className="h-4 w-4 text-muted-foreground" />
          <Switch
            id="indicators-toggle"
            checked={showIndicators}
            onCheckedChange={setShowIndicators}
          />
          <label htmlFor="indicators-toggle" className="text-sm">
            Indicators
          </label>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 px-2 flex gap-1 items-center">
                <Info className="h-3.5 w-3.5" /> Chart Legend
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="w-80 p-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Chart Elements Guide</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-purple-500"></div>
                    <span>Price line (actual data)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] border-t-[2px] border-dashed border-amber-500"></div>
                    <span>Projected price (dashed line)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] border-t-[2px] border-dotted border-green-500"></div>
                    <span>Technical indicators (SMA, EMA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-amber-100/50 border border-amber-200/50"></div>
                    <span>Confidence bands (possible price range)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] border-t-[2px] border-gray-400"></div>
                    <span>Reference line (marks projection start)</span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Refresh className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
