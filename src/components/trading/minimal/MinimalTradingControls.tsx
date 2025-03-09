
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface MinimalTradingControlsProps {
  onRefresh: () => void;
  onTimeframeChange: (timeframe: string) => void;
  currentTimeframe: string;
}

export const MinimalTradingControls = ({ 
  onRefresh, 
  onTimeframeChange,
  currentTimeframe 
}: MinimalTradingControlsProps) => {
  const timeframes = ["5m", "15m", "30m", "1h", "4h", "1d", "1w"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trading Controls
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Timeframe</label>
            <Select 
              value={currentTimeframe} 
              onValueChange={onTimeframeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((tf) => (
                  <SelectItem key={tf} value={tf}>
                    {tf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Strategy</label>
            <Select defaultValue="default">
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="macd">MACD Crossover</SelectItem>
                <SelectItem value="rsi">RSI Oversold/Overbought</SelectItem>
                <SelectItem value="ma">Moving Average Cross</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
