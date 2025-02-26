
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatTime, formatDate } from "./dateFormatUtils";
import { Skeleton } from "@/components/ui/skeleton";

// Define a proper type for sentiment data
interface SentimentDataPoint {
  id: string;
  collected_at: string;
  data_type: string;
  content: {
    sentiment: number;
    confidence: number;
  };
}

// Create a safer JSON.parse wrapper that doesn't use eval
const safeParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return null;
  }
};

const SentimentChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Generate mock data as a fallback
        const mockData = Array.from({ length: 24 }, (_, i) => ({
          id: `mock-sentiment-${i}`,
          collected_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
          data_type: "social_sentiment",
          content: {
            sentiment: (Math.random() * 2 - 1), // -1 to 1
            confidence: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
          }
        }));

        console.log("Sentiment Data to display:", mockData);

        // Map the data into the format needed for the chart
        const chartData = mockData.map((item) => ({
          timestamp: item.collected_at,
          sentiment: item.content.sentiment,
          confidence: item.content.confidence,
        })).reverse(); // Reverse to show oldest first

        setData(chartData);
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up interval to refresh data every 5 minutes
    const intervalId = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate domain for better visualization
  const minSentiment = Math.min(...data.map(item => item.sentiment), -0.5);
  const maxSentiment = Math.max(...data.map(item => item.sentiment), 0.5);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border rounded shadow">
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
      <Card className="bg-background/80 border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Social Media Sentiment</CardTitle>
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
        <CardTitle className="text-sm font-medium">Social Media Sentiment</CardTitle>
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

export default SentimentChart;
