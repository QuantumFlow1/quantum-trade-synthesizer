
import { FC } from "react";
import { Clock, Layers } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TimeframeSelector } from "./TimeframeSelector";
import { toast } from "@/hooks/use-toast";

interface ChartControlsProps {
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";
  chartType: "candles" | "line" | "area" | "bars";
  showReplayMode: boolean;
  onTimeframeChange: (timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => void;
  onChartTypeChange: (type: "candles" | "line" | "area" | "bars") => void;
  onToggleReplayMode: () => void;
}

export const ChartControls: FC<ChartControlsProps> = ({
  timeframe,
  chartType,
  showReplayMode,
  onTimeframeChange,
  onChartTypeChange,
  onToggleReplayMode
}) => {
  const handleChartTypeChange = (type: "candles" | "line" | "area" | "bars") => {
    onChartTypeChange(type);
    
    toast({
      title: "Chart Type Changed",
      description: `Chart view switched to ${type}`,
      duration: 2000,
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <TimeframeSelector 
        currentTimeframe={timeframe} 
        onTimeframeChange={onTimeframeChange} 
      />
      
      <Select value={chartType} onValueChange={(value) => 
        handleChartTypeChange(value as "candles" | "line" | "area" | "bars")
      }>
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Chart Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Chart Type</SelectLabel>
            <SelectItem value="candles">Candlestick</SelectItem>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="area">Area</SelectItem>
            <SelectItem value="bars">Bars</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="replay-mode"
          checked={showReplayMode}
          onCheckedChange={onToggleReplayMode}
        />
        <Label htmlFor="replay-mode">Replay Mode</Label>
      </div>
    </div>
  );
};
