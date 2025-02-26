
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardViewProps {
  systemLoad: number;
  errorRate: number;
}

const DashboardView = ({
  systemLoad,
  errorRate
}: DashboardViewProps) => {
  const [formattedMarketData, setFormattedMarketData] = useState<any[]>([]);
  const [formattedSentimentData, setFormattedSentimentData] = useState<any[]>([]);

  // Query to fetch users count from the profiles table
  const { data: userCountData, isLoading: userCountLoading } = useQuery({
    queryKey: ['userCount'],
    queryFn: async () => {
      try {
        console.log("Fetching user count...");
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Error fetching user count:', error);
          throw error;
        }
        
        console.log("User count fetched:", count);
        return count || 0;
      } catch (err) {
        console.error('Error in user count query:', err);
        return 0;
      }
    }
  });

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

  const mockSentimentData = Array.from({ length: 24 }, (_, i) => ({
    id: `mock-sentiment-${i}`,
    collected_at: new Date(Date.now() - (i * 3600000)).toISOString(),
    data_type: 'social_sentiment',
    content: {
      sentiment: Math.random() * 2 - 1,
      confidence: Math.random() * 0.5 + 0.5
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

  const { data: sentimentData, isLoading: sentimentLoading, error: sentimentError } = useQuery({
    queryKey: ['sentimentData'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('agent_collected_data')
          .select('*')
          .eq('data_type', 'social_sentiment')
          .order('collected_at', { ascending: false })
          .limit(24);
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching sentiment data:', err);
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

    // Process sentiment data
    if (sentimentData && sentimentData.length > 0) {
      const processed = sentimentData.map(item => {
        try {
          // Handle both string and object content formats
          const contentData = typeof item.content === 'string' 
            ? JSON.parse(item.content) 
            : item.content;

          return {
            ...item,
            collected_at: item.collected_at,
            content: {
              sentiment: contentData.sentiment || 0,
              confidence: contentData.confidence || 0
            }
          };
        } catch (err) {
          console.error('Error processing sentiment data item:', err, item);
          return {
            ...item,
            content: { sentiment: 0, confidence: 0 }
          };
        }
      });
      
      setFormattedSentimentData(processed);
    } else {
      setFormattedSentimentData(mockSentimentData);
    }
  }, [marketData, sentimentData]);

  // Log data for debugging
  useEffect(() => {
    console.log('Market Data to display:', formattedMarketData);
    console.log('Sentiment Data to display:', formattedSentimentData);
    console.log('User count data:', userCountData);
  }, [formattedMarketData, formattedSentimentData, userCountData]);

  // Display mock data if real data is not available or empty
  const displayMarketData = formattedMarketData.length > 0 ? formattedMarketData : mockMarketData;
  const displaySentimentData = formattedSentimentData.length > 0 ? formattedSentimentData : mockSentimentData;

  // Format time for display
  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString();
    } catch (e) {
      console.error('Error formatting time:', e, dateString);
      return '';
    }
  };

  // Format date for tooltip
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      console.error('Error formatting date:', e, dateString);
      return '';
    }
  };

  if (marketError) {
    console.error('Market data error:', marketError);
  }

  if (sentimentError) {
    console.error('Sentiment data error:', sentimentError);
  }

  // Determine user count to display
  const displayUserCount = userCountData !== undefined ? userCountData : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background/80 border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userCountLoading ? (
                <span className="text-muted-foreground">Laden...</span>
              ) : (
                displayUserCount
              )}
            </div>
            <p className="text-xs text-muted-foreground">Actieve accounts</p>
          </CardContent>
        </Card>
        <Card className="bg-background/80 border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systeem Load</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemLoad}%</div>
            <p className="text-xs text-muted-foreground">Huidige belasting</p>
          </CardContent>
        </Card>
        <Card className="bg-background/80 border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorRate}%</div>
            <p className="text-xs text-muted-foreground">Laatste 24 uur</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card className="bg-background/80 border border-border/50">
          <CardHeader>
            <CardTitle>Social Sentiment Analysis</CardTitle>
            <CardDescription>Sentiment trend van sociale media</CardDescription>
          </CardHeader>
          <CardContent>
            {sentimentLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>Loading sentiment data...</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displaySentimentData}>
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
                    <Bar 
                      dataKey="content.sentiment" 
                      fill="#8884d8" 
                      name="Sentiment Score"
                      isAnimationActive={false}
                    />
                    <Bar 
                      dataKey="content.confidence" 
                      fill="#82ca9d" 
                      name="Confidence"
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
