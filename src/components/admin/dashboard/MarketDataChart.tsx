
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatTime, formatDate } from "./dateFormatUtils";
import { Skeleton } from "@/components/ui/skeleton";

// Define a type for market data
interface MarketDataPoint {
  timestamp: string;
  price: number;
  volume: number;
}

const MarketDataChart = () => {
  const [data, setData] = useState<MarketDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Generate mock data as a fallback
        const mockData: MarketDataPoint[] = [];
        const now = new Date();
        let basePrice = 35000 + Math.random() * 5000;
        
        // Create 24 hours of data points
        for (let i = 24; i >= 0; i--) {
          const timestamp = new Date(now.getTime() - i * 3600 * 1000).toISOString();
          
          // Create a somewhat realistic price movement
          const priceChange = (Math.random() - 0.5) * 200;
          basePrice += priceChange;
          
          // Volume tends to be higher during price movements
          const volume = 100 + Math.abs(priceChange) * 5 + Math.random() * 200;
          
          mockData.push({
            timestamp,
            price: basePrice,
            volume
          });
        }
        
        setData(mockData);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up interval to refresh data every minute
    const intervalId = setInterval(() => {
      fetchData();
    }, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Calculate domain for better visualization
  const minPrice = Math.min(...data.map(item => item.price), 30000);
  const maxPrice = Math.max(...data.map(item => item.price), 40000);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border rounded shadow">
          <p className="text-sm">{formatDate(label)}</p>
          <p className="text-sm text-blue-500">
            Price: ${Number(payload[0].value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          <p className="text-sm text-green-500">
            Volume: {Number(payload[1].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="bg-background/80 border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/80 border border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Market Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No market data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime} 
                  stroke="#888888"
                  tick={{ fill: '#888888', fontSize: 12 }}
                />
                <YAxis 
                  domain={[minPrice * 0.995, maxPrice * 1.005]} 
                  stroke="#888888"
                  tick={{ fill: '#888888', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDataChart;
