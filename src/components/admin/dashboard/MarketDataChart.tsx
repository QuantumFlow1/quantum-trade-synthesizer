
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatTime, formatDate } from "./dateFormatUtils";

const MarketDataChart = () => {
  const [formattedMarketData, setFormattedMarketData] = useState<any[]>([]);

  // Create mock data to use if real data is not available
  const mockMarketData = Array.from({ length: 24 }, (_, i) => ({
    id: `mock-market-${i}`,
    collected_at: new Date(Date.now() - (i * 3600000)).toISOString(),
    data_type: 'market_data',
    content: {
      price: 100 + Math.random() * 20 - 10,
      volume: 1000 + Math.random() * 500
    }
  }));

  const { data: marketData, isLoading: marketLoading, error: marketError } = useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('agent_collected_data')
          .select('*')
          .eq('data_type', 'market_data')
          .order('collected_at', { ascending: false })
          .limit(24);
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching market data:', err);
        return [];
      }
    }
  });

  // Process the data once it's loaded
  useEffect(() => {
    // Process market data
    if (marketData && marketData.length > 0) {
      const processed = marketData.map(item => {
        try {
          // Handle both string and object content formats
          const contentData = typeof item.content === 'string' 
            ? JSON.parse(item.content) 
            : item.content;
          
          // Extract first item from content array if it's an array
          const firstItem = Array.isArray(contentData) ? contentData[0] : contentData;
          
          // Create a simplified structure for the chart
          return {
            ...item,
            collected_at: item.collected_at,
            content: {
              // If content has a pair property with price, use that, otherwise use direct price
              price: firstItem.price || firstItem.pair?.price || 0,
              volume: firstItem.volume || 0
            }
          };
        } catch (err) {
          console.error('Error processing market data item:', err, item);
          return {
            ...item,
            content: { price: 0, volume: 0 }
          };
        }
      });
      
      setFormattedMarketData(processed);
    } else {
      setFormattedMarketData(mockMarketData);
    }
  }, [marketData]);

  // Log data for debugging
  useEffect(() => {
    console.log('Market Data to display:', formattedMarketData);
  }, [formattedMarketData]);

  // Display mock data if real data is not available or empty
  const displayMarketData = formattedMarketData.length > 0 ? formattedMarketData : mockMarketData;

  if (marketError) {
    console.error('Market data error:', marketError);
  }

  return (
    <Card className="bg-background/80 border border-border/50">
      <CardHeader>
        <CardTitle>Market Data Trend</CardTitle>
        <CardDescription>24-uurs markt activiteit</CardDescription>
      </CardHeader>
      <CardContent>
        {marketLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading market data...</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayMarketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="collected_at" 
                  tickFormatter={formatTime}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={formatDate}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="content.price" 
                  stroke="#8884d8" 
                  name="Price"
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="content.volume" 
                  stroke="#82ca9d" 
                  name="Volume"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketDataChart;
