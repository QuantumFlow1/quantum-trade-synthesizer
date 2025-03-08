
import { useEffect, useState } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Area,
  ReferenceLine,
  TooltipProps
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MinimalPriceChartProps {
  data: TradingDataPoint[];
}

// Custom tooltip component for better data display
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
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

export const MinimalPriceChart = ({ data }: MinimalPriceChartProps) => {
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  
  if (!data || data.length === 0) {
    return <div className="h-[400px] flex items-center justify-center">No data available</div>;
  }

  // Calculate min and max values for better axis scaling
  const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;
  
  // Find overbought/oversold levels in the data
  const overboughtRSI = data.some(d => d.rsi > 70);
  const oversoldRSI = data.some(d => d.rsi < 30);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-2">
        <Badge 
          variant="outline" 
          className={`cursor-pointer ${showVolume ? 'bg-primary/10' : ''}`}
          onClick={() => setShowVolume(!showVolume)}
        >
          Volume
        </Badge>
        <Badge 
          variant="outline" 
          className={`cursor-pointer ${showIndicators ? 'bg-primary/10' : ''}`}
          onClick={() => setShowIndicators(!showIndicators)}
        >
          Indicators
        </Badge>
      </div>
      
      <div className="h-[400px] bg-card border rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis 
              yAxisId="price" 
              domain={[minPrice, maxPrice]} 
              stroke="#888888"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="right"
                stroke="#888888"
                tickFormatter={(value) => `${value.toFixed(0)}`}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              name="Price"
              yAxisId="price"
            />
            {showIndicators && (
              <>
                <Line
                  type="monotone"
                  dataKey="sma"
                  stroke="#22c55e"
                  strokeWidth={1.5}
                  dot={false}
                  name="SMA"
                  yAxisId="price"
                />
                <Line
                  type="monotone"
                  dataKey="ema"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  dot={false}
                  name="EMA"
                  yAxisId="price"
                />
                {data[0].bollingerUpper && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="bollingerUpper"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      strokeWidth={1}
                      dot={false}
                      name="Upper Band"
                      yAxisId="price"
                    />
                    <Line
                      type="monotone"
                      dataKey="bollingerLower"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      strokeWidth={1}
                      dot={false}
                      name="Lower Band"
                      yAxisId="price"
                    />
                  </>
                )}
              </>
            )}
            {showVolume && (
              <Bar
                dataKey="volume"
                fill="#4f46e5"
                opacity={0.5}
                yAxisId="volume"
                name="Volume"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {showIndicators && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">RSI</h3>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="rsi"
                    stroke="#f59e0b"
                    dot={false}
                    name="RSI"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Oversold &lt; 30</span>
              <span>Overbought &gt; 70</span>
            </div>
            
            {oversoldRSI && (
              <Badge className="mt-2 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                Oversold Condition
              </Badge>
            )}
            
            {overboughtRSI && (
              <Badge className="mt-2 bg-red-500/10 text-red-500 hover:bg-red-500/20">
                Overbought Condition
              </Badge>
            )}
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">MACD</h3>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <ReferenceLine y={0} stroke="#888888" />
                  <Line
                    type="monotone"
                    dataKey="macd"
                    stroke="#06b6d4"
                    dot={false}
                    name="MACD"
                  />
                  <Line
                    type="monotone"
                    dataKey="macdSignal"
                    stroke="#d946ef"
                    dot={false}
                    name="Signal"
                  />
                  <Bar
                    dataKey="macdHistogram"
                    fill="#22c55e"
                    name="Histogram"
                    // Fix the error by removing the function and using a string instead
                    // Then we'll add a custom rendered element to show different colors
                  >
                    {data.map((entry, index) => (
                      <Bar 
                        key={`bar-${index}`}
                        fill={entry.macdHistogram >= 0 ? "#22c55e" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
