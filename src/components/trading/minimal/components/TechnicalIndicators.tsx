
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Activity, Plus } from "lucide-react";
import { useState } from "react";

const indicatorCategories = [
  {
    name: "Trend",
    indicators: ["Moving Average", "MACD", "Bollinger Bands", "Parabolic SAR", "Ichimoku Cloud"]
  },
  {
    name: "Momentum",
    indicators: ["RSI", "Stochastic", "CCI", "Williams %R", "Awesome Oscillator"]
  },
  {
    name: "Volatility",
    indicators: ["Average True Range", "Standard Deviation", "Bollinger Bands Width"]
  },
  {
    name: "Volume",
    indicators: ["Volume", "OBV", "Money Flow Index", "Volume Profile"]
  }
];

export const TechnicalIndicators = () => {
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["Moving Average", "RSI", "MACD"]);
  
  const handleToggleIndicator = (indicator: string) => {
    if (activeIndicators.includes(indicator)) {
      setActiveIndicators(activeIndicators.filter(ind => ind !== indicator));
    } else {
      setActiveIndicators([...activeIndicators, indicator]);
    }
  };
  
  return (
    <div className="flex items-center mb-4">
      <div className="flex items-center gap-1.5 mr-2">
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Active Indicators:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeIndicators.map(indicator => (
          <Button
            key={indicator}
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => handleToggleIndicator(indicator)}
          >
            {indicator}
            <span className="ml-1 opacity-70">×</span>
          </Button>
        ))}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Indicator
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <h4 className="font-medium text-sm mb-3">Technical Indicators</h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {indicatorCategories.map(category => (
                <div key={category.name}>
                  <h5 className="text-sm font-medium text-muted-foreground mb-1">{category.name}</h5>
                  <div className="space-y-1">
                    {category.indicators.map(indicator => {
                      const isActive = activeIndicators.includes(indicator);
                      return (
                        <div 
                          key={indicator}
                          className={`flex items-center text-sm p-1.5 rounded hover:bg-muted cursor-pointer ${
                            isActive ? 'bg-muted/50' : ''
                          }`}
                          onClick={() => handleToggleIndicator(indicator)}
                        >
                          <div className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-primary' : 'bg-muted-foreground'}`} />
                          {indicator}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
