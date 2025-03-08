
import { TooltipProps } from "recharts";
import { TradingDataPoint } from "@/utils/tradingData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Custom tooltip component for better data display
export const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as TradingDataPoint;
    
    return (
      <Card className="border shadow-md p-0 min-w-[250px]">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Open:</span>
              <span className="font-medium">${dataPoint.open.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Close:</span>
              <span className={`font-medium ${dataPoint.close >= dataPoint.open ? 'text-green-500' : 'text-red-500'}`}>
                ${dataPoint.close.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">High:</span>
              <span className="font-medium text-green-500">${dataPoint.high.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Low:</span>
              <span className="font-medium text-red-500">${dataPoint.low.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-medium">{dataPoint.volume.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">RSI:</span>
              <span className={`font-medium ${
                dataPoint.rsi > 70 ? 'text-red-500' : dataPoint.rsi < 30 ? 'text-green-500' : ''
              }`}>
                {dataPoint.rsi.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <Badge 
              variant={dataPoint.trend === "up" ? "success" : "destructive"}
              className={`text-xs ${dataPoint.trend === "up" ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
            >
              {dataPoint.trend === "up" ? "Bullish" : "Bearish"}
            </Badge>
            
            <span className="text-xs text-muted-foreground">
              MACD: {dataPoint.macd.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
