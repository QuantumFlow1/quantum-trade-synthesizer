
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatTime } from "@/components/admin/dashboard/dateFormatUtils";

interface SentimentDataPoint {
  timestamp: string;
  sentiment: number;
  confidence: number;
}

const UserSentimentAnalysis = () => {
  const [data, setData] = useState<SentimentDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Generate mock data as a fallback
        const mockData: SentimentDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - i * 3600 * 1000).toISOString(),
          sentiment: (Math.random() * 2 - 1), // -1 to 1
          confidence: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
        }));
        
        setData(mockData.reverse()); // Reverse to show oldest first
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Calculate domain for better visualization
  const minSentiment = Math.min(...data.map(item => item.sentiment), -0.5);
  const maxSentiment = Math.max(...data.map(item => item.sentiment), 0.5);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background/80 backdrop-blur-md border rounded shadow">
          <p className="text-sm">{formatDate(label)}</p>
          <p className="text-sm text-blue-500">Sentiment: {payload[0].value.toFixed(2)}</p>
          <p className="text-sm text-green-500">Confidence: {payload[1].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-background/80 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Social Media Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-background/80 backdrop-blur-md border border-border/50 hover:border-border/80 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Social Media Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No sentiment data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
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
                  domain={[minSentiment - 0.1, maxSentiment + 0.1]}
                  stroke="#888888"
                  tick={{ fill: '#888888', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                  dot={{ r: 1 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSentimentAnalysis;
