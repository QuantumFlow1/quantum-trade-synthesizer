
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, TrendingDown, CandlestickChart, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Uitgebreide data met OHLC en technische indicatoren
const generateData = () => {
  const basePrice = 45000;
  const points = 24;
  return Array.from({ length: points }, (_, i) => {
    const hour = i.toString().padStart(2, '0') + ":00";
    const randomChange = Math.random() * 1000 - 500;
    const open = basePrice + randomChange;
    const high = open + Math.random() * 200;
    const low = open - Math.random() * 200;
    const close = (open + high + low) / 3;
    const volume = Math.random() * 100 + 50;
    
    // Technische indicatoren
    const sma = (open + close) / 2;
    const rsi = Math.random() * 100;
    const macd = Math.random() * 20 - 10;
    
    return {
      name: hour,
      open,
      high,
      low,
      close,
      volume,
      sma,
      rsi,
      macd,
      trend: close > open ? "up" : "down"
    };
  });
};

const TradingChart = () => {
  const [data, setData] = useState(generateData());
  const [view, setView] = useState<"price" | "volume" | "indicators">("price");
  const [indicator, setIndicator] = useState<"sma" | "rsi" | "macd">("sma");

  // Simuleer real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = newData[newData.length - 1].close;
        const randomChange = Math.random() * 1000 - 500;
        const newClose = lastValue + randomChange;
        const hour = new Date().getHours().toString().padStart(2, '0') + ":00";
        
        newData.push({
          name: hour,
          open: lastValue,
          high: Math.max(lastValue, newClose) + Math.random() * 200,
          low: Math.min(lastValue, newClose) - Math.random() * 200,
          close: newClose,
          volume: Math.random() * 100 + 50,
          sma: (lastValue + newClose) / 2,
          rsi: Math.random() * 100,
          macd: Math.random() * 20 - 10,
          trend: newClose > lastValue ? "up" : "down"
        });
        
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const latestPrice = data[data.length - 1].close;
  const priceChange = data[data.length - 1].close - data[0].close;
  const percentageChange = ((priceChange / data[0].close) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 backdrop-blur-xl bg-secondary/20 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Price</span>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="mt-2 text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            ${latestPrice.toFixed(2)}
          </div>
        </Card>

        <Card className="p-4 backdrop-blur-xl bg-secondary/20 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">24h Change</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className={`mt-2 text-2xl font-bold ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}>
            {isPositive ? "+" : ""}{percentageChange}%
          </div>
        </Card>

        <Card className="p-4 backdrop-blur-xl bg-secondary/20 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Volume</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            ${(data.reduce((acc, curr) => acc + curr.volume, 0) * 1000).toLocaleString()}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="price" className="w-full">
        <TabsList className="mb-4 bg-background/50 backdrop-blur-md">
          <TabsTrigger value="price" className="gap-2">
            <CandlestickChart className="w-4 h-4" />
            Price
          </TabsTrigger>
          <TabsTrigger value="volume" className="gap-2">
            <BarChart2 className="w-4 h-4" />
            Volume
          </TabsTrigger>
          <TabsTrigger value="indicators" className="gap-2">
            <Activity className="w-4 h-4" />
            Indicators
          </TabsTrigger>
        </TabsList>

        <TabsContent value="price">
          <div className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    backdropFilter: "blur(16px)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
                <ReferenceLine
                  y={data[0].close}
                  stroke="rgba(255,255,255,0.2)"
                  strokeDasharray="3 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="volume">
          <div className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    backdropFilter: "blur(16px)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="indicators">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={indicator === "sma" ? "default" : "outline"}
                onClick={() => setIndicator("sma")}
                className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
              >
                SMA
              </Button>
              <Button
                variant={indicator === "rsi" ? "default" : "outline"}
                onClick={() => setIndicator("rsi")}
                className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
              >
                RSI
              </Button>
              <Button
                variant={indicator === "macd" ? "default" : "outline"}
                onClick={() => setIndicator("macd")}
                className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
              >
                MACD
              </Button>
            </div>
            
            <div className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      backdropFilter: "blur(16px)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={indicator}
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingChart;
