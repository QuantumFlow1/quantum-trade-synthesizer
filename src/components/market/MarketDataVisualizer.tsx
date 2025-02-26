
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area
} from "recharts";
import { MarketData } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketDataVisualizerProps {
  data: MarketData[];
  isLoading: boolean;
}

export const MarketDataVisualizer = ({ data, isLoading }: MarketDataVisualizerProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(data.length > 0 ? `${data[0].market}-${data[0].symbol}` : "");
  
  // Group data by market-symbol combination
  const symbolGroups = data.reduce((acc, item) => {
    const key = `${item.market}-${item.symbol}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, MarketData[]>);
  
  // Get unique market-symbol combinations for the dropdown
  const symbolOptions = Object.keys(symbolGroups).sort();
  
  // Get the data for the selected symbol
  const selectedData = symbolGroups[selectedSymbol] || [];
  
  if (isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center h-[400px]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-40 bg-gray-300 rounded mx-auto mb-4"></div>
          <div className="h-4 w-80 bg-gray-200 rounded mx-auto"></div>
        </div>
      </Card>
    );
  }
  
  if (data.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center h-[400px]">
        <div className="text-center text-muted-foreground">
          <p>No market data available to visualize</p>
        </div>
      </Card>
    );
  }
  
  // Format data for visualization
  const chartData = selectedData.map(item => ({
    timestamp: new Date(item.timestamp || Date.now()).toLocaleTimeString(),
    price: item.price,
    volume: item.volume,
    change: item.change24h,
    high: item.high24h,
    low: item.low24h
  }));
  
  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Market Data Visualization</h3>
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Symbol" />
            </SelectTrigger>
            <SelectContent>
              {symbolOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="price">
          <TabsList className="mb-4">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="combined">Combined</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="timestamp" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white"
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#82ca9d" 
                    strokeDasharray="5 5" 
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="low" 
                    stroke="#ff7300" 
                    strokeDasharray="5 5" 
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="volume">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="volume" fill="#8884d8" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="combined">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="volume" fill="#8884d8" yAxisId="right" isAnimationActive={false} />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#82ca9d" 
                    yAxisId="left" 
                    isAnimationActive={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="change" 
                    fill="#ffc658" 
                    stroke="#ff7300" 
                    yAxisId="left" 
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
