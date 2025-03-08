
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, LineChart, BarChart3, Info, X } from "lucide-react";
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
  const [showLegend, setShowLegend] = useState(false);
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
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
          <Button 
            size="sm" 
            variant={showLegend ? "default" : "outline"} 
            className="h-8 px-2 flex gap-1 items-center"
            onClick={() => setShowLegend(!showLegend)}
          >
            <Info className="h-3.5 w-3.5" /> 
            {showLegend ? "Hide Legend" : "Show Legend"}
          </Button>
          
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showLegend && (
        <div className="bg-card/90 backdrop-blur-sm border rounded-md p-3 animate-in fade-in-50 duration-200 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Chart Legend</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setShowLegend(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
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
      )}
    </div>
  );
};
