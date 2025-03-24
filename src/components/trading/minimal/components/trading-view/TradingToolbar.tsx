
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  BarChart4, 
  TrendingUp, 
  Crosshair, 
  Pencil, 
  PencilRuler,
  Square,
  Circle,
  ArrowUp,
  ArrowDown,
  Type,
  MousePointer,
  Trash2
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ChartDrawingTools } from "../../components/ChartDrawingTools";

interface TradingToolbarProps {
  chartType: string;
  setChartType: (type: string) => void;
}

export const TradingToolbar: React.FC<TradingToolbarProps> = ({
  chartType,
  setChartType
}) => {
  return (
    <div className="flex items-center p-2 border-b bg-background/50 overflow-x-auto">
      <div className="flex items-center gap-1 mr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={chartType === "candles" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setChartType("candles")}
                className="h-8 w-8 p-0"
              >
                <BarChart4 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Candlestick</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={chartType === "line" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setChartType("line")}
                className="h-8 w-8 p-0"
              >
                <LineChart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Line Chart</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={chartType === "area" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setChartType("area")}
                className="h-8 w-8 p-0"
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Area Chart</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator orientation="vertical" className="mx-2 h-8" />

      <div className="flex items-center gap-2">
        <ChartDrawingTools />

        <Separator orientation="vertical" className="mx-2 h-8" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8"
              >
                <Crosshair className="h-4 w-4 mr-2" />
                Indicators
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Technical Indicators</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
