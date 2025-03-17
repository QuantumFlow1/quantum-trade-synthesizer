
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowUpDown, TrendingUp, BarChart3, RefreshCw, Info } from "lucide-react";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";
import { IndicatorType, useAdvancedIndicators } from "@/hooks/trading/useAdvancedIndicators";

export function AdvancedIndicatorsDemo() {
  const [data, setData] = useState<TradingDataPoint[]>(tradingDataService.getData());
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorType>('supertrend');
  const [period, setPeriod] = useState(14);
  const [multiplier, setMultiplier] = useState(3);
  
  const { results, isCalculating, error, indicatorInfo } = useAdvancedIndicators(data, selectedIndicator);
  
  const handleRefresh = () => {
    setData(tradingDataService.refreshData());
  };
  
  const renderIndicatorChart = () => {
    if (results.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No indicator data available
        </div>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.slice(-30)}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="close" stroke="#4ade80" dot={false} name="Price" />
          
          {results.length > 0 && selectedIndicator === 'supertrend' && (
            <>
              <Line 
                type="monotone" 
                data={results} 
                dataKey="value" 
                stroke="#8b5cf6" 
                dot={false} 
                name="SuperTrend" 
              />
              <Line 
                type="monotone" 
                data={results} 
                dataKey="upper" 
                stroke="#ef4444" 
                dot={false} 
                strokeDasharray="3 3" 
                name="Upper Band" 
              />
              <Line 
                type="monotone" 
                data={results} 
                dataKey="lower" 
                stroke="#10b981" 
                dot={false} 
                strokeDasharray="3 3" 
                name="Lower Band" 
              />
            </>
          )}
          
          {results.length > 0 && selectedIndicator === 'atr' && (
            <Line 
              type="monotone" 
              data={results} 
              dataKey="value" 
              stroke="#8b5cf6" 
              dot={false} 
              name="ATR" 
            />
          )}
          
          {results.length > 0 && selectedIndicator === 'adx' && (
            <>
              <Line 
                type="monotone" 
                data={results} 
                dataKey="value" 
                stroke="#8b5cf6" 
                dot={false} 
                name="ADX" 
              />
              <Line 
                type="monotone" 
                data={results} 
                dataKey="signal" 
                stroke="#10b981" 
                dot={false} 
                name="+DI" 
              />
              <Line 
                type="monotone" 
                data={results} 
                dataKey="histogram" 
                stroke="#ef4444" 
                dot={false} 
                name="-DI" 
              />
              <ReferenceLine y={25} stroke="#ffffff" strokeDasharray="3 3" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Advanced Technical Indicators
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh Data
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Select Indicator</label>
            <Select 
              value={selectedIndicator} 
              onValueChange={(value) => setSelectedIndicator(value as IndicatorType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supertrend">SuperTrend</SelectItem>
                <SelectItem value="atr">ATR</SelectItem>
                <SelectItem value="adx">ADX</SelectItem>
                <SelectItem value="keltner">Keltner Channels</SelectItem>
                <SelectItem value="ichimoku">Ichimoku Cloud</SelectItem>
                <SelectItem value="pivotPoints">Pivot Points</SelectItem>
                <SelectItem value="fibonacciRetrace">Fibonacci Retracement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Period</label>
            <div className="pt-2">
              <Slider
                value={[period]}
                min={5}
                max={50}
                step={1}
                onValueChange={(values) => setPeriod(values[0])}
              />
              <div className="flex justify-between text-xs mt-1">
                <span>5</span>
                <span>{period}</span>
                <span>50</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Multiplier</label>
            <div className="pt-2">
              <Slider
                value={[multiplier]}
                min={1}
                max={10}
                step={0.5}
                onValueChange={(values) => setMultiplier(values[0])}
              />
              <div className="flex justify-between text-xs mt-1">
                <span>1</span>
                <span>{multiplier}</span>
                <span>10</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <div className="h-9 flex items-center">
              {isCalculating ? (
                <span className="text-sm flex items-center text-blue-500">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Calculating...
                </span>
              ) : error ? (
                <span className="text-sm text-red-500">{error}</span>
              ) : (
                <span className="text-sm text-green-500">Ready</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-medium">{indicatorInfo.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{indicatorInfo.description}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-1" /> Learn More
              </Button>
            </div>
            
            {renderIndicatorChart()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">Interpretation</h3>
              <p className="text-sm">{indicatorInfo.interpretation}</p>
            </div>
            
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">Formula</h3>
              <p className="text-sm font-mono">{indicatorInfo.formula}</p>
              <h4 className="font-medium mt-4 mb-2">Parameters</h4>
              <ul className="text-sm space-y-1">
                {indicatorInfo.parameters.map((param, index) => (
                  <li key={index}>
                    <span className="font-medium">{param.name}:</span> {param.description} (Default: {param.defaultValue})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
