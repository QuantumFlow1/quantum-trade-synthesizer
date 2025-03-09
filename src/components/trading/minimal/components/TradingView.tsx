
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { CandlestickChart, LineChartIcon, BarChart as BarChartIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TradingViewProps {
  chartData: any[];
  apiStatus: string;
  useRealData?: boolean;
}

export const TradingView = ({ chartData, apiStatus, useRealData = false }: TradingViewProps) => {
  const [selectedInterval, setSelectedInterval] = useState("1d");
  const [chartType, setChartType] = useState("line");
  const [visibleIndicators, setVisibleIndicators] = useState({
    volume: true,
    ema: false,
    sma: true,
  });
  
  const toggleIndicator = (indicator: keyof typeof visibleIndicators) => {
    setVisibleIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // Generate EMA (Exponential Moving Average) data
  const getEMAData = (data: any[], period: number = 20) => {
    const k = 2 / (period + 1);
    let ema = data[0]?.close || 0;
    
    return data.map(item => {
      ema = item.close * k + ema * (1 - k);
      return ema;
    });
  };
  
  // Generate SMA (Simple Moving Average) data
  const getSMAData = (data: any[], period: number = 20) => {
    return data.map((item, index) => {
      if (index < period - 1) return null;
      
      let sum = 0;
      for (let i = 0; i < period; i++) {
        sum += data[index - i].close;
      }
      
      return sum / period;
    });
  };
  
  // Format data for SMA line
  const smaData = getSMAData(chartData, 20);
  
  // Format data for EMA line
  const emaData = getEMAData(chartData, 20);
  
  // Enhanced chart data with indicators
  const enhancedChartData = chartData.map((item, index) => ({
    ...item,
    formattedDate: formatDate(item.timestamp),
    sma: smaData[index],
    ema: emaData[index]
  }));
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Select value={selectedInterval} onValueChange={setSelectedInterval}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
              <SelectItem value="1w">1 week</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant={useRealData ? "default" : "outline"}>
            {useRealData ? "Real Data" : "Simulated"}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={chartType === "line" ? "default" : "outline"} 
            size="icon" 
            onClick={() => setChartType("line")}
            title="Line Chart"
          >
            <LineChartIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant={chartType === "area" ? "default" : "outline"} 
            size="icon" 
            onClick={() => setChartType("area")}
            title="Area Chart"
          >
            <BarChartIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant={chartType === "candle" ? "default" : "outline"} 
            size="icon" 
            onClick={() => setChartType("candle")}
            title="Candlestick Chart"
          >
            <CandlestickChart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {apiStatus === 'checking' && (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Loading market data...</p>
          </div>
        </div>
      )}
      
      {apiStatus !== 'checking' && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>BTC/USD {useRealData ? "Live Price" : "Simulated Price"}</span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={visibleIndicators.sma ? "default" : "outline"} 
                  className="h-6 px-2 text-xs"
                  onClick={() => toggleIndicator("sma")}
                >
                  SMA
                </Button>
                <Button 
                  size="sm" 
                  variant={visibleIndicators.ema ? "default" : "outline"} 
                  className="h-6 px-2 text-xs"
                  onClick={() => toggleIndicator("ema")}
                >
                  EMA
                </Button>
                <Button 
                  size="sm" 
                  variant={visibleIndicators.volume ? "default" : "outline"} 
                  className="h-6 px-2 text-xs"
                  onClick={() => toggleIndicator("volume")}
                >
                  Vol
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={enhancedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedDate" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
                    {visibleIndicators.sma && (
                      <Line type="monotone" dataKey="sma" stroke="#ff7300" dot={false} strokeWidth={2} />
                    )}
                    {visibleIndicators.ema && (
                      <Line type="monotone" dataKey="ema" stroke="#387908" dot={false} strokeWidth={2} />
                    )}
                  </AreaChart>
                ) : (
                  <LineChart data={enhancedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedDate" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
                    {visibleIndicators.sma && (
                      <Line type="monotone" dataKey="sma" stroke="#ff7300" dot={false} strokeWidth={2} />
                    )}
                    {visibleIndicators.ema && (
                      <Line type="monotone" dataKey="ema" stroke="#387908" dot={false} strokeWidth={2} />
                    )}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            
            {visibleIndicators.volume && (
              <div className="h-[100px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enhancedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedDate" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="volume" stroke="#82ca9d" fillOpacity={1} fill="url(#colorVolume)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {apiStatus === 'unavailable' && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            Market data API is currently unavailable. Using simulated data instead.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${chartData[chartData.length - 1]?.close.toFixed(2) || "0.00"}</p>
            <p className={`text-sm ${chartData[chartData.length - 1]?.trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {chartData[chartData.length - 1]?.trend === "up" ? "↑" : "↓"} 
              {(Math.random() * 2).toFixed(2)}% Today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(chartData[chartData.length - 1]?.volume / 1000000).toFixed(2)}M</p>
            <p className="text-sm text-gray-500">
              {useRealData ? "Based on real market data" : "Simulated market activity"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${chartData[chartData.length - 1]?.trend === "up" ? "bg-green-500" : "bg-red-500"}`} 
                  style={{ width: `${chartData[chartData.length - 1]?.trend === "up" ? "75%" : "25%"}` }}
                ></div>
              </div>
            </div>
            <p className="mt-2 text-sm">
              {chartData[chartData.length - 1]?.trend === "up" ? "Bullish" : "Bearish"} 
              {" "}({chartData[chartData.length - 1]?.trend === "up" ? "75%" : "25%"})
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
