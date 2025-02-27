
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronDown, 
  BarChart2, 
  Percent, 
  TrendingUp, 
  Activity, 
  Gauge,
  Plus,
  Settings,
  X
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface IndicatorSelectorProps {
  currentIndicator: string;
  secondaryIndicator?: string;
  onIndicatorChange: (indicator: string) => void;
  onSecondaryIndicatorChange?: (indicator: string | undefined) => void;
  onOverlayToggle?: (overlayEnabled: boolean) => void;
}

export const AdvancedIndicatorSelector = ({ 
  currentIndicator, 
  secondaryIndicator,
  onIndicatorChange,
  onSecondaryIndicatorChange,
  onOverlayToggle
}: IndicatorSelectorProps) => {
  const [overlayMode, setOverlayMode] = useState(!!secondaryIndicator);
  const [indicatorSettings, setIndicatorSettings] = useState({
    period: 14,
    source: "close",
    color: "#8b5cf6",
    thickness: 2,
    opacity: 1
  });

  const handleOverlayToggle = (checked: boolean) => {
    setOverlayMode(checked);
    if (onOverlayToggle) {
      onOverlayToggle(checked);
    }
    
    // If turning off overlay, clear secondary indicator
    if (!checked && onSecondaryIndicatorChange) {
      onSecondaryIndicatorChange(undefined);
    }
  };
  
  const handleSecondaryIndicatorChange = (indicator: string) => {
    if (onSecondaryIndicatorChange) {
      onSecondaryIndicatorChange(indicator);
    }
  };
  
  const handlePeriodChange = (value: string) => {
    setIndicatorSettings({
      ...indicatorSettings,
      period: parseInt(value)
    });
  };
  
  const handleSourceChange = (value: string) => {
    setIndicatorSettings({
      ...indicatorSettings,
      source: value
    });
  };
  
  const handleThicknessChange = (value: number[]) => {
    setIndicatorSettings({
      ...indicatorSettings,
      thickness: value[0]
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={currentIndicator === "sma" ? "default" : "outline"}
          onClick={() => onIndicatorChange("sma")}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          SMA
        </Button>
        <Button
          variant={currentIndicator === "ema" ? "default" : "outline"}
          onClick={() => onIndicatorChange("ema")}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          EMA
        </Button>
        <Button
          variant={currentIndicator === "rsi" ? "default" : "outline"}
          onClick={() => onIndicatorChange("rsi")}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Activity className="h-4 w-4 mr-2" />
          RSI
        </Button>
        <Button
          variant={currentIndicator === "macd" ? "default" : "outline"}
          onClick={() => onIndicatorChange("macd")}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          MACD
        </Button>
        <Button
          variant={currentIndicator === "bollinger" ? "default" : "outline"}
          onClick={() => onIndicatorChange("bollinger")}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Activity className="h-4 w-4 mr-2" />
          Bollinger
        </Button>
        <Button
          variant={currentIndicator === "stochastic" ? "default" : "outline"}
          onClick={() => onIndicatorChange("stochastic")}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Percent className="h-4 w-4 mr-2" />
          Stochastic
        </Button>
        <Button
          variant={currentIndicator === "adx" ? "default" : "outline"}
          onClick={() => onIndicatorChange("adx")}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Gauge className="h-4 w-4 mr-2" />
          ADX
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-1 ml-auto">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Indicator Settings</h4>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="overlay-mode" 
                    checked={overlayMode}
                    onCheckedChange={(checked) => handleOverlayToggle(!!checked)}
                  />
                  <Label htmlFor="overlay-mode">Enable Overlay Mode</Label>
                </div>
                
                {overlayMode && (
                  <div className="ml-6 space-y-2 mt-2">
                    <Label htmlFor="secondary-indicator">Secondary Indicator</Label>
                    <Select 
                      value={secondaryIndicator} 
                      onValueChange={handleSecondaryIndicatorChange}
                    >
                      <SelectTrigger id="secondary-indicator">
                        <SelectValue placeholder="Select Indicator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Trend</SelectLabel>
                          <SelectItem value="sma">SMA</SelectItem>
                          <SelectItem value="ema">EMA</SelectItem>
                          <SelectItem value="wma">WMA</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Volatility</SelectLabel>
                          <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                          <SelectItem value="atr">ATR</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Momentum</SelectLabel>
                          <SelectItem value="rsi">RSI</SelectItem>
                          <SelectItem value="stochastic">Stochastic</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input 
                  id="period" 
                  type="number" 
                  min="1" 
                  max="200" 
                  value={indicatorSettings.period}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select 
                  value={indicatorSettings.source} 
                  onValueChange={handleSourceChange}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="close">Close</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="hl2">(High + Low)/2</SelectItem>
                    <SelectItem value="hlc3">(High + Low + Close)/3</SelectItem>
                    <SelectItem value="ohlc4">(Open + High + Low + Close)/4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Line Thickness</Label>
                <Slider 
                  defaultValue={[indicatorSettings.thickness]} 
                  max={5} 
                  step={0.5}
                  onValueChange={handleThicknessChange}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {overlayMode && secondaryIndicator && (
        <div className="flex items-center gap-2 mt-2 bg-secondary/10 py-1 px-2 rounded-md">
          <span className="text-xs text-muted-foreground">Overlay:</span>
          <div className="text-xs font-medium text-primary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            {secondaryIndicator.toUpperCase()}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 ml-auto" 
            onClick={() => handleSecondaryIndicatorChange(undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
